// document.addEventListener("DOMContentLoaded", function() {
//   const menuToggle = document.getElementById("menu-toggle");
//   const sidebar = document.getElementById("sidebar");

// const { title } = require("process");
// const { JWT_SECRET } = require("../backend/auth");
// import axios from "axios"; // Ensure axios is imported correctly


function loadtodos(){
  const token = localStorage.getItem("token");
  if (!token) {
    alert("User is not signed in. Redirecting to signin page.");
    window.location.href = "http://localhost:3000/signin";
    return;
  }
  axios.get("http://localhost:3000/todos/items",{
    headers: {
      Authorization: token
    }
  }).then((response) => {
    console.log(response);
    const todos = response.data;
    const todo_items = document.getElementById("todo-items-in-todo");
    const progress_items = document.getElementById("todo-items-in-progress");
    const completed_items = document.getElementById("todo-items-completed");
    todo_items.innerHTML = "";
    todos.forEach((todo) => {
      console.log(todo);
      // const todo_id = JSON.stringify(todo._id);
      const new_todo = document.createElement("div");
      const formattedDate = todo.date ? todo.date.split("T")[0] : "No Date";
      new_todo.innerHTML = `<div class="item-todo list">
                  <div class="todo-task">
                    <div class="todo-task-top">
                      <div class="todo-task-status">${todo.status}</div>
                      <button onclick="deleteTask('${todo._id}')"><i class="fa-solid fa-ellipsis-h"></i>=</button>
                    </div>
                    <div class="todo-task-title">${todo.title}</div>
                    <div class="todo-section-middle">
                      <div class="todo-task-date"><i class="fa-regular fa-calendar"></i> ${formattedDate}</div>
                      <div class="todo-task-priority">${todo.priority}</div>
                    </div>
                    <div class="complete-button">
                      <button onclick="completeTask('${todo._id}')">complete task</button>
                    </div>
                  </div>
                </div>`;
                console.log(todo._id);
                
      if(todo.status === "todo") {
        todo_items.appendChild(new_todo);
      } else if(todo.status === "in-progress") {
        progress_items.appendChild(new_todo);
      } else if(todo.status === "completed") {
        new_todo.querySelector(".complete-button").style.display = "none";
        completed_items.appendChild(new_todo);
      }

      if(todo.priority === "high") {
        new_todo.querySelector(".todo-task-priority").innerHTML = "High Priority";
        new_todo.querySelector(".todo-task-priority").style.color = "red";
      }
      else if(todo.priority === "medium") {
        new_todo.querySelector(".todo-task-priority").innerHTML = "Medium Priority";
        new_todo.querySelector(".todo-task-priority").style.color = "orange";
      } else if(todo.priority === "low") {
        new_todo.querySelector(".todo-task-priority").innerHTML = "Low Priority";
        new_todo.querySelector(".todo-task-priority").style.color = "blue";
      }
    }); // Close forEach and then callback
  }).catch((error) => {
    console.error(error);
    
  });
}

function completeTask(todo_id) {
  console.log("Todo ID:", todo_id); // Debugging log
  const token = localStorage.getItem("token");
  if (!token) {
    alert("User is not signed in. Redirecting to signin page.");
    window.location.href = "http://localhost:3000/signin";
    return;
  }

  axios
    .put(
      `http://localhost:3000/todos/${todo_id}`,
      { status: "completed" },
      {
        headers: {
          Authorization: `${token}`, // Add "Bearer" prefix
        },
      }
    )
    .then((response) => {
      console.log("function has send the data");
      console.log("Response:", response);
      if (response.status === 200) {
        loadtodos(); // Reload the todos after marking one as complete
      }
    })
    .catch((error) => {
      console.error("Error:", error.response ? error.response.data : error.message);
      alert("Failed to mark todo as completed");
    });
}

function deleteTask(todo_id){
  const token = localStorage.getItem("token");
  if(!token){
    alert("user not signin correctly");
    window.location.href = "http://localhost:3000/signin";
    return;
  }
  axios.delete(`http://localhost:3000/todos/${todo_id}`,{
    headers:{
      Authorization: token
    }
  }).then((response) => {
    console.log("Todo deleted successfully:", response.data);
    loadtodos(); // Reload the todos after deletion
  }).catch((error) => {
    console.error("Error deleting todo:", error.response ? error.response.data : error.message);
  });
}

window.onload = function () {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  console.log(token);
  console.log(user);
  if (!user || !token) {
    alert("user not signin correctly");
    window.location.href = "http://localhost:3000/signin";
    return;
  }
  console.log(localStorage.getItem("user"));
  console.log(document.getElementsByClassName("user-name"));
  const name = document.getElementsByClassName("user-name");
  console.log(name);
  name[0].innerText = user;
  name[1].innerText = user;
  loadtodos();
};

//   menuToggle.addEventListener("click", function() {
//     sidebar.classList.toggle("open");
//   });

//   // Optional: Close the sidebar when clicking outside of it
//   document.addEventListener("click", function(event) {
//     if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
//       sidebar.classList.remove("open");
//     }
//   });
// });

function toggleSidebar() {
  const sidebar = document.getElementById("profile-display");
  sidebar.classList.toggle("closed");
}

function Todomenu() {
  const todo_form = document.getElementById("todo-input");
  todo_form.classList.toggle("close");
}
// function Todomenu() {
//   const sidebar = document.getElementById("menu-toggle");
//   sidebar.classList.toggle("closed");
// }
window.Todomenu = Todomenu;

function submitTodo() {
  const todo_title = document.getElementById("todo-title");
  const date = document.getElementById("todo-date-input");
  const priority = document.getElementById("todo-priority-input");
  const status = document.getElementById("todo-status-input");

  const todo = {
    title: todo_title.value,
    date: date.value,
    priority: priority.value,
    status: status.value,
  };

  const token = localStorage.getItem("token");
  axios
    .post("http://localhost:3000/todos", todo, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      console.log(response);
      if (response.data === "success" || response.status === 200) {
        alert("Todo item created successfully!");
        window.location.href = "http://localhost:3000/todos";
        document.getElementById("user-name").innerText = user;
        Todomenu();
      }
    })
    .catch((error) => {
      console.error(error);
      alert("Failed to create todo item. Please try again.");
    });
}

// create an array for each todo list element form backend and it should work as follow
// todo -> backend -> frontend(todolist)

// create an connection from the backend to fronted for user logging
