const todos = ["Buy Milk", "Walk Dog", "Code fix"];
const list = document.getElementById("todo-list");

// BUG: map() is used but it's not returning anything, 
// so 'htmlItems' becomes an array of [undefined, undefined, undefined]
const htmlItems = todos.map(todo => {
    `<li>${todo}</li>`; 
});

list.innerHTML = htmlItems.join("");
