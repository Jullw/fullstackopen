const mongoose = require("mongoose");
const config = require("./config");
const logger = require("./logger");

const testDatabaseName = `blog_test_${process.pid}`;

const connectionOptions =
  process.env.NODE_ENV === "test"
    ? { dbName: testDatabaseName }
    : { family: 4 };

const connectToDb = () => {
  mongoose
    .connect(config.MONGO_URL, connectionOptions)
    .then(() => {
      logger.info("connected to MongoDB");
    })
    .catch((error) => {
      logger.error("error connection to MongoDB:", error.message);
    });
};

module.exports = {
  connectToDb,
};
