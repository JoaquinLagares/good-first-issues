const passwordInput = document.getElementById('passwordInput');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

const lengthCheck = document.getElementById('lengthCheck');
const upperCheck = document.getElementById('upperCheck');
const lowerCheck = document.getElementById('lowerCheck');
const numberCheck = document.getElementById('numberCheck');
const specialCheck = document.getElementById('specialCheck');

passwordInput.addEventListener('input', function() {
    const password = this.value;
    let strength = 0;
    
    // Check length
    if (password.length >= 8) {
        lengthCheck.classList.add('valid');
        lengthCheck.textContent = '✓';
        strength++;
    } else {
        lengthCheck.classList.remove('valid');
        lengthCheck.textContent = '✗';
    }
    
    // Check uppercase
    if (/[A-Z]/.test(password)) {
        upperCheck.classList.add('valid');
        upperCheck.textContent = '✓';
        strength++;
    } else {
        upperCheck.classList.remove('valid');
        upperCheck.textContent = '✗';
    }
    
    // Check lowercase
    if (/[a-z]/.test(password)) {
        lowerCheck.classList.add('valid');
        lowerCheck.textContent = '✓';
        strength++;
    } else {
        lowerCheck.classList.remove('valid');
        lowerCheck.textContent = '✗';
    }
    
    // Check number
    if (/[0-9]/.test(password)) {
        numberCheck.classList.add('valid');
        numberCheck.textContent = '✓';
        strength++;
    } else {
        numberCheck.classList.remove('valid');
        numberCheck.textContent = '✗';
    }
    
    // Check special character
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        specialCheck.classList.add('valid');
        specialCheck.textContent = '✓';
        strength++;
    } else {
        specialCheck.classList.remove('valid');
        specialCheck.textContent = '✗';
    }
    
    // BUG: Strength level is off by one
    if (strength <= 2) {
        strengthBar.className = 'weak';
        strengthText.textContent = 'Weak';
    } else if (strength <= 3) {
        strengthBar.className = 'medium';
        strengthText.textContent = 'Medium';
    } else {
        strengthBar.className = 'strong';
        strengthText.textContent = 'Strong';
    }
});
