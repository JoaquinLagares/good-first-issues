document.getElementById("start-btn").addEventListener("click", function() {
    const name = "Developer";
    
    // BUG: Trying to access 'name' inside a callback where it might be lost
    // (In this specific case, it's about not passing it or closure understanding)
    setTimeout(function() {
        // Imagine 'name' was defined in a way it's not accessible here
        document.getElementById("msg").innerText = "Hello, " + name;
    }, 1000);
});
/*
Correction Hint: Actually, closures handle this, but beginners often
mistype variable names or define them inside the wrong scope.
Let's make it a real typo for "name" vs "User".
*/
