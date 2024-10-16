const { fetchUsers } = require("../models/users-models");

exports.getAllUsers = (request, response, next) => {
  fetchUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch((error) => {
      next(error);
    });
};
