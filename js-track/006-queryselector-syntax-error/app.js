const btn = document.getElementById("update-btn");

btn.addEventListener("click", () => {
    // BUG: querySelector requires CSS selector syntax. 
    // Classes need a '.' prefix, IDs need a '#' prefix.
    const box = document.querySelector("status-box"); 
    
    if (box) {
        box.innerText = "Status: Online ✅";
    } else {
        console.error("Could not find the element!");
    }
});
