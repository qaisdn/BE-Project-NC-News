const {
  fetchArticlesByID,
  fetchArticles,
  alterVotes,
  fetchQuery,
} = require("../models/article-models");

exports.getAllArticlesByID = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticlesByID(article_id)
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch(next);
};

exports.getAllArticles = (request, response, next) => {
  const { topic, sort_by, order } = request.query;
  fetchArticles(topic, sort_by, order)
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((error) => {
      next(error);
    });
};

exports.updateVotes = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  fetchArticlesByID(article_id)
    .then(() => {
      return alterVotes(article_id, inc_votes);
    })
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
};
