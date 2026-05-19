const btn = document.getElementById("toggle-btn");

// Check for saved theme on load
// BUG: The key used to GET is different from the key used to SET
const savedTheme = localStorage.getItem("user_theme"); 

if (savedTheme === "dark") {
    document.body.style.backgroundColor = "#333";
    document.body.style.color = "white";
}

btn.addEventListener("click", () => {
    document.body.style.backgroundColor = "#333";
    document.body.style.color = "white";
    
    // BUG: Setting key as 'user-theme' (dash) but getting as 'user_theme' (underscore)
    localStorage.setItem("user-theme", "dark");
});
