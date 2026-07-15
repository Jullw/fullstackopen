const express = require("express");
const middleware = require("./utils/middleware");
const blogsRouter = require("./controllers/blogs");
const { connectToDb } = require("./utils/db_connect");

const app = express();
connectToDb();

app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/blogs", blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
