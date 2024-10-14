const express = require("express");
const app = express();

const { notfoundErrors } = require("../errors");
const { getAllTopics } = require("../controllers/topics-controllers");

app.use(express.json());

app.get("/api/topics", getAllTopics);
app.use(notfoundErrors);

module.exports = app;
