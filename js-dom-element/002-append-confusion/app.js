document.getElementById("add-item").addEventListener("click", () => {
    const list = document.getElementById("shopping-list");
    
    // BUG: Trying to append a raw string as an element
    const newItem = "<li>Bread</li>";
    
    // appendChild expects a Node object, not a string
    list.appendChild(newItem);
});
