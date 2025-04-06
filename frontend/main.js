let currentEditTodoId = null;

function loadtodos() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("User is not signed in. Redirecting to signin page.");
    window.location.href = "http://localhost:3000/signin";
    return;
  }
  axios
    .get("http://localhost:3000/todos/items", {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log(response);
      const todos = response.data;
      const todo_items = document.getElementById("todo-items-in-todo");
      const progress_items = document.getElementById("todo-items-in-progress");
      const completed_items = document.getElementById("todo-items-completed");
      // Clear all containers before appending new items
      todo_items.innerHTML = "";
      progress_items.innerHTML = "";
      completed_items.innerHTML = "";
      todos.forEach((todo) => {
        console.log(todo);
        const new_todo = document.createElement("div");
        const formattedDate = todo.date ? todo.date.split("T")[0] : "No Date";
        new_todo.innerHTML = `<div class="item-todo list">
                  <div class="todo-task">
                    <div class="todo-task-top">
                      <div class="todo-task-status">${todo.status}</div>
                      <div class="buttons-todo-task-top">
                        <button class="popup-btn-parent">
                          <i class="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                        <div class="popup">
                          <button class="popup-btn-top" onclick="openEditTodoForm('${todo._id}')"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                          <button class="popup-btn-bottom" onclick="deleteTask('${todo._id}')"><i class="fa-solid fa-trash"></i> Delete</button>
                        </div>
                      </div>
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
        if (todo.status === "todo") {
          todo_items.appendChild(new_todo);
        } else if (todo.status === "in-progress") {
          progress_items.appendChild(new_todo);
        } else if (todo.status === "completed") {
          new_todo.querySelector(".complete-button").style.display = "none";
          completed_items.appendChild(new_todo);
        }
        if (todo.priority === "high") {
          new_todo.querySelector(".todo-task-priority").innerHTML =
            "High Priority";
          new_todo.querySelector(".todo-task-priority").style.color = "red";
        } else if (todo.priority === "medium") {
          new_todo.querySelector(".todo-task-priority").innerHTML =
            "Medium Priority";
          new_todo.querySelector(".todo-task-priority").style.color = "orange";
        } else if (todo.priority === "low") {
          new_todo.querySelector(".todo-task-priority").innerHTML =
            "Low Priority";
          new_todo.querySelector(".todo-task-priority").style.color = "blue";
        }
      }); // Close forEach and then callback
    })
    .catch((error) => {
      console.error(error);
      console.log("Error fetching todos:", error.response.data);
    });
}
document.addEventListener("DOMContentLoaded", () => {
  const popupButtons = document.querySelectorAll(".popup-btn-parent");

  // Add event listeners to each popup button
  popupButtons.forEach((button) => {
    const popup = button.querySelector(".popup");

    // Close the popup when clicking outside
    document.addEventListener("click", (event) => {
      if (!button.contains(event.target)) {
        popup.style.display = "none";
      }
    });

    // Open the popup when clicking the button
    button.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent the click from propagating to the document
      popup.style.display = popup.style.display === "block" ? "none" : "block";
    });
  });
});
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
      `http://localhost:3000/todos/complete`,
      { status: "completed", todo_id: todo_id },
      {
        headers: {
          Authorization: token, // Add "Bearer" prefix
        },
      }
    )
    .then((response) => {
      console.log("function has sent the data");
      console.log("Response:", response);
      if (response.status === 200) {
        loadtodos(); // Reload the todos after marking one as complete
      }
    })
    .catch((error) => {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to mark todo as completed");
    });
}

function deleteTask(todo_id) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("user not signin correctly");
    window.location.href = "http://localhost:3000/signin";
    return;
  }
  axios
    .delete(`http://localhost:3000/todos/${todo_id}`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      console.log("function has sent the data");
      console.log("Response:", response);
      if (response.status === 200) {
        loadtodos(); // Reload the todos after marking one as complete
      }
    })
    .catch((error) => {
      console.error(
        "Error deleting todo:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to delete todo");
    });
}

// Rename the function that loads todo details for editing:
function openEditTodoForm(todo_id) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("User is not signed in. Redirecting to signin page.");
    window.location.href = "http://localhost:3000/signin";
    return;
  }
  if (todo_id) {
    currentEditTodoId = todo_id;
    axios
      .post(`http://localhost:3000/todos/${todo_id}`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        const todo = response.data;
        document.getElementById("todo-title-two").value = todo.title;
        // Assuming date in ISO format
        document.getElementById("todo-date-input-two").value = todo.date.split("T")[0];
        document.getElementById("todo-priority-input-two").value = todo.priority;
        document.getElementById("todo-status-input-two").value = todo.status;
        document.getElementById("todo-input-two").classList.remove("close");
      })
      .catch((error) => {
        console.error("Error fetching todo details:", error);
        alert("Failed to fetch todo details.");
      });
  }
}

// Rename the function that simply toggles the edit form:
function toggleEditTodoForm() {
  const todo_form = document.getElementById("todo-input-two");
  todo_form.classList.toggle("close");
}

window.openEditTodoForm = openEditTodoForm;
window.toggleEditTodoForm = toggleEditTodoForm;

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/signin";  // Redirect user to the signin page
}

// Function to submit the edited todo
function SubmitEditedTodo() {
  if (!currentEditTodoId) return;
  const title = document.getElementById("todo-title-two").value;
  const date = document.getElementById("todo-date-input-two").value;
  const priority = document.getElementById("todo-priority-input-two").value;
  const status = document.getElementById("todo-status-input-two").value;

  if (title.trim() === "" || date === "" || priority === "default" || status === "default") {
    alert("Please fill in all fields before submitting.");
    return;
  }

  const updatedTodo = { 
    title:title, date:date, priority:priority, status:status };
  const token = localStorage.getItem("token");
  axios
    .put(`http://localhost:3000/todos/${currentEditTodoId}`, updatedTodo, {
      headers: { Authorization: token },
    })
    .then((response) => {
      if (response.status === 200) {
        alert("Todo updated successfully!");
        loadtodos();
        document.getElementById("todo-input-two").classList.add("close");
        currentEditTodoId = null;
      }
    })
    .catch((error) => {
      console.error("Error updating todo:", error);
      alert("Failed to update todo.");
    });
}

function toggleSidebar() {
  const sidebar = document.getElementById("profile-display");
  sidebar.classList.toggle("closed");
  
}

function Todomenu() {
  const todo_form = document.getElementById("todo-input");
  todo_form.classList.toggle("close");
}

window.Todomenu = Todomenu; // Make the function globally accessible

function submitTodo() {
  const todo_title = document.getElementById("todo-title");
  const date = document.getElementById("todo-date-input");
  const priority = document.getElementById("todo-priority-input");
  const status = document.getElementById("todo-status-input");


  // Validate that a task title has been entered
  if (todo_title.value.trim() === "") {
    alert("Please enter a task title before submitting.");
    todo_title.focus();
    return; // Do not close the form if no data is entered
  }
  if(date.value == ""){
    alert("Please enter a task date before submitting.");
    date.focus();
    return;
  }
  if(priority.value == "default"){
    alert("Please select a task priority before submitting.");
    priority.focus();
    return;
  }
  if(status.value == "default"){
    alert("Please select a task status before submitting.");
    status.focus();
    return;
  }

  const todo = {
    title: todo_title.value,
    date: date.value,
    priority: priority.value,
    status: status.value,
  };
  console.log("before submitting ",todo);
  const token = localStorage.getItem("token");
  axios
    .post("http://localhost:3000/todos", todo, {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log(response);
      if (response.data === "success" || response.status === 200) {
        
        // window.location.href = "http://localhost:3000/todos";
        // document.getElementById("user-name").innerText = user;
        loadtodos(); // Reload the todos after adding a new one
        Todomenu(); // Close the form only after data is sent
        document.getElementById("todo-title").value = ""; // Clear the input field
        document.getElementById("todo-date-input").value = ""; // Clear the input field
        document.getElementById("todo-priority-input").value = ""; // Clear the input field
        document.getElementById("todo-status-input").value = ""; // Clear the input field
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

// create an array for each todo list element form backend and it should work as follow
// todo -> backend -> frontend(todolist)

// create an connection from the backend to fronted for user logging
