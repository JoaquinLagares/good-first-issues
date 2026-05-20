let flipped = [];
let matched = 0;
const cards = document.querySelectorAll('.card');
const matchesDisplay = document.getElementById('matches');
const resetBtn = document.getElementById('resetBtn');

cards.forEach(card => {
    card.addEventListener('click', handleCardClick);
});

function handleCardClick(e) {
    const card = e.target;
    
    if (flipped.length > 2) return;
    if (card.classList.contains('flipped')) return;
    
    card.classList.add('flipped');
    card.textContent = card.getAttribute('data-value');
    flipped.push(card);
    
    if (flipped.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    const [card1, card2] = flipped;
    
    if (card1.getAttribute('data-value') === card2.getAttribute('data-value')) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matched++;
        matchesDisplay.textContent = matched;
        
        if (matched === 8) {
            setTimeout(() => alert('You won!'), 300);
        }
    } else {
        // BUG: Cards are not flipping back!
        // card1.classList.remove('flipped');
        // card2.classList.remove('flipped');
        // card1.textContent = '';
        // card2.textContent = '';
    }
    
    flipped = [];
}

resetBtn.addEventListener('click', function() {
    cards.forEach(card => {
        card.classList.remove('flipped', 'matched');
        card.textContent = '';
    });
    flipped = [];
    matched = 0;
    matchesDisplay.textContent = 0;
});
