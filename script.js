const taskInput = document.querySelector(".task-input input");
filters = document.querySelectorAll(".filters span");
const clearAll = document.querySelector(".clear-btn");
// confirmBtn = document.querySelector(".confirm-btn");
taskBox = document.querySelector(".task-box");

const addButton = document.querySelector(".task-input button");
addButton.addEventListener("click", addTask);

let editId;
let isEditedTask = false;
// Getting local storage todo-list or initializing it as an empty array
let todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});
function showTodo(filter) {
    let li = "";
    if (todos) {
        todos.forEach((todo, id) => {
            // if todo status is completed, set the iscompleted value to checked
            let isCompleted = todo.status == "completed" ? "checked" : "";
            if (filter == todo.status || filter == "all") {
                li += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" class="check" id="${id}" ${isCompleted} style="transform: scale(1.3);">
                                <p class="${isCompleted}">${todo.name}</p>
                            </label>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
                                <ul class="task-menu">
                                    <li onclick="editTask('${id}', '${todo.name}')"><i class="fas fa-pen"></i>Edit</li>
                                    <li onclick="deleteTask(${id})"><i class="fas fa-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </li>`;
            }
        });
    }
    taskBox.innerHTML = li || `<span>You don't have any task here</span>`;
}

showTodo("all");
function showMenu(selectedTask) {
    //getting task menu div
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    document.addEventListener("click", e => {
        // removing show class from the task menu on the document click
        if (e.target.tagName != "I" || e.target != selectedTask) {
            taskMenu.classList.remove("show");
        }
    })
}

function editTask(taskId, taskName) {
    editId = taskId;
    isEditedTask = true;
    taskInput.value = taskName;
}

function deleteTask(deleteId) {
    // removing selected item
    todos.splice(deleteId, 1);
    saveData();
    showTodo("all");
}

clearAll.addEventListener("click", () => {
    // Show the confirmation dialog when the "Clear All" button is clicked
    const confirmDialog = document.querySelector('.confirm');
    confirmDialog.style.display = 'block';

});

function confirmBtn() {
    const confirmBtn = document.querySelector(".confirm-btn");
    confirmBtn.addEventListener("click", () => {
        // Clear all tasks when the confirmation "Yes" button is clicked
        todos = []; // Clear all tasks
        saveData(); // Save the empty list
        showTodo("all"); // Refresh the task list
        // Hide the confirmation dialog
        const confirmDialog = document.querySelector('.confirm');
        confirmDialog.style.display = 'none';
    });
}

function cancelClear() {
    // Hide the confirmation dialog when "No" is clicked
    const confirmDialog = document.querySelector('.confirm');
    confirmDialog.style.display = 'none';
}

function updateStatus(selectedTask) {
    // getting paragraph that contains task name
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        // updating the status pending to completed
        todos[selectedTask.id].status = "completed"
    } else {
        taskName.classList.remove("checked");
        // updating the status to pending
        todos[selectedTask.id].status = "pending"
    }
    saveData();
}
taskInput.addEventListener("keyup", (e) => {
    let userTask = taskInput.value.trim();
    if (e.key == "Enter" && userTask) {
        if (!isEditedTask) {// if isEditedTask isnt true
            if (!todos) {// if todos isnt exist, pass an empty array to todos
                todos = [];
            }
            let taskInfo = { name: userTask, status: "pending" };
            todos.push(taskInfo); // Adding new task to todos
        } else {
            isEditedTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";

        saveData();
        showTodo("all");
    }
});

function saveData() {
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        // Create a new task object
        const newTask = { name: taskText, status: "pending" };

        if (!todos) {
            todos = [];
        }

        todos.push(newTask);

        // Clear the input field
        taskInput.value = "";

        // Save the updated task list
        saveData();

        // Show the updated task list
        showTodo("all");
    }
}
