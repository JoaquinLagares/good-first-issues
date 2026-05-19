document.getElementById("add-text").addEventListener("click", () => {
    const container = document.getElementById("container");
    
    // BUG: Using = instead of += wipes out the existing h1!
    container.innerHTML = "<p>Newly added text!</p>";
});
