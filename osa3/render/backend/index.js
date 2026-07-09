const express = require("express");
const morgan = require("morgan");

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
app.use(express.static("dist"));

const { randomUUID } = require("node:crypto");

let notes = [
  {
    id: "aa1f8e10-4c17-49d8-9e6d-39f96fb4ee63",
    content: "Node is running smoothly",
    important: true,
  },
  {
    id: "f871bde5-b4df-4049-8ff7-1d2c5b5a7803",
    content: "Javascript is a great language",
    important: true,
  },
  {
    id: "f871bde5-b4df-4049-8ff7-1d2c5b5a7809",
    content: "Javascript is multithreaded ",
    important: false,
  },
];

app.get("/api", (request, response) => {
  response.send("<h1>Connected to API</h1>");
});

app.get("/api/notes/info", (req, res) => {
  const returnContent = `<p> Notes has ${notes.length} items </p> <p> ${new Date().toString()}</p>`;
  res.send(returnContent);
});

app.get("/api/notes/:id", (req, res) => {
  const item = notes.find((item) => item.id === Number(req.params.id));
  if (item) {
    res.json(item);
  }
  res.status(404).end();
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  notes = notes.filter((note) => note.id !== id);
  res.status(204).end();
});

app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (!body.content) {
    badRequestField("Content field is missing from request body", res);
    return;
  }

  if (notes.some((item) => item.content === body.content)) {
    badRequestField("Content field is already in use", res);
    return;
  }

  const note = {
    id: generateId(),
    content: body.content,
    important: body.important || false,
  };

  notes = notes.concat(note);
  res.status(201).json({ message: "Note added successfully", data: note });
});

app.put("/api/notes/:id", (req, res) => {
  const index = notes.findIndex((item) => item.id === req.params.id);
  notes[index] = { ...notes[index], ...req.body };

  res.json({ message: "Note updated successfully", data: notes[index] });
});

app.put("/api/notes/toggle/:id", (req, res) => {
  const item = notes.find((item) => item.id === req.params.id);

  const updatedNote = {
    ...item,
    important: !item.important,
  };

  notes = notes.map((note) => (note.id === item.id ? updatedNote : note));

  res.json({
    message: "Note importance toggled successfully",
    data: updatedNote,
  });
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

const generateId = () => {
  return randomUUID();
};

const badRequestField = (message, res, status = 400) => {
  return res.status(status).json({
    error: message,
  });
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
