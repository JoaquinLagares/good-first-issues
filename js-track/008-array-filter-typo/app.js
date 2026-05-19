const ages = [12, 18, 25, 10, 30, 15];
const list = document.getElementById("member-list");

// BUG: Using < instead of >= for "Adults only" (18+)
const adults = ages.filter(age => age < 18);

adults.forEach(age => {
    const li = document.createElement("li");
    li.innerText = `Member Age: ${age}`;
    list.appendChild(li);
});
