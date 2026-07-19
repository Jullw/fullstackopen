const logger = require("./logger");
const jwt = require("jsonwebtoken");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const userAthorization = async (request, response, next) => {
  const authorization = request.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return response.status(401).json({ error: "token missing" });
  }

  const token = authorization.replace("Bearer ", "");
  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  request.user = decodedToken;
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response
      .status(400)
      .json({ error: "expected `username` to be unique" });
  }

  if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    });
  }

  next(error);
  // HOX Aktivoi jossain vaiheessa, parempi näyttää mahd geneerinen virheilmoitus
  // return response.status(500).json({
  //   error: "internal server error",
  // });
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  userAthorization,
};
