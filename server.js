'use strict';
const WebSocketServer = require('ws').Server;
const http = require('http');
const fs = require('fs');
const log4js = require('log4js');
// log4js.configure({
//   appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
//   categories: { default: { appenders: ['cheese'], level: 'error' } },
// });
const logger = log4js.getLogger();
logger.level = 'info';
const cookie = require('cookie');
const knex = require('knex');
const randomString = require('randomstring');
const utils = require('./utils');

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: 'UTC+9:00',
  charset: 'utf8mb4_unicode_ci',
};
const client = knex({
  client: 'mysql',
  connection: dbConfig,
});

var server = http.createServer();
server.listen(3000, function() {
  console.log(new Date() + ' Server is listening on port 3000');
});

function readFile(filename) {
  return new Promise((resolve, reject) => {
    return fs.readFile(filename, (err, file) => {
      if (err) {
        reject(err);
      }
      resolve(file);
    });
  });
}

const addMessage = async (content, userId) => {
  logger.info('[ADD_MESSAGE]:', userId, content);
  if (content === '') {
    return;
  }
  const ids = await client('comment').insert({
    content,
    user_id: userId,
    nice: 0,
  });
  const comment = JSON.parse(
    JSON.stringify(
      await client('comment')
        .select()
        .where({
          id: ids[0],
        }),
    ),
  );
  return comment[0];
};

const wsServer = new WebSocketServer({ server, clientTracking: true });

wsServer.on('open', request => {
  logger.info('[NEW_USER_OPEN_CONNECTION]:', request);
});

const countNice = async commentId => {
  const niceNum = JSON.parse(
    JSON.stringify(
      await client('nices')
        .count()
        .where({
          comment_id: commentId,
        }),
    ),
  )[0]['count(*)'];
  return niceNum;
};

const isAlreadyNiced = async (userId, commentId) => {
  const niceNum = JSON.parse(
    JSON.stringify(
      await client('nices')
        .count()
        .where({
          user_id: userId,
          comment_id: commentId,
        }),
    ),
  )[0]['count(*)'];
  return niceNum >= 1;
};

server.on('request', async (req, res) => {
  let cookies = cookie.parse(req.headers.cookie || '');
  let userId = cookies.ID;
  if (!cookies.ID) {
    userId = randomString.generate();
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('ID', userId, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 1 week
      }),
    );
  }
  if (req.url === '/index.html' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const file = await readFile('./build/index.html');
    res.write(file);
    res.end();
  } else if (!!req.url.match(/\/messages\/(\d+)/)) {
    const matched = req.url.match(/\/messages\/(\d+)/);
    const commentId = matched[1];

    // Increment
    if (await isAlreadyNiced(userId, commentId)) {
      logger.info('[UNDO_NICE]:', userId, commentId);
      await client('nices')
        .del()
        .where({
          user_id: userId,
          comment_id: commentId,
        });
    } else {
      logger.info('[ADD_NICE]:', userId, commentId);
      await client('nices').insert({
        user_id: userId,
        comment_id: commentId,
      });
    }
    const niceNum = await countNice(commentId);
    const comments = JSON.parse(
      JSON.stringify(
        await client('comment')
          .select()
          .where({
            id: commentId,
          }),
      ),
    );

    // Response
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    const comment = comments[0];
    comment.nice = niceNum;
    res.write(JSON.stringify(comment));
    res.end();
  } else if (req.url === '/users') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    let userNum = wsServer.clients.size;
    userNum = userNum === 0 ? 1 : userNum; // 0 はおかしい...
    res.write(JSON.stringify(userNum));
    res.end();
  } else if (req.url === '/messages') {
    const comments = await utils.getComments(client);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write(JSON.stringify(comments));
    res.end();
  } else if (req.url === '/bannar.png') {
    res.writeHead(200, { 'Content-Type': 'image/png' });
    const file = await readFile('./build/bannar.png');
    res.write(file);
    res.end();
  } else if (req.url === '/index.js') {
    res.writeHead(200, { 'Content-Type': 'text/javascript' });
    const file = await readFile('./build/index.js');
    res.write(file);
    res.end();
  } else if (req.url === '/favicon.ico') {
    res.writeHead(200, { 'Content-Type': 'image/x-icon' });
    const file = await readFile('./build/favicon.ico');
    res.end();
  } else if (!!req.url.match('js')) {
    const file = await readFile(`./build/${req.url}`);
    res.write(file);
    res.end();
  } else if (!!req.url.match('css')) {
    res.writeHead(200, { 'Content-Type': 'text/css' });
    const file = await readFile(`./build/${req.url}`);
    res.write(file);
    res.end();
  } else {
    res.writeHead(404);
    res.end();
  }
});

wsServer.on('connection', function(ws, req) {
  const nClients = wsServer.clients.size;
  logger.info('[CONNECTED_CLIENTS_NUM]:', nClients);
  wsServer.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ type: 'client_number', value: nClients }));
    }
  });
  ws.on('message', async function(message) {
    logger.info('[MESSAGE_RECEIVED]:', message);
    let cookies = cookie.parse(req.headers.cookie || '');
    if (!cookies.ID) {
      const userId = randomString.generate();
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('ID', userId, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // 1 week
        }),
      );
    }
    cookies = cookie.parse(req.headers.cookie || '');

    const data = JSON.parse(message);
    // Update number of nice
    switch (data.type) {
      case 'nice': {
        const niceNum = await countNice(data.value);
        wsServer.clients.forEach(client => {
          if (client.readyState === 1) {
            client.send(
              JSON.stringify({
                type: 'nice_update',
                value: { nice: niceNum, commentId: data.value },
              }),
            );
          }
        });
        return;
      }

      case 'message': {
        const comment = await addMessage(data.value, cookies.ID);
        wsServer.clients.forEach(client => {
          if (client.readyState === 1) {
            client.send(JSON.stringify({ type: 'message', value: comment }));
          }
        });
        return;
      }
    }
  });
  wsServer.on('error', function(e) {
    logger.error('WebSocket Server Error.', JSON.stringify(e));
  });
});

wsServer.on('close', function() {
  console.log('close');
});
