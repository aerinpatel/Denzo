let currentEditTodoId = null;

function loadtodos() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("User is not signed in. Redirecting to signin page.");
    window.location.href = "https://localhost:3000/signin";
    return;
  }
  axios
    .get("https://localhost:3000/todos/items", {
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
        // Set a unique id and mark as draggable
        new_todo.setAttribute("id", `todo-${todo._id}`);
        new_todo.setAttribute("draggable", true);
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
                          <button class="popup-btn-top" style="border-bottom-right-radius: 0; border-top-left-radius: 10px; border-top-right-radius: 10px; border-bottom-left-radius: 0;" onclick="toggleEditTodoForm('${todo._id}')"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                          <button class="popup-btn-bottom" style="border-top-right-radius: 0; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; border-top-left-radius: 0;" onclick="deleteTask('${todo._id}')"><i class="fa-solid fa-trash"></i> Delete</button>
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
          new_todo.querySelector(".todo-task-priority").innerHTML = "High Priority";
          new_todo.querySelector(".todo-task-priority").style.color = "red";
        } else if (todo.priority === "medium") {
          new_todo.querySelector(".todo-task-priority").innerHTML = "Medium Priority";
          new_todo.querySelector(".todo-task-priority").style.color = "orange";
        } else if (todo.priority === "low") {
          new_todo.querySelector(".todo-task-priority").innerHTML = "Low Priority";
          new_todo.querySelector(".todo-task-priority").style.color = "blue";
        }
      });
      // After creating todos, attach drag event listeners to each item
      attachDragAndDrop();
    })
    .catch((error) => {
      console.error(error);
      // console.log("Error fetching todos:", error.response.data);
    });
}
window.onload = function () {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  console.log(token);
  console.log(user);
  if (!user || !token) {
    alert("user not signin correctly");
    window.location.href = "https://localhost:3000/signin";
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
// document.addEventListener("click", () => {
//   popupButtons.forEach((button) => {
//     const popup = button.querySelector(".popup");
//     popup.style.display = "none";
//   });
// });
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
document.addEventListener("DOMContentLoaded", () => {
  const popupButtons = document.querySelectorAll(".popup-btn-parent");

  popupButtons.forEach((button) => {
    const popup = button.querySelector(".popup");

    // Show popup on hover
    button.addEventListener("mouseenter", () => {
      popup.style.display = "block";
    });

    // Hide popup when hover off
    button.addEventListener("mouseleave", () => {
      popup.style.display = "none";
    });

    // Toggle popup visibility on click
    button.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent click from propagating to the document
      popup.style.display = popup.style.display === "block" ? "none" : "block";
    });
  });

  // Close all popups when clicking outside
  document.addEventListener("click", () => {
    popupButtons.forEach((button) => {
      const popup = button.querySelector(".popup");
      popup.style.display = "none";
    });
  });
});

function attachDragAndDrop() {
  // Attach dragstart listener to all draggable todo items
  document.querySelectorAll("[draggable='true']").forEach((item) => {
    item.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", e.target.id);
    });
  });

  // Get the three container elements
  const containers = document.querySelectorAll(
    "#todo-items-in-todo, #todo-items-in-progress, #todo-items-completed"
  );

  containers.forEach((container) => {
    container.addEventListener("dragover", (e) => {
      e.preventDefault(); // Allow dropping
      e.dataTransfer.dropEffect = "move";
    });

    container.addEventListener("drop", async (e) => {
      e.preventDefault();
      const draggableId = e.dataTransfer.getData("text/plain");
      const draggableElement = document.getElementById(draggableId);
      if (draggableElement) {
        container.appendChild(draggableElement);

        // Determine the new status based on the container's ID
        let newStatus = "todo";
        if (container.id === "todo-items-in-progress") {
          newStatus = "in-progress";
        } else if (container.id === "todo-items-completed") {
          newStatus = "completed";
        }

        // Extract the todo ID from the draggable element's ID
        const todoId = draggableId.replace("todo-", "");

        // Update the todo status on the backend
        const token = localStorage.getItem("token");
        if (token) {
          try {
            await axios.put(
              `https://localhost:3000/todos/${todoId}`,
              { status: newStatus },
              {
                headers: { Authorization: token },
              }
            );
            loadtodos(); // Reload the todos after updating the status
            console.log(`Todo ${todoId} status updated to ${newStatus}`);
          } catch (error) {
            console.error(`Failed to update todo ${todoId} status:`, error);
          }
        }
      }
    });
  });
}

function completeTask(todo_id) {
  console.log("Todo ID:", todo_id); // Debugging log
  const token = localStorage.getItem("token");
  if (!token) {
    alert("User is not signed in. Redirecting to signin page.");
    window.location.href = "https://localhost:3000/signin";
    return;
  }

  axios
    .put(
      `https://localhost:3000/todos/complete`,
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
    window.location.href = "https://localhost:3000/signin";
    return;
  }
  axios
    .delete(`https://localhost:3000/todos/${todo_id}`, {
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

// Rename the function that simply toggles the edit form:
function toggleEditTodoForm(todo_id) {
  const todo_form = document.getElementById("todo-input-two");
  todo_form.classList.toggle("close");
  currentEditTodoId = todo_id;
}

window.toggleEditTodoForm = toggleEditTodoForm;

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/signin";  // Redirect user to the signin page
}

// Function to submit the edited todo
function SubmitEditedTodo(){
  const token = localStorage.getItem("token");
  if (!token) {
    alert("user not signin correctly");
    window.location.href = "https://localhost:3000/signin";
    return;
  }
  if(!currentEditTodoId){
    alert("unable to fetch todo id in edit end point");
    window.location.href = "https://localhost:3000/todos";
    return;
  }
  const todo_title = document.getElementById("todo-title-two");
  const date = document.getElementById("todo-date-input-two");
  const priority = document.getElementById("todo-priority-input-two");
  const status = document.getElementById("todo-status-input-two");

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
  axios.put(`https://localhost:3000/todos/${currentEditTodoId}`,todo,{
    headers: { Authorization: token },
  }).then((response) => {
    if (response.data === "success" || response.status === 200) {
      loadtodos();
      Todomenu();
    }
  }).catch((error) =>{
    console.error(error);
  });

  console.log("before submitting ",todo);
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
    .post("https://localhost:3000/todos", todo, {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log(response);
      if (response.data === "success" || response.status === 200) {
        
        // window.location.href = "https://localhost:3000/todos";
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
