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
  real = Math.round(real * 1000000) / 1000000;
  imag = Math.round(imag * 1000000) / 1000000;

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
      imag = Math.abs(imag);
    }
    
    if (imag === 1) {
      resultStr += 'i';
    } else {
      resultStr += imag + 'i';
    }
  }
  
  if (real === 0 && imag === 0) {
    resultStr = '0';
  }

  resultValue.textContent = resultStr;
  realPart.textContent = real;
  imagPart.textContent = Math.round(Math.abs(imag === Math.abs(imag) ? imag : -imag) * 1000000) / 1000000;

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