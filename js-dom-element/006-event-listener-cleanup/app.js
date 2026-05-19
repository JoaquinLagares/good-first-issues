const mainBtn = document.getElementById("main-btn");
const removeBtn = document.getElementById("remove-btn");

function showAlert() {
    alert("Button clicked!");
}

mainBtn.addEventListener("click", showAlert);

removeBtn.addEventListener("click", () => {
    // BUG: Trying to remove an anonymous function or passing it wrong
    // This looks correct but check if it's actually working!
    mainBtn.removeEventListener("click", () => showAlert()); 
});
