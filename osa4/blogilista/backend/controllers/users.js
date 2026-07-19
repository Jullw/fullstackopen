const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (!passwordRegex.test(password)) {
    return response.status(400).json({
      error:
        "password must be at least 8 characters long and contain at least one uppercase letter and one number; special characters are not allowed",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", { user: 0 });
  response.json(users);
});

module.exports = usersRouter;
