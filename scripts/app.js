const TodoApp = {
    data() {
        return {
            enteredTask: "",
            todos: [],
            editedTodoId: null,
        };
    },

    methods: {
        saveTodo(event) {
            event.preventDefault();
            if (this.editedTodoId) {
                const todoId = this.editedTodoId;
                const todoEditIndex = this.todos.findIndex(function (todoItem) {
                    return todoItem.id === todoId;
                });
                const todoEdit = {
                    id: this.todos[todoEditIndex].id,
                    task: this.enteredTask,
                };
                this.todos[todoEditIndex] = todoEdit;
            } else {
                const newTodo = {
                    task: this.enteredTask,
                    id: new Date().toISOString(),
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

        deleteTodo(todoId){
            this.todos = this.todos.filter(function(todoItem){
                return todoItem.id !== todoId
            })
        }
    },
};

Vue.createApp(TodoApp).mount("#todos-app");
