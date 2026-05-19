document.getElementById("delete-me").addEventListener("click", function() {
    // BUG: Deleting the parent node instead of the element itself
    this.parentNode.remove();
});
