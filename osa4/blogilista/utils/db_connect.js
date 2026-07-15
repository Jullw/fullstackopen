const mongoose = require("mongoose");
const config = require("./config");
const logger = require("./logger");

const connectToDb = () => {
  mongoose
    .connect(config.MONGO_URL, { family: 4 })
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
