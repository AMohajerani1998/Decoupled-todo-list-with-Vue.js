const tasksContainer = document.getElementById("tasks-container");
const newTaskSubmitButton = document.getElementById("submit-task");
async function loadTodos() {
    let result;
    try {
        result = await fetch("http://localhost:3000/todos", {
            method: "GET",
        });
    } catch (error) {
        return alert("Something went wrong");
    }
    if (!result.ok) {
        return alert("Something went wrong");
    }
    const resultData = await result.json();
    const todos = resultData.todos;
    for (const todo of todos) {
        const todoArticle = document.createElement("article");
        const todoTaskH3 = document.createElement("h3");
        todoTaskH3.textContent = todo.task;
        const todoButtonsDiv = document.createElement("div");
        const deleteButton = document.createElement("button");
        deleteButton.classList = "delete";
        deleteButton.textContent = "DELETE";
        deleteButton.dataset.todoid = todo.id;
        todoButtonsDiv.appendChild(deleteButton);
        const editButton = document.createElement("button");
        editButton.classList = "edit";
        editButton.textContent = "EDIT";
        editButton.dataset.todoid = todo.id;
        editButton.addEventListener("click", loadTodoEditForm);
        todoButtonsDiv.appendChild(editButton);
        todoArticle.appendChild(todoTaskH3);
        todoArticle.appendChild(todoButtonsDiv);
        tasksContainer.appendChild(todoArticle);
    }
}

async function saveTask(event) {
    event.preventDefault();
    const formdata = new FormData(event.target.parentElement);
    const taskValue = formdata.get("task");
    let response;
    try {
        if (!event.target.dataset.todoid){
            response = await fetch("http://localhost:3000/todos", {
                method: "POST",
                body: JSON.stringify({
                    task: taskValue,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } else {
            response = await fetch(`http://localhost:3000/todos/${event.target.dataset.todoid}`, {
                method: "PATCH",
                body: JSON.stringify({
                    task: taskValue,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
    } catch (error) {
        alert("Something went wrong!");
    }
    if (!response.ok) {
        return alert("Something went wrong");
    }
    const responseData = await response.json();
    const todo = responseData.todo;
    const todoDiv = event.target.parentElement.parentElement;
    const todoArticle = document.createElement("article");
    const todoTaskH3 = document.createElement("h3");
    todoTaskH3.textContent = todo.task;
    const todoButtonsDiv = document.createElement("div");
    const deleteButton = document.createElement("button");
    deleteButton.classList = "delete";
    deleteButton.textContent = "DELETE";
    deleteButton.dataset.todoid = todo.id;
    todoButtonsDiv.appendChild(deleteButton);
    const editButton = document.createElement("button");
    editButton.classList = "edit";
    editButton.textContent = "EDIT";
    editButton.dataset.todoid = todo.id;
    editButton.addEventListener("click", loadTodoEditForm);
    todoButtonsDiv.appendChild(editButton);
    todoArticle.appendChild(todoTaskH3);
    todoArticle.appendChild(todoButtonsDiv);
    if (!event.target.dataset.todoid){
        tasksContainer.insertBefore(todoArticle, tasksContainer.firstChild);
        return;
    } else {
        todoDiv.innerHTML = ''
        todoDiv.appendChild(todoTaskH3);
        todoDiv.appendChild(todoButtonsDiv);
    }
}

async function loadTodoEditForm(event) {
    event.preventDefault;
    const todoPreviousTask = event.target.parentElement.parentElement.firstChild.innerText
    const todoId = event.target.dataset.todoid;
    const todoContainer = event.target.parentElement.parentElement;
    todoContainer.innerHTML = "";
    const todoForm = document.createElement("form");
    todoForm.action = "/todos";
    todoContainer.appendChild(todoForm);
    const todoTextArea = document.createElement("textarea");
    todoTextArea.value = todoPreviousTask
    todoTextArea.rows = 1;
    todoTextArea.name = "task";
    todoForm.appendChild(todoTextArea);
    const todoSubmitButton = document.createElement("button");
    todoSubmitButton.textContent = "Save";
    todoSubmitButton.dataset.todoid = todoId
    todoForm.appendChild(todoSubmitButton)
    todoSubmitButton.addEventListener("click", saveTask);
}

loadTodos();

newTaskSubmitButton.addEventListener("click", saveTask);
