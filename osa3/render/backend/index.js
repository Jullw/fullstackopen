const Note = require("./models/note");

const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.static("dist"));

morgan.token("body", (req) => {
  return JSON.stringify(req.body) || "-";
});

morgan.format(
  "tiny-w-body",
  ":method :url :status :res[content-length] - :response-time ms :body"
);

app.use(morgan("tiny-w-body"));
app.use(express.json());

const { randomUUID } = require("node:crypto");

app.get("/api", (request, response) => {
  response.send("<h1>Connected to API</h1>");
});

app.get("/api/notes/info", async (req, res) => {
  const count = (await Note.countDocuments({})) || 0;

  res.send(
    `<p> Notes has ${count} items </p> <p> ${new Date().toString()}</p>`
  );
});

app.get("/api/notes/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);
  res.json(note);
});

app.delete("/api/notes/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.post("/api/notes", async (req, res) => {
  const body = req.body;

  if (!body.content) {
    badRequestField("Content field is missing from request body", res);
    return;
  }
  // const exists = await Note.exists({ content: body.content });

  // if (exists) {
  //   badRequestField("Content field is already in use", res);
  //   return;
  // }

  const note = new Note({
    id: generateId(),
    content: body.content,
    important: body.important || false,
  });

  const savedNote = await note.save();

  res.status(201).json({ message: "Note added successfully", data: savedNote });
});

app.put("/api/notes/:id", async (req, res) => {
  const { content, important } = req.body;
  if (!content || typeof important !== "boolean") {
    badRequestField("Fields are missing from request body", res);
    return;
  }

  const note = await Note.findById(req.params.id);
  if (!note) badRequestField("Note not found", res, 404);

  note.content = content;
  note.important = important;
  const updatedNote = await note.save();
  successRequestField("Note updated successfully", res, updatedNote);
});

app.get("/api/notes", async (request, response) => {
  const notes = await Note.find({});
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

const successRequestField = (message, res, data = null, status = 200) => {
  return res.status(status).json({ message: message, data: data });
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }
  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
