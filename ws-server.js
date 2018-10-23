#!/usr/bin/env node
'use strict';
const WebSocketServer = require('websocket').server;
const http = require('http');
const fs = require('fs');

var server = http.createServer();
server.listen(3001, function() {
  console.log(new Date() + ' Server is listening on port 3001');
});

const wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser. You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: true
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('open', function(request) {
  console.log('---- open ----');
});

wsServer.on('error', function(e) {
  console.log(e);
});
wsServer.on('request', function(request) {
  console.log(request);
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log(
      new Date() + ' Connection from origin ' + request.origin + ' rejected.'
    );
    return;
  }

  var connection = request.accept('echo-protocol', request.origin);
  console.log(new Date() + ' Connection accepted.');
  connection.on('message', function(message) {
    console.log('message');
    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data);
      connection.sendUTF(message.utf8Data);
      wsServer.connections.forEach(conn => {
        if (conn === connection) {
          return;
        }
        conn.sendUTF(message.utf8Data);
      });
    }
  });
  connection.on('close', function(reasonCode, description) {
    console.log(
      new Date() + ' Peer ' + connection.remoteAddress + ' disconnected.'
    );
  });
});
