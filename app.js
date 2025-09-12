// Math Calculator App JavaScript

// Global variables for scientific calculator
let currentExpression = '';
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

// Scientific Calculator Functions
function initScientificCalculator() {
    currentExpression = '';
    updateDisplay();
    document.getElementById('calc-result').classList.add('hidden');
}

function updateDisplay() {
    document.getElementById('calc-display').value = currentExpression;
}

function toggleAngleMode() {
    angleMode = angleMode === 'DEG' ? 'RAD' : 'DEG';
    document.getElementById('angle-mode-btn').textContent = angleMode;
}

function clearCalculator() {
    currentExpression = '';
    updateDisplay();
    document.getElementById('calc-result').classList.add('hidden');
}

function backspace() {
    currentExpression = currentExpression.slice(0, -1);
    updateDisplay();
}

function insertNumber(num) {
    currentExpression += num;
    updateDisplay();
}

function insertOperator(op) {
    if (currentExpression && !isOperator(currentExpression.slice(-1))) {
        currentExpression += op;
        updateDisplay();
    }
}

function insertFunction(func) {
    currentExpression += func;
    updateDisplay();
}

function insertConstant(constant) {
    currentExpression += constant;
    updateDisplay();
}

function isOperator(char) {
    return ['+', '-', '*', '/', '^'].includes(char);
}

function calculateResult() {
    if (!currentExpression) return;
    
    try {
        const result = evaluateExpression(currentExpression);
        document.getElementById('calc-output').textContent = formatCalculatorResult(result);
        document.getElementById('calc-result').classList.remove('hidden');
    } catch (error) {
        document.getElementById('calc-output').textContent = '錯誤：' + error.message;
        document.getElementById('calc-result').classList.remove('hidden');
    }
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

// Linear System Solver
function solveLinear() {
    const a = parseFloat(document.getElementById('linear-a').value);
    const b = parseFloat(document.getElementById('linear-b').value);
    const c = parseFloat(document.getElementById('linear-c').value);
    const d = parseFloat(document.getElementById('linear-d').value);
    const e = parseFloat(document.getElementById('linear-e').value);
    const f = parseFloat(document.getElementById('linear-f').value);
    
    const resultDiv = document.getElementById('linear-result');
    const outputDiv = document.getElementById('linear-output');
    
    // Validation
    if ([a, b, c, d, e, f].some(val => isNaN(val))) {
        outputDiv.innerHTML = '<div class="error-message">錯誤：請填入所有係數！</div>';
        resultDiv.classList.remove('hidden');
        return;
    }
    
    // Calculate determinant
    const determinant = a * e - b * d;
    
    let html = '<div class="result-item">';
    html += '<div class="result-label">方程組</div>';
    html += `<div class="result-value">${formatCoefficient(a)}x ${formatTerm(b)}y ${formatTerm(c, true)} = 0</div>`;
    html += `<div class="result-value">${formatCoefficient(d)}x ${formatTerm(e)}y ${formatTerm(f, true)} = 0</div>`;
    html += '</div>';
    
    html += '<div class="result-item">';
    html += '<div class="result-label">行列式 D</div>';
    html += `<div class="result-value">D = ae - bd = (${a})(${e}) - (${b})(${d}) = ${determinant}</div>`;
    html += '</div>';
    
    if (determinant !== 0) {
        // Unique solution using Cramer's rule
        const x = (c * e - b * f) / determinant;
        const y = (a * f - c * d) / determinant;
        
        html += '<div class="result-item">';
        html += '<div class="result-label">解的情況</div>';
        html += '<div class="result-value discriminant-positive">D ≠ 0：唯一解</div>';
        html += '</div>';
        
        html += '<div class="result-item">';
        html += '<div class="result-label">解</div>';
        html += '<div class="result-formula">';
        html += `x = (ce - bf) / D = (${c}×${e} - ${b}×${f}) / ${determinant}`;
        html += '</div>';
        html += '<div class="result-formula">';
        html += `y = (af - cd) / D = (${a}×${f} - ${c}×${d}) / ${determinant}`;
        html += '</div>';
        html += `<div class="result-value">x = ${formatNumber(x)}</div>`;
        html += `<div class="result-value">y = ${formatNumber(y)}</div>`;
        html += '</div>';
        
    } else {
        // Check if the system is inconsistent or has infinitely many solutions
        const ratio1 = (b !== 0) ? a / b : null;
        const ratio2 = (e !== 0) ? d / e : null;
        const ratio3 = (b !== 0) ? c / b : (e !== 0) ? f / e : null;
        
        let isConsistent = false;
        
        if (a === 0 && b === 0 && c === 0 && d === 0 && e === 0 && f === 0) {
            isConsistent = true;
        } else if (ratio1 !== null && ratio2 !== null && Math.abs(ratio1 - ratio2) < 1e-10) {
            if (ratio3 !== null && Math.abs(ratio1 - ratio3) < 1e-10) {
                isConsistent = true;
            }
        }
        
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
    resultDiv.classList.remove('hidden');
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
    if (coeff === 0) return '';
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
    if (Number.isInteger(num)) {
        return num.toString();
    }
    
    // Check if it's a simple fraction
    const tolerance = 1e-10;
    for (let denominator = 2; denominator <= 100; denominator++) {
        const numerator = Math.round(num * denominator);
        if (Math.abs(num - numerator / denominator) < tolerance) {
            if (numerator % denominator === 0) {
                return (numerator / denominator).toString();
            }
            return `${numerator}/${denominator}`;
        }
    }
    
    return num.toFixed(6).replace(/\.?0+$/, '');
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
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const page = input.closest('.page');
                if (page.id === 'quadratic') {
                    solveQuadratic();
                } else if (page.id === 'linear') {
                    solveLinear();
                } else if (page.id === 'radical') {
                    simplifyRadical();
                }
            }
        });
    });
    
    // Add keyboard support for scientific calculator
    document.addEventListener('keydown', function(e) {
        const currentPage = document.querySelector('.page.active');
        if (currentPage && currentPage.id === 'scientific') {
            handleCalculatorKeyboard(e);
        }
    });
});

function handleCalculatorKeyboard(e) {
    const key = e.key;
    
    if (/[0-9]/.test(key)) {
        insertNumber(key);
        e.preventDefault();
    } else if (['+', '-', '*', '/'].includes(key)) {
        insertOperator(key);
        e.preventDefault();
    } else if (key === '.') {
        insertNumber('.');
        e.preventDefault();
    } else if (key === '(' || key === ')') {
        insertFunction(key);
        e.preventDefault();
    } else if (key === 'Enter') {
        calculateResult();
        e.preventDefault();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearCalculator();
        e.preventDefault();
    } else if (key === 'Backspace') {
        backspace();
        e.preventDefault();
    }
}