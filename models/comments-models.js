const db = require("../db/connection");

exports.fetchComments = (article_id) => {
  const query = `SELECT * FROM comments WHERE article_id =$1 ORDER by created_at DESC`;
  return db.query(query, [article_id]).then(({ rows, rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    }
    return rows[0];
  });
};

exports.postComments = (username, body, article_id) => {
  const queryforComment = `INSERT INTO comments
        (body, author, article_id)
        VALUES
        ($1, $2, $3)
        RETURNING *;`;
  return db
    .query(queryforComment, [body, username, article_id])
    .then(({ rows }) => {
      return rows[0];
    });
};
