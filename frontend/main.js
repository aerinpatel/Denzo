// document.addEventListener("DOMContentLoaded", function() {
//   const menuToggle = document.getElementById("menu-toggle");
//   const sidebar = document.getElementById("sidebar");

// const { title } = require("process");
// const { JWT_SECRET } = require("../backend/auth");



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
      const new_todo = document.createElement("div");
      console.log(todo);
      new_todo.innerHTML = `<div class="item-todo list">
                  <div class="todo-task">
                    <div class="todo-task-top">
                      <div class="todo-task-status">${todo.status}</div>
                      <button><i class="fa-solid fa-ellipsis-h"></i></button>
                    </div>
                    <div class="todo-task-title">${todo.title}</div>
                    <div class="todo-section-middle">
                      <div class="todo-task-date"></div>
                      <div class="todo-task-priority">${todo.priority}</div>
                    </div>
                    <div class="complete-button">
                      <button onclick="completeTask()">complete task</button>
                    </div>
                  </div>
                </div>`;
      if(todo.status === "todo") {
        todo_items.appendChild(new_todo);
      }else if(todo.status === "in-progress") {
        progress_items.appendChild(new_todo);
      } else if(todo.status === "completed") {
        completed_items.appendChild(new_todo);
      }
    }).catch((error) => {
      console.error(error);
      alert("Failed to load todos");
    });
  })
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

  // let new_todo = document.createElement("div");
  // new_todo.innerHTML = `<div class="item-todos">
  //               <div class="item-todo">
  //                 <div class="todo-task">
  //                   <div class="todo-task-top">
  //                     <div class="todo-task-status">${status}</div>
  //                     <button><i class="fa-solid fa-ellipsis-h"></i></button>
  //                   </div>
  //                   <div class="todo-task-title">${todo_title}</div>
  //                   <div class="todo-section-middle">
  //                     <div class="todo-task-date">${date}</div>
  //                     <div class="todo-task-priority">high priority</div>
  //                   </div>
  //                 </div>
  //               </div>`;

  // document.getElementById("todo-items").appendChild(new_todo);
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
        alert("Todo created successfully");
        
        window.location.href = "http://localhost:3000/todos";
        document.getElementById("user-name").innerText = user;
        Todomenu();
      }
    })
    .catch((error) => {
      console.error(error);
      alert("Failed to create todo");
    });
}

// create an array for each todo list element form backend and it should work as follow
// todo -> backend -> frontend(todolist)

// create an connection from the backend to fronted for user logging
