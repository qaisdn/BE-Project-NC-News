const { fetchComments } = require("../models/comments-models");
const { fetchArticlesByID } = require("../models/article-models");

exports.getComments = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticlesByID(article_id)
    .then(() => {
      return fetchComments(article_id);
    })
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch(next);
};
