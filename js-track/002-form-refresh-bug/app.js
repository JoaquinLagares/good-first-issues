document.getElementById("join-form").addEventListener("submit", (e) => {
    // BUG: The page reloads every time you click submit!
    // We need to stop the browser's default behavior.
    
    const welcome = document.getElementById("welcome");
    welcome.innerText = "Welcome to the club! You are now a member.";
});
