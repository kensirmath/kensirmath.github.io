// State management
let selectedOperation = null;

// DOM elements
const real1Input = document.getElementById('real1');
const imag1Input = document.getElementById('imag1');
const real2Input = document.getElementById('real2');
const imag2Input = document.getElementById('imag2');
const operationButtons = document.querySelectorAll('.btn-operation');
const calculateBtn = document.getElementById('calculateBtn');
const errorMessage = document.getElementById('errorMessage');
const resultSection = document.getElementById('resultSection');
const resultValue = document.getElementById('resultValue');
const realPart = document.getElementById('realPart');
const imagPart = document.getElementById('imagPart');

// Operation button handlers
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        operationButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedOperation = button.dataset.operation;
        hideError();
    });
});

// Calculate button handler
calculateBtn.addEventListener('click', calculate);

// Enter key handler for inputs
[real1Input, imag1Input, real2Input, imag2Input].forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calculate();
        }
    });
});

function calculate() {
    hideError();
    hideResult();

    // Validate operation selected
    if (!selectedOperation) {
        showError('請選擇運算類型');
        return;
    }

    // Get input values
    const a = real1Input.value.trim();
    const b = imag1Input.value.trim();
    const c = real2Input.value.trim();
    const d = imag2Input.value.trim();

    // Validate inputs
    if (a === '' || b === '' || c === '' || d === '') {
        showError('請填寫所有欄位');
        return;
    }

    // Convert to numbers
    const real1 = parseFloat(a);
    const imag1 = parseFloat(b);
    const real2 = parseFloat(c);
    const imag2 = parseFloat(d);

    // Validate numbers
    if (isNaN(real1) || isNaN(imag1) || isNaN(real2) || isNaN(imag2)) {
        showError('請輸入有效的數字');
        return;
    }

    // Perform calculation
    let resultReal, resultImag;

    switch (selectedOperation) {
        case 'add':
            resultReal = real1 + real2;
            resultImag = imag1 + imag2;
            break;
        case 'subtract':
            resultReal = real1 - real2;
            resultImag = imag1 - imag2;
            break;
        case 'multiply':
            resultReal = real1 * real2 - imag1 * imag2;
            resultImag = real1 * imag2 + imag1 * real2;
            break;
        case 'divide':
            const denominator = real2 * real2 + imag2 * imag2;
            if (denominator === 0) {
                showError('除數不能為零');
                return;
            }
            resultReal = (real1 * real2 + imag1 * imag2) / denominator;
            resultImag = (imag1 * real2 - real1 * imag2) / denominator;
            break;
    }

    // Display result
    displayResult(resultReal, resultImag);
}

function displayResult(real, imag) {
    // Round to 6 decimal places to avoid floating point errors
    //    real = Math.round(real * 1000000) / 1000000;
    //    imag = Math.round(imag * 1000000) / 1000000;

    // Format result string
    let resultStr = '';

    if (real !== 0) {
        resultStr = real.toString();
    }

    if (imag !== 0) {
        if (imag > 0 && real !== 0) {
            resultStr += ' + ';
        } else if (imag < 0) {
            resultStr += real !== 0 ? ' - ' : '-';
        }


        imagAbsolute = Math.abs(imag);

        if (imag === 1) {
            resultStr += 'i';
        } else if (imag === -1) {
            resultStr += '-i';
        } else {
            resultStr += imagAbsolute + 'i';
        }
    }

    if (real === 0 && imag === 0) {
        resultStr = '0';
    }

    resultValue.textContent = resultStr;

    // Check if result is rational using enhanced detection
    if (isRationalNumber(real)) {
        const realfraction = decimalToFraction(real);

        if (realfraction.denominator === 1) {
            // Integer result
            realPart.textContent = real;
        } else if (Math.abs(realfraction.denominator) <= 10000) {
            // Rational number - show both decimal and fraction
            realPart.textContent = `${realfraction.numerator}/${realfraction.denominator}`;
        } else {
            // Rational but denominator too large
            realPart.textContent = real;
        }
    } else {
        // Irrational number - only show decimal
        realPart.textContent = real;
    }

    // Check if result is rational using enhanced detection
    if (isRationalNumber(imag)) {
        const imagfraction = decimalToFraction(imag);

        if (imagfraction.denominator === 1) {
            // Integer result
            imagPart.textContent = imag;
        } else if (Math.abs(imagfraction.denominator) <= 10000) {
            // Rational number - show both decimal and fraction
            //            imagPart.textContent = imagfraction.numerator, imagfraction.denominator;
            imagPart.textContent = `${imagfraction.numerator}/${imagfraction.denominator}`;
        } else {
            // Rational but denominator too large
            imagPart.textContent = imag;
        }
    } else {
        // Irrational number - only show decimal
        imagPart.textContent = imag;
    }



    //  realPart.textContent = real;
    //  imagPart.textContent = Math.round(Math.abs(imag === Math.abs(imag) ? imag : -imag) * 1000000) / 1000000;

    resultSection.classList.remove('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function hideResult() {
    resultSection.classList.add('hidden');
}


// Enhanced rational number detection
function isRationalNumber(num, tolerance = 1e-22) {
    if (!isFinite(num) || isNaN(num)) return false;

    // Check if it's very close to an integer
    if (Math.abs(num - Math.round(num)) < tolerance) return true;

    // Use continued fractions for more accurate detection
    const fraction = decimalToFraction(num, tolerance);
    const reconstructed = fraction.numerator / fraction.denominator;

    return Math.abs(num - reconstructed) < tolerance && Math.abs(fraction.denominator) <= 10000;
}

// Enhanced Decimal to Fraction Conversion using Continued Fractions
function decimalToFraction(decimal, tolerance = 1e-22) {
    if (Math.abs(decimal - Math.round(decimal)) < tolerance) {
        return { numerator: Math.round(decimal), denominator: 1 };
    }

    let sign = decimal < 0 ? -1 : 1;
    decimal = Math.abs(decimal);

    let a = Math.floor(decimal);
    let remainder = decimal - a;

    if (remainder < tolerance) {
        return { numerator: sign * a, denominator: 1 };
    }

    let p0 = 1, p1 = a;
    let q0 = 0, q1 = 1;

    for (let i = 0; i < 10000 && remainder > tolerance && q1 < 10000; i++) {
        decimal = 1 / remainder;
        a = Math.floor(decimal);
        remainder = decimal - a;

        let p2 = a * p1 + p0;
        let q2 = a * q1 + q0;

        if (q2 > 10000) break;

        let testValue = p2 / q2;
        if (Math.abs(testValue - Math.abs(sign * decimal)) < tolerance) {
            return { numerator: sign * p2, denominator: q2 };
        }

        p0 = p1; p1 = p2;
        q0 = q1; q1 = q2;
    }

    return { numerator: sign * p1, denominator: q1 };
}
