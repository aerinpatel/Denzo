const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const { userSchema, todoSchema } = require("./db");
const bcrypt = require("bcryptjs"); // Use bcryptjs instead of bcrypt
const jwt = require("jsonwebtoken");
const { JWT_SECRET, authorization } = require("./auth");
const dotenv = require("dotenv").config(); // Load environment variables from .env file
const { z } = require("zod");
const { title } = require("process");

const app = express();
const databaseURL = process.env.DATABASE_URL; // Use the environment variable for the database URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend")));
app.use(cors(
  {
    origin: "https://denzo.netlify.app/", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow these HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  }
));
// Serve static files from the frontend directory

const userSchemaValidation = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const todoSchemaValidation = z.object({
  title: z.string(),
  date: z.date()
})

mongoose.connect(databaseURL);
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
// app.get("/todos/:id", async (req, res) => {
//   try {
//     console.log("GET /todos/:id");
//     const todo_id = req.params.id;
//     console.log("Todo ID:", todo_id);

//     const todo = await Todo.find({_id: todo_id}); // Await the query to get the actual document
//     if (!todo) {
//       return res.status(404).send("Todo not found");
//     }

//     console.log("Todo:", todo);
//     res.json(todo); // Send the actual todo document as JSON
//   } catch (error) {
//     console.error("Error fetching todo:", error);
//     res.status(500).send("Failed to fetch todo");
//   }
// });
app.get("/todos/items", authorization, async (req, res) => {
  console.log("GET /todos/items");
  const user = req.user; // from the authorization middleware
  const todos = await Todo.find({ user: user });
  res.send(todos);
});

app.post("/signup", async (req, res) => {
  console.log("POST /signup");
  console.log(req.body);

  const result = userSchemaValidation.safeParse(req.body);
  if(result.success == false){
    console.log("invalid input data");
    // return;
    res.send("fail");
  }

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

 

app.put("/todos/complete", authorization, async (req, res) => {
  try {
    console.log("PUT /todos/complete");
    console.log("Request Body:", req.body);

    const todoId = req.body.todo_id;
    const status = req.body.status;

    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      { status: status },
      { new: true } // Return the updated document
    );

    if (!updatedTodo) {
      return res.status(404).send("Todo not found");
    }

    console.log("Updated Todo:", updatedTodo);
    res.status(200).send("Todo updated successfully");
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).send("Failed to update todo");
  }
});

app.put("/todos/:id", authorization, async (req, res) => {
  try {
    console.log("PUT /todos/:id");
    console.log("Request Body:", req.body);

    const todoId = req.params.id;
    console.log("Todo ID:", todoId);
    const { title, date, priority, status } = req.body;
    console.log(title, date, priority, status);
    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      { title, date, priority, status },
      { new: true } // Return the updated document
    );


    if (!updatedTodo) {
      return res.status(404).send("Todo not found");
    }

    console.log("Updated Todo:", updatedTodo);
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

// app.delete("/todos/logout", authorization, async (req, res) => {
//   console.log("DELETE /todos/logout");
//   const user = req.user._id; // from the authorization middleware

//   res.status(200).send("success");
// });

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
