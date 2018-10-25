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

// const isAlreadyNiced = async (client, userId, commentId) => {
//   const nice = await client('nices')
//     .select()
//     .where({
//       user_id: userId,
//       comment_id: commentId
//     });
//   return nice.length !== 0;
// };
//
// export const insertNice = async (client, userId, commentId) => {
//   if (!isAlreadyAdded(client, userId, commentId)) {
//     await client('nices').insert({ user_id: userId, comment_id: commentId });
//   }
// };
//
// if (process.env.ENVIRONMENT === 'dev') {
//   (async () => {
//     await getComments(devClient);
//     await isAlreadyNiced(devClient, 'aTAJIrAKHqBax97Ntzss9ANZzZxcgoeW', 1);
//     process.exit(0);
//   })();
// }

module.exports = { getComments };
