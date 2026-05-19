document.getElementById("check-btn").addEventListener("click", () => {
    const userInput = document.getElementById("guess-input").value;
    const feedback = document.getElementById("feedback");
    const secretNum = 7;

    // BUG: userInput is a STRING ("7") but secretNum is a NUMBER (7).
    // Strict equality (===) will return false.
    if (userInput === secretNum) {
        feedback.innerText = "Correct! You win!";
        feedback.style.color = "green";
    } else {
        feedback.innerText = "Wrong! Try again.";
        feedback.style.color = "red";
    }
});
