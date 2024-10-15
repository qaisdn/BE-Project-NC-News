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
