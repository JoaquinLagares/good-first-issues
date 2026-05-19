const box = document.getElementById("status-box");
const btn = document.getElementById("toggle-btn");

btn.addEventListener("click", () => {
    // BUG: Trying to read className as a function or using wrong check
    if (box.classList("active")) { // Should be classList.contains("active")
        box.classList.remove("active");
    } else {
        box.classList.add("active");
    }
});
