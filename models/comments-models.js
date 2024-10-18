const db = require("../db/connection");

exports.fetchComments = (article_id) => {
  const query = `SELECT * FROM comments WHERE article_id =$1 ORDER by created_at DESC`;
  return db.query(query, [article_id]).then(({ rows }) => {
    return rows;
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

exports.deleteComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchCommentsByID = (comment_id) => {
  const deleteQuery = `SELECT * FROM comments WHERE comment_id = $1`;
  return db.query(deleteQuery, [comment_id]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `Comment ${comment_id} was not found`,
      });
    }
    return result.rows;
  });
};
