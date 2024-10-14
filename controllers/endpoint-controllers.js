const fs = require("fs/promises");

exports.getAPIinfo = (request, response, next) => {
  fs.readFile("./endpoints.json", "utf-8").then((data) => {
    response.status(200).send(JSON.parse(data));
  });
};
