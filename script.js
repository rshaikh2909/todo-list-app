const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

let tasks = [];
let currentFilter = "all";

// Load Tasks
window.onload = function () {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }

    renderTasks();
};

// Add Task
addBtn.addEventListener("click", function () {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        id: Date.now(),
        text: taskText,
        completed: false
    });

    taskInput.value = "";

    saveTasks();
    renderTasks();
});

// Save Tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render Tasks
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.dataset.id = task.id;

        li.innerHTML = `
            <span class="task-text ${task.completed ? 'completed' : ''}">
                ${task.text}
            </span>

            <div>
                <button class="edit-btn">Edit</button>
                <button class="complete-btn">✓</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

// Event Delegation
taskList.addEventListener("click", function(event) {

    const li = event.target.closest("li");

    if (!li) return;

    const id = Number(li.dataset.id);

    // Delete Task
    if (event.target.classList.contains("delete-btn")) {

        tasks = tasks.filter(task => task.id !== id);

        saveTasks();
        renderTasks();
    }

    // Complete Task
    if (event.target.classList.contains("complete-btn")) {

        tasks = tasks.map(task => {

            if (task.id === id) {
                task.completed = !task.completed;
            }

            return task;
        });

        saveTasks();
        renderTasks();
    }

    // Edit Task
    if (event.target.classList.contains("edit-btn")) {

        const task = tasks.find(task => task.id === id);

        const newText = prompt("Edit task:", task.text);

        if (newText && newText.trim() !== "") {

            task.text = newText.trim();

            saveTasks();
            renderTasks();
        }
    }
});

// Filter Buttons
const filterButtons = document.querySelectorAll("[data-filter]");

filterButtons.forEach(button => {

    button.addEventListener("click", function() {

        currentFilter = this.dataset.filter;

        renderTasks();
    });

});