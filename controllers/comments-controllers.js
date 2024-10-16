const {
  fetchComments,
  postComments,
  deleteComment,
} = require("../models/comments-models");
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

exports.addComment = (request, response, next) => {
  const { article_id } = request.params;
  const { body, username } = request.body;
  fetchArticlesByID(article_id)
    .then(() => {
      return postComments(username, body, article_id);
    })
    .then((newComment) => {
      response.status(201).send({ newComment });
    })
    .catch(next);
};

exports.removeComment = (request, response, next) => {
  const { comment_id } = request.params;
  deleteComment(comment_id)
    .then((comment) => {
      response.status(204).send({ comment });
    })
    .catch(next);
};
