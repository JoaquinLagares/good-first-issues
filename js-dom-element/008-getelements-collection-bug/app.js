document.getElementById("color-all").addEventListener("click", () => {
    // BUG: getElementsByClassName returns a collection/array-like object, 
    // you cannot set style on the collection itself!
    const paras = document.getElementsByClassName("highlight");
    
    paras.style.backgroundColor = "yellow"; 
});
