const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

morgan.token("body", (req) => {
  return JSON.stringify(req.body) || "-";
});

morgan.format(
  "tiny-w-body",
  ":method :url :status :res[content-length] - :response-time ms :body",
);

app.use(morgan("tiny-w-body"));
app.use(express.json());
app.use(cors());

const { randomUUID } = require("node:crypto");

let list = [
  {
    id: "aa1f8e10-4c17-49d8-9e6d-39f96fb4ee63",
    description: "Node is running smoothly",
    is: true,
  },
  {
    id: "f871bde5-b4df-4049-8ff7-1d2c5b5a7803",
    description: "Javascript is a great language",
    is: true,
  },
  {
    id: "f871bde5-b4df-4049-8ff7-1d2c5b5a7809",
    description: "Javascript is multithreaded ",
    is: false,
  },
];

app.get("/", (request, response) => {
  response.send("<h1>List root page</h1>");
});

app.get("/list/info", (req, res) => {
  const returnContent = `<p> List has ${list.length} items </p> <p> ${new Date().toString()}</p>`;
  res.send(returnContent);
});

app.get("/list/:id", (req, res) => {
  const item = list.find((item) => item.id === Number(req.params.id));
  if (item) {
    res.json(item);
  }
  res.status(404).end();
});

app.delete("/list/:id", (req, res) => {
  const id = Number(req.params.id);
  list = list.filter((note) => note.id !== id);
  res.status(204).end();
});

app.post("/list", (req, res) => {
  const body = req.body;

  if (!body.description) {
    badRequestField("Description field is missing from request body", res);
    return;
  }

  if (list.some((item) => item.description === body.description)) {
    badRequestField("Description field is already in use", res);
    return;
  }

  const Item = {
    id: generateId(),
    description: body.description,
    is: body.is || false,
  };

  list = list.concat(Item);
  res.status(201).json(Item);
});

const generateId = () => {
  return randomUUID();
};

const badRequestField = (message, res, status = 400) => {
  return res.status(status).json({
    error: message,
  });
};

app.get("/list", (request, response) => {
  response.json(list);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
