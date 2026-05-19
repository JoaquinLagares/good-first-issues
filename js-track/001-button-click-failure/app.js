// BUG: This code never runs because the event isn't attached correctly
const btn = document.getElementById("magik-button"); // ID typo here!
const msg = document.getElementById("message");

btn.addEventListener("click", () => {
    msg.innerText = "You found the surprise! 🎉";
});
