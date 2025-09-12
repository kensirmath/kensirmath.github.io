// Math Calculator App JavaScript

// Global variables for scientific calculator
let currentCursorPosition = 0;
let angleMode = 'DEG'; // DEG or RAD
const MATH_CONSTANTS = {
    pi: Math.PI,
    e: Math.E
};

// Page navigation
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Clear previous results when switching pages
    clearResults();
    
    // Initialize scientific calculator if needed
    if (pageId === 'scientific') {
        initScientificCalculator();
    }
}

function clearResults() {
    const resultSections = document.querySelectorAll('.result-section');
    resultSections.forEach(section => {
        section.classList.add('hidden');
    });
}

// Scientific Calculator Functions with Cursor Support
function initScientificCalculator() {
    const display = document.getElementById('calc-display');
    display.value = '';
    document.getElementById('calc-result').classList.add('hidden');
    
    // Add event listeners for cursor editing
    display.addEventListener('click', focusDisplay);
    display.addEventListener('keydown', handleKeyDown);
    display.addEventListener('input', updateExpression);
    display.addEventListener('keyup', updateCursorPosition);
    display.addEventListener('mouseup', updateCursorPosition);
}

function focusDisplay() {
    const display = document.getElementById('calc-display');
    display.focus();
    updateCursorPosition();
}

function updateCursorPosition() {
    const display = document.getElementById('calc-display');
    currentCursorPosition = display.selectionStart;
}

function updateExpression() {
    updateCursorPosition();
}

function handleKeyDown(event) {
    updateCursorPosition();
    
    // Handle special keys
    if (event.key === 'Enter') {
        event.preventDefault();
        calculateResult();
    } else if (event.key === 'Escape') {
        event.preventDefault();
        clearCalculator();
    }
}

function insertAtCursor(text) {
    const display = document.getElementById('calc-display');
    const start = display.selectionStart;
    const end = display.selectionEnd;
    const currentValue = display.value;
    
    // Insert text at cursor position
    const newValue = currentValue.substring(0, start) + text + currentValue.substring(end);
    display.value = newValue;
    
    // Set new cursor position
    const newCursorPos = start + text.length;
    display.setSelectionRange(newCursorPos, newCursorPos);
    display.focus();
    
    // Update cursor position tracking
    currentCursorPosition = newCursorPos;
}

function backspaceAtCursor() {
    const display = document.getElementById('calc-display');
    const start = display.selectionStart;
    const end = display.selectionEnd;
    const currentValue = display.value;
    
    if (start !== end) {
        // Delete selected text
        const newValue = currentValue.substring(0, start) + currentValue.substring(end);
        display.value = newValue;
        display.setSelectionRange(start, start);
    } else if (start > 0) {
        // Delete character before cursor
        const newValue = currentValue.substring(0, start - 1) + currentValue.substring(start);
        display.value = newValue;
        display.setSelectionRange(start - 1, start - 1);
    }
    
    display.focus();
    updateCursorPosition();
}

function toggleAngleMode() {
    angleMode = angleMode === 'DEG' ? 'RAD' : 'DEG';
    document.getElementById('angle-mode-btn').textContent = angleMode;
}

function clearCalculator() {
    const display = document.getElementById('calc-display');
    display.value = '';
    display.focus();
    currentCursorPosition = 0;
    document.getElementById('calc-result').classList.add('hidden');
}

function calculateResult() {
    const display = document.getElementById('calc-display');
    const expression = display.value;
    
    if (!expression.trim()) return;
    
    try {
        const result = evaluateExpression(expression);
        document.getElementById('calc-output').textContent = formatCalculatorResult(result);
        document.getElementById('calc-result').classList.remove('hidden');
    } catch (error) {
        document.getElementById('calc-output').textContent = '錯誤：' + error.message;
        document.getElementById('calc-result').classList.remove('hidden');
    }
}

// Fraction parsing function for linear system
function parseFraction(input) {
    // Handle empty input
    if (!input || input.trim() === '') return 0;
    
    const str = input.trim();
    
    // Handle mixed numbers: e.g., "2 1/3"
    const mixedMatch = str.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
    if (mixedMatch) {
        const whole = parseInt(mixedMatch[1]);
        const num = parseInt(mixedMatch[2]);
        const den = parseInt(mixedMatch[3]);
        if (den === 0) throw new Error('分母不能為零');
        return whole + (whole >= 0 ? num/den : -num/den);
    }
    
    // Handle pure fractions: e.g., "3/4", "-2/5"
    const fracMatch = str.match(/^(-?\d+)\/(-?\d+)$/);
    if (fracMatch) {
        const num = parseInt(fracMatch[1]);
        const den = parseInt(fracMatch[2]);
        if (den === 0) throw new Error('分母不能為零');
        return num / den;
    }
    
    // Handle decimal numbers
    const decimal = parseFloat(str);
    if (isNaN(decimal)) throw new Error('無效的數字格式');
    return decimal;
}

// Function to convert decimal to fraction
function decimalToFraction(decimal, tolerance = 1e-10) {
    if (Number.isInteger(decimal)) {
        return { numerator: decimal, denominator: 1 };
    }
    
    // Handle negative numbers
    const sign = decimal < 0 ? -1 : 1;
    decimal = Math.abs(decimal);
    
    // Try to find a simple fraction representation
    for (let denominator = 2; denominator <= 1000; denominator++) {
        const numerator = Math.round(decimal * denominator);
        if (Math.abs(decimal - numerator / denominator) < tolerance) {
            const gcdValue = gcd(numerator, denominator);
            return {
                numerator: sign * (numerator / gcdValue),
                denominator: denominator / gcdValue
            };
        }
    }
    
    // If no simple fraction found, return as decimal
    return null;
}

function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Expression Parser and Evaluator
function evaluateExpression(expr) {
    // Replace constants
    expr = expr.replace(/pi/g, MATH_CONSTANTS.pi.toString());
    expr = expr.replace(/e(?![a-zA-Z])/g, MATH_CONSTANTS.e.toString());
    
    // Tokenize the expression
    const tokens = tokenize(expr);
    
    // Parse and evaluate
    const result = parseExpression(tokens);
    
    if (isNaN(result) || !isFinite(result)) {
        throw new Error('無效的計算結果');
    }
    
    return result;
}

function tokenize(expr) {
    const tokens = [];
    let i = 0;
    
    while (i < expr.length) {
        const char = expr[i];
        
        if (/\s/.test(char)) {
            i++;
            continue;
        }
        
        if (/\d/.test(char) || char === '.') {
            // Number
            let num = '';
            while (i < expr.length && (/\d/.test(expr[i]) || expr[i] === '.')) {
                num += expr[i];
                i++;
            }
            tokens.push({ type: 'NUMBER', value: parseFloat(num) });
        } else if (/[a-zA-Z]/.test(char)) {
            // Function or constant
            let name = '';
            while (i < expr.length && /[a-zA-Z]/.test(expr[i])) {
                name += expr[i];
                i++;
            }
            tokens.push({ type: 'FUNCTION', value: name });
        } else if (['+', '-', '*', '/', '^'].includes(char)) {
            tokens.push({ type: 'OPERATOR', value: char });
            i++;
        } else if (char === '(') {
            tokens.push({ type: 'LPAREN', value: char });
            i++;
        } else if (char === ')') {
            tokens.push({ type: 'RPAREN', value: char });
            i++;
        } else {
            throw new Error(`未知符號：${char}`);
        }
    }
    
    return tokens;
}

function parseExpression(tokens) {
    let index = 0;
    
    function peek() {
        return tokens[index];
    }
    
    function consume() {
        return tokens[index++];
    }
    
    function parseAddSub() {
        let left = parseMulDiv();
        
        while (peek() && peek().type === 'OPERATOR' && (peek().value === '+' || peek().value === '-')) {
            const op = consume().value;
            const right = parseMulDiv();
            left = op === '+' ? left + right : left - right;
        }
        
        return left;
    }
    
    function parseMulDiv() {
        let left = parsePower();
        
        while (peek() && peek().type === 'OPERATOR' && (peek().value === '*' || peek().value === '/')) {
            const op = consume().value;
            const right = parsePower();
            if (op === '*') {
                left = left * right;
            } else {
                if (right === 0) throw new Error('除以零');
                left = left / right;
            }
        }
        
        return left;
    }
    
    function parsePower() {
        let left = parseUnary();
        
        if (peek() && peek().type === 'OPERATOR' && peek().value === '^') {
            consume(); // consume '^'
            const right = parsePower(); // right-associative
            left = Math.pow(left, right);
        }
        
        return left;
    }
    
    function parseUnary() {
        if (peek() && peek().type === 'OPERATOR' && (peek().value === '+' || peek().value === '-')) {
            const op = consume().value;
            const value = parseUnary();
            return op === '+' ? value : -value;
        }
        
        return parseFactor();
    }
    
    function parseFactor() {
        if (!peek()) {
            throw new Error('意外的表達式結束');
        }
        
        const token = peek();
        
        if (token.type === 'NUMBER') {
            return consume().value;
        }
        
        if (token.type === 'FUNCTION') {
            const funcName = consume().value;
            
            if (!peek() || peek().type !== 'LPAREN') {
                throw new Error(`函數 ${funcName} 需要括號`);
            }
            
            consume(); // consume '('
            const arg = parseAddSub();
            
            if (!peek() || peek().type !== 'RPAREN') {
                throw new Error('缺少右括號');
            }
            
            consume(); // consume ')'
            
            return evaluateFunction(funcName, arg);
        }
        
        if (token.type === 'LPAREN') {
            consume(); // consume '('
            const result = parseAddSub();
            
            if (!peek() || peek().type !== 'RPAREN') {
                throw new Error('缺少右括號');
            }
            
            consume(); // consume ')'
            return result;
        }
        
        throw new Error(`意外的符號：${token.value}`);
    }
    
    const result = parseAddSub();
    
    if (peek()) {
        throw new Error(`意外的符號：${peek().value}`);
    }
    
    return result;
}

function evaluateFunction(funcName, arg) {
    switch (funcName) {
        case 'sin':
            return Math.sin(angleMode === 'DEG' ? arg * Math.PI / 180 : arg);
        case 'cos':
            return Math.cos(angleMode === 'DEG' ? arg * Math.PI / 180 : arg);
        case 'tan':
            return Math.tan(angleMode === 'DEG' ? arg * Math.PI / 180 : arg);
        case 'asin':
            const asinResult = Math.asin(arg);
            return angleMode === 'DEG' ? asinResult * 180 / Math.PI : asinResult;
        case 'acos':
            const acosResult = Math.acos(arg);
            return angleMode === 'DEG' ? acosResult * 180 / Math.PI : acosResult;
        case 'atan':
            const atanResult = Math.atan(arg);
            return angleMode === 'DEG' ? atanResult * 180 / Math.PI : atanResult;
        case 'log':
            if (arg <= 0) throw new Error('對數的參數必須大於0');
            return Math.log10(arg);
        case 'ln':
            if (arg <= 0) throw new Error('自然對數的參數必須大於0');
            return Math.log(arg);
        case 'exp':
            return Math.exp(arg);
        case 'sqrt':
            if (arg < 0) throw new Error('平方根的參數不能為負數');
            return Math.sqrt(arg);
        default:
            throw new Error(`未知函數：${funcName}`);
    }
}

function formatCalculatorResult(num) {
    if (Number.isInteger(num)) {
        return num.toString();
    }
    
    // Check for very small numbers (close to zero)
    if (Math.abs(num) < 1e-10) {
        return '0';
    }
    
    // Check for very large or very small numbers
    if (Math.abs(num) > 1e10 || Math.abs(num) < 1e-4) {
        return num.toExponential(6);
    }
    
    return num.toFixed(10).replace(/\.?0+$/, '');
}

// Quadratic Equation Solver
function solveQuadratic() {
    const a = parseFloat(document.getElementById('quad-a').value);
    const b = parseFloat(document.getElementById('quad-b').value) || 0;
    const c = parseFloat(document.getElementById('quad-c').value) || 0;
    
    const resultDiv = document.getElementById('quad-result');
    const outputDiv = document.getElementById('quad-output');
    
    // Validation
    if (isNaN(a) || a === 0) {
        outputDiv.innerHTML = '<div class="error-message">錯誤：係數 a 不能為 0 或空白！</div>';
        resultDiv.classList.remove('hidden');
        return;
    }
    
    // Calculate discriminant
    const discriminant = b * b - 4 * a * c;
    
    let html = '<div class="result-item">';
    html += '<div class="result-label">方程式</div>';
    html += `<div class="result-value">${formatCoefficient(a)}x² ${formatTerm(b)}x ${formatTerm(c, true)} = 0</div>`;
    html += '</div>';
    
    html += '<div class="result-item">';
    html += '<div class="result-label">判別式 Δ</div>';
    html += `<div class="result-value">Δ = b² - 4ac = (${b})² - 4(${a})(${c}) = ${discriminant}</div>`;
    html += '</div>';
    
    html += '<div class="result-item">';
    html += '<div class="result-label">根的性質</div>';
    
    if (discriminant > 0) {
        html += '<div class="result-value discriminant-positive">Δ > 0：兩個不同實根</div>';
        html += '</div>';
        
        const sqrt_discriminant = Math.sqrt(discriminant);
        const x1 = (-b + sqrt_discriminant) / (2 * a);
        const x2 = (-b - sqrt_discriminant) / (2 * a);
        
        html += '<div class="result-item">';
        html += '<div class="result-label">根的值</div>';
        html += '<div class="result-formula">';
        html += `x = (-b ± √Δ) / (2a) = (${-b} ± √${discriminant}) / ${2 * a}`;
        html += '</div>';
        html += `<div class="result-value">x₁ = ${formatNumber(x1)}</div>`;
        html += `<div class="result-value">x₂ = ${formatNumber(x2)}</div>`;
        html += '</div>';
        
    } else if (discriminant === 0) {
        html += '<div class="result-value discriminant-zero">Δ = 0：一個重根</div>';
        html += '</div>';
        
        const x = -b / (2 * a);
        
        html += '<div class="result-item">';
        html += '<div class="result-label">根的值</div>';
        html += '<div class="result-formula">';
        html += `x = -b / (2a) = ${-b} / ${2 * a}`;
        html += '</div>';
        html += `<div class="result-value">x = ${formatNumber(x)}</div>`;
        html += '</div>';
        
    } else {
        html += '<div class="result-value discriminant-negative">Δ < 0：兩個復數根</div>';
        html += '</div>';
        
        const realPart = -b / (2 * a);
        const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
        
        html += '<div class="result-item">';
        html += '<div class="result-label">復數根</div>';
        html += '<div class="result-formula">';
        html += `x = (-b ± i√|Δ|) / (2a) = (${-b} ± i√${-discriminant}) / ${2 * a}`;
        html += '</div>';
        html += `<div class="result-value">x₁ = ${formatNumber(realPart)} + ${formatNumber(imaginaryPart)}i</div>`;
        html += `<div class="result-value">x₂ = ${formatNumber(realPart)} - ${formatNumber(imaginaryPart)}i</div>`;
        html += '</div>';
    }
    
    outputDiv.innerHTML = html;
    resultDiv.classList.remove('hidden');
}

// Linear System Solver with Fraction Support
function solveLinear() {
    const resultDiv = document.getElementById('linear-result');
    const outputDiv = document.getElementById('linear-output');
    
    try {
        // Parse all coefficients using fraction parser
        const a = parseFraction(document.getElementById('linear-a').value);
        const b = parseFraction(document.getElementById('linear-b').value);
        const c = parseFraction(document.getElementById('linear-c').value);
        const d = parseFraction(document.getElementById('linear-d').value);
        const e = parseFraction(document.getElementById('linear-e').value);
        const f = parseFraction(document.getElementById('linear-f').value);
        
        // Calculate determinant
        const determinant = a * e - b * d;
        
        let html = '<div class="result-item">';
        html += '<div class="result-label">輸入解析</div>';
        html += '<div class="fraction-inputs">';
        html += `<div class="fraction-display">a = ${document.getElementById('linear-a').value} → ${formatNumberWithFraction(a)}</div>`;
        html += `<div class="fraction-display">b = ${document.getElementById('linear-b').value} → ${formatNumberWithFraction(b)}</div>`;
        html += `<div class="fraction-display">c = ${document.getElementById('linear-c').value} → ${formatNumberWithFraction(c)}</div>`;
        html += `<div class="fraction-display">d = ${document.getElementById('linear-d').value} → ${formatNumberWithFraction(d)}</div>`;
        html += `<div class="fraction-display">e = ${document.getElementById('linear-e').value} → ${formatNumberWithFraction(e)}</div>`;
        html += `<div class="fraction-display">f = ${document.getElementById('linear-f').value} → ${formatNumberWithFraction(f)}</div>`;
        html += '</div>';
        html += '</div>';
        
        html += '<div class="result-item">';
        html += '<div class="result-label">方程組</div>';
        html += `<div class="result-value">${formatCoefficient(a)}x ${formatTerm(b)}y ${formatTerm(c, true)} = 0</div>`;
        html += `<div class="result-value">${formatCoefficient(d)}x ${formatTerm(e)}y ${formatTerm(f, true)} = 0</div>`;
        html += '</div>';
        
        html += '<div class="result-item">';
        html += '<div class="result-label">行列式 D</div>';
        html += `<div class="result-value">D = ae - bd = (${formatNumberWithFraction(a)})(${formatNumberWithFraction(e)}) - (${formatNumberWithFraction(b)})(${formatNumberWithFraction(d)}) = ${formatNumberWithFraction(determinant)}</div>`;
        html += '</div>';
        
        if (Math.abs(determinant) > 1e-10) {
            // Unique solution using Cramer's rule
            const x = -(c * e - b * f) / determinant;
            const y = -(a * f - c * d) / determinant;
            
            html += '<div class="result-item">';
            html += '<div class="result-label">解的情況</div>';
            html += '<div class="result-value discriminant-positive">D ≠ 0：唯一解</div>';
            html += '</div>';
            
            html += '<div class="result-item">';
            html += '<div class="result-label">解（分數形式）</div>';
            const xFrac = decimalToFraction(x);
            const yFrac = decimalToFraction(y);
            if (xFrac && yFrac) {
                html += `<div class="result-value">x = ${xFrac.numerator}/${xFrac.denominator}</div>`;
                html += `<div class="result-value">y = ${yFrac.numerator}/${yFrac.denominator}</div>`;
            } else {
                html += `<div class="result-value">x ≈ ${formatNumber(x)}</div>`;
                html += `<div class="result-value">y ≈ ${formatNumber(y)}</div>`;
            }
            html += '</div>';
            
            html += '<div class="result-item">';
            html += '<div class="result-label">解（小數形式）</div>';
            html += `<div class="result-value">x = ${formatNumber(x)}</div>`;
            html += `<div class="result-value">y = ${formatNumber(y)}</div>`;
            html += '</div>';
            
        } else {
            // Check if the system is inconsistent or has infinitely many solutions
            const isConsistent = checkSystemConsistency(a, b, c, d, e, f);
            
            html += '<div class="result-item">';
            html += '<div class="result-label">解的情況</div>';
            if (isConsistent) {
                html += '<div class="result-value discriminant-zero">D = 0：無窮多解（兩個方程式等價）</div>';
            } else {
                html += '<div class="result-value discriminant-negative">D = 0：無解（兩個方程式矛盾）</div>';
            }
            html += '</div>';
        }
        
        outputDiv.innerHTML = html;
        
    } catch (error) {
        outputDiv.innerHTML = `<div class="error-message">錯誤：${error.message}</div>`;
    }
    
    resultDiv.classList.remove('hidden');
}

function checkSystemConsistency(a, b, c, d, e, f) {
    // Check if the two equations are proportional
    const tolerance = 1e-10;
    
    // All coefficients are zero
    if (Math.abs(a) < tolerance && Math.abs(b) < tolerance && Math.abs(c) < tolerance &&
        Math.abs(d) < tolerance && Math.abs(e) < tolerance && Math.abs(f) < tolerance) {
        return true;
    }
    
    // Find non-zero coefficient to use as reference
    let reference = null;
    let refIndex = -1;
    const coeffs1 = [a, b, c];
    const coeffs2 = [d, e, f];
    
    for (let i = 0; i < 3; i++) {
        if (Math.abs(coeffs1[i]) > tolerance) {
            reference = coeffs1[i];
            refIndex = i;
            break;
        }
    }
    
    if (reference === null) {
        // First equation is all zeros, check second
        for (let i = 0; i < 3; i++) {
            if (Math.abs(coeffs2[i]) > tolerance) {
                return false; // Inconsistent
            }
        }
        return true;
    }
    
    // Check if second equation is proportional to first
    if (Math.abs(coeffs2[refIndex]) < tolerance) {
        return false;
    }
    
    const ratio = coeffs2[refIndex] / reference;
    
    for (let i = 0; i < 3; i++) {
        const expected = coeffs1[i] * ratio;
        if (Math.abs(coeffs2[i] - expected) > tolerance) {
            return false;
        }
    }
    
    return true;
}

function formatNumberWithFraction(num) {
    if (Math.abs(num) < 1e-10) return '0';
    
    const frac = decimalToFraction(num);
    if (frac && frac.denominator !== 1) {
        return `${frac.numerator}/${frac.denominator} (${formatNumber(num)})`;
    }
    return formatNumber(num);
}

// Radical Simplification
function simplifyRadical() {
    const n = parseInt(document.getElementById('radical-n').value);
    
    const resultDiv = document.getElementById('radical-result');
    const outputDiv = document.getElementById('radical-output');
    
    // Validation
    if (isNaN(n) || n <= 0) {
        outputDiv.innerHTML = '<div class="error-message">錯誤：請輸入正整數！</div>';
        resultDiv.classList.remove('hidden');
        return;
    }
    
    const result = simplifySquareRoot(n);
    
    let html = '<div class="result-item">';
    html += '<div class="result-label">原始表達式</div>';
    html += `<div class="result-value">√${n}</div>`;
    html += '</div>';
    
    if (result.coefficient === 1 && result.radicand === n) {
        html += '<div class="result-item">';
        html += '<div class="result-label">化簡結果</div>';
        html += `<div class="result-value">√${n}（已是最簡形式）</div>`;
        html += '</div>';
    } else {
        html += '<div class="result-item">';
        html += '<div class="result-label">化簡結果</div>';
        if (result.radicand === 1) {
            html += `<div class="result-value">${result.coefficient}</div>`;
        } else if (result.coefficient === 1) {
            html += `<div class="result-value">√${result.radicand}</div>`;
        } else {
            html += `<div class="result-value">${result.coefficient}√${result.radicand}</div>`;
        }
        html += '</div>';
        
        html += '<div class="solution-steps">';
        html += '<h4>化簡步驟</h4>';
        
        // Show factorization steps
        const factors = getFactorization(n);
        html += `<div class="step">1. 質因數分解：${n} = ${factors.join(' × ')}</div>`;
        
        if (result.perfectSquares.length > 0) {
            html += `<div class="step">2. 找出完全平方因子：${result.perfectSquares.join(' × ')} = ${result.coefficient}²</div>`;
            html += `<div class="step">3. 提取完全平方因子：√${n} = √(${result.coefficient}² × ${result.radicand}) = ${result.coefficient}√${result.radicand}</div>`;
        } else {
            html += `<div class="step">2. 沒有完全平方因子可以提取</div>`;
        }
        
        html += '</div>';
    }
    
    outputDiv.innerHTML = html;
    resultDiv.classList.remove('hidden');
}

// Helper Functions
function formatCoefficient(coeff) {
    if (coeff === 1) return '';
    if (coeff === -1) return '-';
    return formatNumber(coeff);
}

function formatTerm(coeff, isConstant = false) {
    if (Math.abs(coeff) < 1e-10) return '';
    if (coeff > 0) {
        if (isConstant) {
            return '+ ' + formatNumber(coeff);
        }
        return coeff === 1 ? '+' : '+ ' + formatNumber(coeff);
    } else {
        if (isConstant) {
            return '- ' + formatNumber(-coeff);
        }
        return coeff === -1 ? '-' : '- ' + formatNumber(-coeff);
    }
}

function formatNumber(num) {
    if (Math.abs(num) < 1e-10) return '0';
    
    if (Number.isInteger(num)) {
        return num.toString();
    }
    
    return num.toFixed(10).replace(/\.?0+$/, '');
}

function simplifySquareRoot(n) {
    let coefficient = 1;
    let radicand = n;
    let perfectSquares = [];
    
    // Find all perfect square factors
    for (let i = 2; i * i <= radicand; i++) {
        while (radicand % (i * i) === 0) {
            coefficient *= i;
            radicand /= (i * i);
            perfectSquares.push(i * i);
        }
    }
    
    return {
        coefficient: coefficient,
        radicand: radicand,
        perfectSquares: perfectSquares
    };
}

function getFactorization(n) {
    const factors = [];
    let temp = n;
    
    for (let i = 2; i <= temp; i++) {
        while (temp % i === 0) {
            factors.push(i);
            temp /= i;
        }
    }
    
    return factors.length > 0 ? factors : [n];
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Show main menu by default
    showPage('main-menu');
    
    // Add enter key support for inputs
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const page = input.closest('.page');
                if (page.id === 'quadratic') {
                    solveQuadratic();
                } else if (page.id === 'radical') {
                    simplifyRadical();
                }
            }
        });
    });
    
    // Add enter key support for text inputs (fraction inputs)
    const textInputs = document.querySelectorAll('.fraction-input');
    textInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const page = input.closest('.page');
                if (page.id === 'linear') {
                    solveLinear();
                }
            }
        });
    });
});