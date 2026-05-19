document.getElementById("count-btn").addEventListener("click", () => {
    const inputField = document.getElementById("username");
    
    // BUG: Trying to get text from an input using innerText instead of value
    const text = inputField.innerText; 
    
    document.getElementById("char-count").innerText = text.length;
});
