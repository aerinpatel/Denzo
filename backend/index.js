const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const { userSchema, todoSchema } = require("./db");
const bcrypt = require("bcryptjs"); // Use bcryptjs instead of bcrypt
const jwt = require("jsonwebtoken");
const { JWT_SECRET, authorization } = require("./auth");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend")));
app.use(cors());
// Serve static files from the frontend directory

mongoose.connect(
  ""
);
const User = mongoose.model("User", userSchema);
const Todo = mongoose.model("Todo", todoSchema);

app.get("/", (req, res) => {
  console.log("GET /");
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});
app.get("/signup", (req, res) => {
  console.log("GET /signup");
  res.sendFile(path.join(__dirname, "../frontend/signup.html"));
});
app.get("/signin", (req, res) => {
  console.log("GET /login");
  console.log(req.query);
  res.sendFile(path.join(__dirname, "../frontend/signin.html"));
});
app.get("/todos", (req, res) => {
  console.log("GET /todos");
  res.sendFile(path.join(__dirname, "../frontend/main.html"));
});

app.get("/todos/items", authorization, async (req, res) => {
  console.log("GET /todos/items");
  const user = req.user; // from the authorization middleware
  const todos = await Todo.find({ user: user });
  res.send(todos);
});

app.post("/signup", async (req, res) => {
  console.log("POST /signup");
  console.log(req.body);
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const salt = await bcrypt.genSalt(5);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(salt);
  console.log(hashedPassword);

  await User.create({
    name: name,
    email: email,
    password: hashedPassword,
    namak: salt,
  });
  res.send("success"); // added response
});

app.post("/signin", async (req, res) => {
  console.log("POST /signin");
  console.log(req.body);
  const username = req.body.username; // added for response with username
  console.log(username);
  const email = req.body.email;
  const password = req.body.password;
  const response = await User.findOne({ email: email });
  console.log(response);
  if (!response) {
    res.status(400).send("user not found");
    return;
  } else {
    const match = await bcrypt.compare(password, response.password);
    if (!match) {
      res.send("Password incorrect");
      return;
    }
    const token = jwt.sign({ _id: response._id }, JWT_SECRET);
    console.log(token);
    // localStorage.setItem("token", token);
    // localStorage.setItem("user", response._id);
    res.status(200).json({ token: token, username: username }); // added response with token
  }
  //   res.send("success");
});

app.post("/todos", authorization, async (req, res) => {
  console.log("POST /todos");
  console.log(req.body);
  const title = req.body.title;
  const priority = req.body.priority;
  const status = req.body.status;
  const date = req.body.date;

  const user = req.user._id; // from the authorization middleware

  await Todo.create({
    title: title,
    date: date,
    user: user,
    priority: priority,
    status: status,
  });
  res.status(200).send("success");
});

app.put("/todos/:id", authorization, async (req, res) => {
  try {
    console.log("PUT /todos/:id");
    console.log("Todo ID:", req.params.id);
    console.log("Request Body:", req.body);
    console.log("Authorization Header:", req.headers.authorization);
    console.log(typeof req.params.id);
    console.log(typeof req.body.status);

    const todoId = req.params.id;
    const { status } = req.body;
    console.log("now we will update the todo");
    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      { status },
      { new: true }
    );
    console.log("this is the updated todo: " ,updatedTodo);
    if (!updatedTodo) {
      return res.status(404).send("Todo not found");
    }

    res.status(200).send("Todo updated successfully");
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).send("Failed to update todo");
  }
});

app.delete("/todos/:id", authorization, async (req, res) => {
  console.log("DELETE /todos/:id");
  const todo_id = req.params.id;
  console.log(todo_id);

  await Todo.deleteOne({ _id: todo_id });
  res.status(200).send("success");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
