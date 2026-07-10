const Note = require("./models/note");

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

app.get("/api", (request, response) => {
  response.send("<h1>Connected to API</h1>");
});

app.get("/api/notes/info", async (req, res) => {
  const count = (await Note.countDocuments({})) || 0;

  res.send(
    `<p> Notes has ${count} items </p> <p> ${new Date().toString()}</p>`,
  );
});

app.get("/api/notes/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);
  res.json(note);
});

app.delete("/api/notes/:id", async (req, res) => {
  const note = await Note.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.post("/api/notes", async (req, res) => {
  const body = req.body;

  if (!body.content) {
    badRequestField("Content field is missing from request body", res);
    return;
  }
  const exists = await Note.exists({ content: body.content });

  if (exists) {
    badRequestField("Content field is already in use", res);
    return;
  }
  const note = new Note({
    id: generateId(),
    content: body.content,
    important: body.important || false,
  });

  note.save();

  res.status(201).json({ message: "Note added successfully", data: note });
});

app.put("/api/notes/:id", async (req, res) => {
  const note = await Note.findByIdAndUpdate(
    req.params.id,
    {
      content: req.body.content,
      important: req.body.important,
    },
    {
      returnDocument: "after",
    },
  );

  res.json({ message: "Note updated successfully", data: note });
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

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  res.status(error.status || 500).json({
    error: error.message || "Internal server error",
  });
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
