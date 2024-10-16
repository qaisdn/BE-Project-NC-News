const db = require("../db/connection");

exports.fetchArticlesByID = (article_id) => {
  const query = `SELECT * FROM articles WHERE articles.article_id =$1`;
  return db.query(query, [article_id]).then(({ rows, rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({ status: 404, msg: "article not found" });
    }
    return rows[0];
  });
};

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.* , COUNT(comments.article_id) AS comment_count FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC
        `
    )
    .then(({ rows: articles }) => {
      return articles;
    });
};

exports.alterVotes = (article_id, inc_votes) => {
  const queryForUpdate = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *; `;
  return db.query(queryForUpdate, [inc_votes, article_id]).then(({ rows }) => {
    return rows;
  });
};
