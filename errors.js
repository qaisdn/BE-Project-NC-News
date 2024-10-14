const notfoundErrors = (request, response, next) => {
  response.status(404).send({ msg: "URL not found" });
};

module.exports = { notfoundErrors };
