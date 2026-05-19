const clickBtn = document.querySelector(".click-me");

clickBtn.addEventListener("click", () => {
    alert("Original button works!");
});

document.getElementById("clone-btn").addEventListener("click", () => {
    const original = document.getElementById("original");
    
    // BUG: cloneNode(true) copies the HTML but NOT the event listeners!
    const copy = original.cloneNode(true);
    document.body.appendChild(copy);
});
