const { test, after, describe, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const User = require("../models/user");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash("salaisuus", 10);

  const user = new User({
    name: "Matti Meikalainen",
    username: "MatMei",
    passwordHash: passwordHash,
  });

  await user.save();
});

describe("user tests", () => {
  test("user creation with valid data is success", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: "Maija Meikalainen",
      username: "MaiMei",
      password: "salasanA123",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: "Duplikaatti Matti",
      username: "MatMei",
      password: "salasanA123",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("expected `username` to be unique"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("deny user creation if password is under 8 character", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: "too short",
      username: "MatMei",
      password: "Short1",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      result.body.error.includes(
        "password must be at least 8 characters long and contain at least one uppercase letter and one number; special characters are not allowed",
      ),
    );

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("deny user creation if password doesn't have number", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: "no number",
      username: "MatMei",
      password: "Nonumbers",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      result.body.error.includes(
        "password must be at least 8 characters long and contain at least one uppercase letter and one number; special characters are not allowed",
      ),
    );

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("deny user creation if password doesn't have capital character", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: "no capital",
      username: "MatMei",
      password: "nocapital123",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      result.body.error.includes(
        "password must be at least 8 characters long and contain at least one uppercase letter and one number; special characters are not allowed",
      ),
    );

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
