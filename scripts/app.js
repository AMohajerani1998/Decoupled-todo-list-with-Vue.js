const TodoApp = {
    data() {
        return {
            isLoading: false,
            enteredTask: "",
            todos: [],
            editedTodoId: null,
        };
    },

    methods: {
        async saveTodo(event) {
            event.preventDefault();
            if (this.editedTodoId) {
                let response;
                const todoId = this.editedTodoId;
                try {
                    response = await fetch (`http://localhost:3000/todos/${todoId}`, {
                        method: 'PATCH',
                        body: JSON.stringify({
                            task: this.enteredTask,
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                } catch (error) {
                    return alert ('Something went wrong!')
                }
                if (!response.ok){
                    return alert ('Something went wrong!')
                }
                const responseData = await response.json()
                const todoEditIndex = this.todos.findIndex(function(todo){
                    return todo.id === responseData.todo.id
                })
                const todoEdit = {
                    id: this.todos[todoEditIndex].id,
                    task: this.enteredTask,
                };
                this.todos[todoEditIndex] = todoEdit;
            } else {
                const result = await fetch("http://localhost:3000/todos", {
                    method: "POST",
                    body: JSON.stringify({
                        task: this.enteredTask,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const resultData = await result.json();
                const newTodo = {
                    task: resultData.todo.task,
                    id: resultData.todo.id,
                };
                this.todos.unshift(newTodo);
            }
            this.enteredTask = "";
        },

        startEditTodo(todoId) {
            this.editedTodoId = todoId;
            const todo = this.todos.find(function (todoItem) {
                return todoItem.id === todoId;
            });
            this.enteredTask = todo.task;
        },

        async deleteTodo(todoId) {
            let result;
            try {
                result = await fetch (`http://localhost:3000/todos/${todoId}`, {
                    method: 'DELETE'
                })
            } catch (error) {
                return alert ('Something went wrong!')
            }
            if (!result.ok) {
                return alert ('Something went wrong!')
            }
            this.todos = this.todos.filter(function (todoItem) {
                return todoItem.id !== todoId;
            });
        },
    },

    async created() {
        this.isLoading = true;
        let result;
        try {
            result = await fetch("http://localhost:3000/todos");
        } catch (error) {
            this.isLoading = false;
            return alert("Something went wrong!");
        }
        this.isLoading = false;
        if (!result.ok){
            return alert ('Something went wrong!')
        }
        resultData = await result.json();
        this.todos = resultData.todos
    },
};

Vue.createApp(TodoApp).mount("#todos-app");
