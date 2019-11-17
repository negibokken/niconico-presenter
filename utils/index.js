const knex = require('knex');
const devDbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'niconico_presenter',
  timezone: 'UTC+9:00',
  charset: 'utf8mb4_unicode_ci'
};
const devClient = knex({
  client: 'mysql',
  connection: devDbConfig
});
const getComments = async client => {
  let comments = JSON.parse(JSON.stringify(await client('comment').select()));
  let nices = JSON.parse(
    JSON.stringify(
      await client('nices')
        .select('comment_id')
        .count('user_id as count')
        .groupBy('comment_id')
    )
  );
  nices.forEach(n => {
    const comment = comments.find(c => c.id === n.comment_id);
    comment.nice = n.count;
  });
  return comments;
};

module.exports = { getComments };
