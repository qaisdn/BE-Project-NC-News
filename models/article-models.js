const db = require("../db/connection");

exports.fetchArticlesByID = (article_id) => {
  const query = `SELECT articles.* , COUNT(comments.article_id) AS comment_count FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1
    GROUP BY articles.article_id ORDER BY articles.created_at DESC`;
  return db.query(query, [article_id]).then(({ rows, rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({ status: 404, msg: "article not found" });
    }
    return rows[0];
  });
};

exports.fetchArticles = (topic, sort_by = "created_at", order = "desc") => {
  const queryValues = [];
  const orderQueries = ["asc", "desc"];
  const acceptedSortingQuery = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "votes",
    "created_at",
    "comment_count",
  ];
  if (
    !acceptedSortingQuery.includes(sort_by) ||
    !orderQueries.includes(order)
  ) {
    return Promise.reject({
      status: 400,
      msg: "Query request is invalid.",
    });
  }
  let queryString = `SELECT articles.* , COUNT(comments.article_id) AS comment_count FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    `;
  if (topic !== undefined) {
    queryValues.push(topic);
    queryString += `WHERE topic LIKE $1 GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;
  } else {
    queryString += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;
  }
  return db.query(queryString, queryValues).then(({ rows: articles }) => {
    return articles;
  });
};

exports.alterVotes = (article_id, inc_votes) => {
  const queryForUpdate = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *; `;
  return db.query(queryForUpdate, [inc_votes, article_id]).then(({ rows }) => {
    return rows;
  });
};
