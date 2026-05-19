const user = { name: "Alice", level: 5 };

document.getElementById("save-btn").addEventListener("click", () => {
    // BUG: localStorage only stores STRINGS. 
    // Storing an object directly results in "[object Object]"
    localStorage.setItem("user_profile", user);
});

document.getElementById("load-btn").addEventListener("click", () => {
    const data = localStorage.getItem("user_profile");
    document.getElementById("display").innerText = "Loaded: " + data.name;
});
