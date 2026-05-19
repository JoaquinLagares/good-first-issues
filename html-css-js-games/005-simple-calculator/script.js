let currentValue = '0';
let previousValue = '';
let operator = null;

const display = document.getElementById('display');

function appendNumber(num) {
    if (currentValue === '0' && num !== '.') {
        currentValue = num;
    } else if (!(currentValue.includes('.') && num === '.')) {
        currentValue += num;
    }
    updateDisplay();
}

function setOperator(op) {
    if (previousValue === '') {
        previousValue = currentValue;
    } else if (operator) {
        // BUG: Missing call to calculate() before chaining operators
        previousValue = calculate();
    }
    operator = op;
    currentValue = '0';
    updateDisplay();
}

function calculate() {
    let result = parseFloat(previousValue);
    let current = parseFloat(currentValue);
    
    if (operator === '+') result += current;
    if (operator === '-') result -= current;
    if (operator === '*') result *= current;
    if (operator === '/') result /= current;
    
    currentValue = result.toString();
    previousValue = '';
    operator = null;
    updateDisplay();
    
    return result;
}

function clearDisplay() {
    currentValue = '0';
    previousValue = '';
    operator = null;
    updateDisplay();
}

function updateDisplay() {
    display.value = currentValue;
}

updateDisplay();
