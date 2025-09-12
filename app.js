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

// Fraction conversion function using continued fractions
function decimalToFraction(decimal, tolerance = 1e-10) {
    if (decimal === 0) return "0";
    if (Math.abs(decimal - Math.round(decimal)) < tolerance) {
        return Math.round(decimal).toString();
    }
    
    let sign = decimal < 0 ? "-" : "";
    decimal = Math.abs(decimal);
    
    // Continued fraction algorithm
    let h1 = 1, h2 = 0;
    let k1 = 0, k2 = 1;
    let b = decimal;
    
    do {
        let a = Math.floor(b);
        let aux = h1;
        h1 = a * h1 + h2;
        h2 = aux;
        aux = k1;
        k1 = a * k1 + k2;
        k2 = aux;
        b = 1 / (b - a);
    } while (Math.abs(decimal - h1 / k1) > tolerance && k1 <= 10000);
    
    return sign + h1 + "/" + k1;
}

function displayCalculatorResult(result) {
    // Display decimal result
    let displayText = result.toString();
    
    // If it's a rational number, also display as improper fraction
    if (isFinite(result) && !Number.isInteger(result)) {
        try {
            let fraction = decimalToFraction(result);
            if (fraction && !fraction.includes("e") && fraction.includes("/")) {
                displayText += ` = ${fraction}`;
            }
        } catch (e) {
            // If conversion fails, only show decimal
        }
    }
    
    return displayText;
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

function backspaceAtCursor() {
    const display = document.getElementById('calc-display');
    const cursorPos = display.selectionStart;
    
    if (cursorPos > 0) {
        currentExpression = currentExpression.slice(0, cursorPos - 1) + currentExpression.slice(cursorPos);
        updateDisplay();
        // Restore cursor position
        setTimeout(() => {
            display.selectionStart = display.selectionEnd = cursorPos - 1;
        }, 0);
    }
}

function insertAtCursor(text) {
    const display = document.getElementById('calc-display');
    const cursorPos = display.selectionStart || currentExpression.length;
    
    currentExpression = currentExpression.slice(0, cursorPos) + text + currentExpression.slice(cursorPos);
    updateDisplay();
    
    // Restore cursor position
    const newPos = cursorPos + text.length;
    setTimeout(() => {
        display.selectionStart = display.selectionEnd = newPos;
    }, 0);
}

function calculateResult() {
    if (!currentExpression) return;
    
    try {
        const result = evaluateExpression(currentExpression);
        document.getElementById('calc-output').textContent = displayCalculatorResult(result);
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

// Cubic Equation Solver
function solveCubic() {
    const a = parseFloat(document.getElementById('cubic-a').value);
    const b = parseFloat(document.getElementById('cubic-b').value) || 0;
    const c = parseFloat(document.getElementById('cubic-c').value) || 0;
    const d = parseFloat(document.getElementById('cubic-d').value) || 0;
    
    const resultDiv = document.getElementById('cubic-result');
    const outputDiv = document.getElementById('cubic-output');
    
    // Validation
    if (isNaN(a) || a === 0) {
        outputDiv.innerHTML = '<div class="error-message">錯誤：係數 a 不能為 0 或空白！</div>';
        resultDiv.classList.remove('hidden');
        return;
    }
    
    try {
        const result = solveCubicEquation(a, b, c, d);
        
        let html = '<div class="result-item">';
        html += '<div class="result-label">方程式</div>';
        html += `<div class="result-value">${formatCoefficient(a)}x³ ${formatTerm(b)}x² ${formatTerm(c)}x ${formatTerm(d, true)} = 0</div>`;
        html += '</div>';
        
        html += '<div class="result-item">';
        html += '<div class="result-label">判別式 Δ</div>';
        html += `<div class="result-value">Δ = ${formatNumber(result.discriminant)}</div>`;
        html += '</div>';
        
        html += '<div class="result-item">';
        html += '<div class="result-label">根的性質</div>';
        html += `<div class="result-value ${getRootNatureClass(result.discriminant)}">${result.nature}</div>`;
        html += '</div>';
        
        html += '<div class="result-item">';
        html += '<div class="result-label">根的值</div>';
        
        result.roots.forEach((root, index) => {
            if (typeof root === 'number') {
                html += `<div class="result-value">x${index + 1} = ${formatNumber(root)}</div>`;
            } else {
                html += `<div class="result-value complex-root">x${index + 1} = ${formatNumber(root.real)} + ${formatNumber(root.imag)}i</div>`;
            }
        });
        
        html += '</div>';
        
        outputDiv.innerHTML = html;
        resultDiv.classList.remove('hidden');
        
    } catch (error) {
        outputDiv.innerHTML = `<div class="error-message">錯誤：${error.message}</div>`;
        resultDiv.classList.remove('hidden');
    }
}

function solveCubicEquation(a, b, c, d) {
    if (a === 0) throw new Error('係數 a 不能為零');
    
    // Normalize to x³ + px² + qx + r = 0
    let p = b / a;
    let q = c / a;
    let r = d / a;
    
    // Convert to depressed cubic: t³ + At + B = 0
    // t = x + p/3
    let A = q - (p * p) / 3;
    let B = (2 * p * p * p - 9 * p * q + 27 * r) / 27;
    
    // Calculate discriminant
    let discriminant = -4 * A * A * A - 27 * B * B;
    
    let roots = [];
    
    if (Math.abs(discriminant) < 1e-10) {
        // Discriminant = 0: repeated roots
        if (Math.abs(A) < 1e-10) {
            // A = 0: triple root
            let root = -p / 3;
            roots.push(root);
            roots.push(root);
            roots.push(root);
        } else {
            // One single root and one double root
            let t1 = 3 * B / A;
            let t2 = -3 * B / (2 * A);
            roots.push(t1 - p / 3);
            roots.push(t2 - p / 3);
            roots.push(t2 - p / 3);
        }
    } else if (discriminant > 0) {
        // Discriminant > 0: three different real roots (trigonometric method)
        let m = 2 * Math.sqrt(-A / 3);
        let theta = Math.acos(3 * B / (A * m)) / 3;
        
        for (let k = 0; k < 3; k++) {
            let t = m * Math.cos(theta - (2 * Math.PI * k) / 3);
            roots.push(t - p / 3);
        }
    } else {
        // Discriminant < 0: one real root, two complex roots (Cardano's formula)
        let u = Math.cbrt((-B + Math.sqrt(-discriminant / 108)) / 2);
        let v = Math.cbrt((-B - Math.sqrt(-discriminant / 108)) / 2);
        
        // Real root
        let realRoot = u + v - p / 3;
        roots.push(realRoot);
        
        // Complex roots
        let realPart = -(u + v) / 2 - p / 3;
        let imagPart = (u - v) * Math.sqrt(3) / 2;
        roots.push({ real: realPart, imag: imagPart });
        roots.push({ real: realPart, imag: -imagPart });
    }
    
    return {
        roots: roots,
        discriminant: discriminant,
        nature: discriminant > 0 ? "三個不同實根" : 
                discriminant === 0 ? "重根" : "一個實根，兩個復根"
    };
}

function getRootNatureClass(discriminant) {
    if (discriminant > 0) return "root-nature-real3";
    if (discriminant === 0) return "root-nature-repeated";
    return "root-nature-real1";
}

// Polynomial Expansion
function expandPolynomial() {
    const input = document.getElementById('poly-input').value.trim();
    
    const resultDiv = document.getElementById('poly-result');
    const outputDiv = document.getElementById('poly-output');
    
    if (!input) {
        outputDiv.innerHTML = '<div class="error-message">錯誤：請輸入多項式表達式！</div>';
        resultDiv.classList.remove('hidden');
        return;
    }
    
    try {
        const result = expandPolynomialExpression(input);
        
        let html = '<div class="result-item">';
        html += '<div class="result-label">原始表達式</div>';
        html += `<div class="result-value poly-original">${input}</div>`;
        html += '</div>';
        
        html += '<div class="result-item">';
        html += '<div class="result-label">展開結果</div>';
        html += `<div class="result-value poly-expanded">${result}</div>`;
        html += '</div>';
        
        outputDiv.innerHTML = html;
        resultDiv.classList.remove('hidden');
        
    } catch (error) {
        outputDiv.innerHTML = `<div class="error-message">錯誤：${error.message}</div>`;
        resultDiv.classList.remove('hidden');
    }
}

function expandPolynomialExpression(expression) {
    try {
        // Remove spaces
        expression = expression.replace(/\s/g, '');
        
        // Handle power expressions like (x+1)^2
        expression = expandPowers(expression);
        
        // Handle multiplication of binomials
        expression = expandProducts(expression);
        
        return simplifyPolynomial(expression);
    } catch (error) {
        throw new Error('無法解析多項式表達式');
    }
}

function expandPowers(expression) {
    // Handle (polynomial)^n format
    const powerPattern = /\(([^)]+)\)\^(\d+)/g;
    
    return expression.replace(powerPattern, (match, poly, power) => {
        const n = parseInt(power);
        let result = poly;
        
        for (let i = 1; i < n; i++) {
            result = multiplyTwoPolynomials(result, poly);
        }
        
        return `(${result})`;
    });
}

function expandProducts(expression) {
    // Handle (a)(b) format repeatedly until no more expansions possible
    let hasChanges = true;
    
    while (hasChanges) {
        const original = expression;
        const productPattern = /\(([^)]+)\)\(([^)]+)\)/;
        
        if (productPattern.test(expression)) {
            expression = expression.replace(productPattern, (match, poly1, poly2) => {
                return `(${multiplyTwoPolynomials(poly1, poly2)})`;
            });
        } else {
            hasChanges = false;
        }
        
        if (expression === original) {
            hasChanges = false;
        }
    }
    
    // Remove outer parentheses if they exist
    if (expression.startsWith('(') && expression.endsWith(')')) {
        expression = expression.slice(1, -1);
    }
    
    return expression;
}

function multiplyTwoPolynomials(poly1, poly2) {
    const terms1 = parsePolynomialTerms(poly1);
    const terms2 = parsePolynomialTerms(poly2);
    
    const resultTerms = [];
    
    for (const term1 of terms1) {
        for (const term2 of terms2) {
            resultTerms.push({
                coeff: term1.coeff * term2.coeff,
                power: term1.power + term2.power
            });
        }
    }
    
    return formatPolynomial(combineTerms(resultTerms));
}

function parsePolynomialTerms(poly) {
    const terms = [];
    
    // Split by + and - while keeping the signs
    const parts = poly.split(/([+-])/).filter(part => part.trim() !== '');
    
    let currentCoeff = 1;
    
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i].trim();
        
        if (part === '+') {
            currentCoeff = 1;
            continue;
        } else if (part === '-') {
            currentCoeff = -1;
            continue;
        }
        
        let coeff = currentCoeff;
        let power = 0;
        
        if (part.includes('x')) {
            const xIndex = part.indexOf('x');
            
            // Get coefficient
            const coeffPart = part.substring(0, xIndex);
            if (coeffPart === '' || coeffPart === '+') {
                coeff = currentCoeff;
            } else if (coeffPart === '-') {
                coeff = -currentCoeff;
            } else {
                coeff = currentCoeff * parseFloat(coeffPart);
            }
            
            // Get power
            if (part.includes('^')) {
                power = parseInt(part.split('^')[1]);
            } else {
                power = 1;
            }
        } else {
            // Constant term
            coeff = currentCoeff * parseFloat(part);
            power = 0;
        }
        
        terms.push({ coeff, power });
        currentCoeff = 1; // Reset for next term
    }
    
    return terms;
}

function combineTerms(terms) {
    const combined = {};
    
    for (const term of terms) {
        if (combined[term.power]) {
            combined[term.power] += term.coeff;
        } else {
            combined[term.power] = term.coeff;
        }
    }
    
    return combined;
}

function formatPolynomial(combined) {
    const powers = Object.keys(combined).map(Number).sort((a, b) => b - a);
    let result = '';
    
    for (let i = 0; i < powers.length; i++) {
        const power = powers[i];
        const coeff = combined[power];
        
        if (Math.abs(coeff) < 1e-10) continue;
        
        // Add sign
        if (result && coeff > 0) {
            result += ' + ';
        } else if (coeff < 0) {
            result += result ? ' - ' : '-';
        }
        
        const absCoeff = Math.abs(coeff);
        
        // Add coefficient and variable
        if (power === 0) {
            result += absCoeff;
        } else if (power === 1) {
            if (absCoeff === 1) {
                result += 'x';
            } else {
                result += absCoeff + 'x';
            }
        } else {
            if (absCoeff === 1) {
                result += 'x^' + power;
            } else {
                result += absCoeff + 'x^' + power;
            }
        }
    }
    
    return result || '0';
}

function simplifyPolynomial(expression) {
    // This function would perform additional simplification if needed
    return expression;
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
    const inputs = document.querySelectorAll('input[type="number"], input[type="text"]');
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
                } else if (page.id === 'cubic') {
                    solveCubic();
                } else if (page.id === 'polynomial') {
                    expandPolynomial();
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
        insertAtCursor(key);
        e.preventDefault();
    } else if (['+', '-', '*', '/'].includes(key)) {
        insertAtCursor(key);
        e.preventDefault();
    } else if (key === '.') {
        insertAtCursor('.');
        e.preventDefault();
    } else if (key === '(' || key === ')') {
        insertAtCursor(key);
        e.preventDefault();
    } else if (key === 'Enter') {
        calculateResult();
        e.preventDefault();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearCalculator();
        e.preventDefault();
    } else if (key === 'Backspace') {
        backspaceAtCursor();
        e.preventDefault();
    }
}