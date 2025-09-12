// Enhanced Advanced Math Calculator App JavaScript

// Global variables for scientific calculator
let currentExpression = '';
let angleMode = 'DEG'; // DEG or RAD
const MATH_CONSTANTS = {
    pi: Math.PI,
    e: Math.E
};

// Multi-variable polynomial support
const SUPPORTED_VARIABLES = ['x', 'y', 'z', 'a', 'b', 'c', 'd', 'k', 't', 'u', 'v', 'w'];

// Page navigation - Fixed to work properly
function showPage(pageId) {
    console.log('Navigating to page:', pageId);
    
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        targetPage.style.display = 'block';
        console.log('Page shown successfully:', pageId);
    } else {
        console.error('Page not found:', pageId);
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
        section.style.display = 'none';
    });
}

// Enhanced Scientific Calculator Functions
function initScientificCalculator() {
    const display = document.getElementById('calc-display');
    if (display) {
        display.value = '';
    }
    const result = document.getElementById('calc-result');
    if (result) {
        result.classList.add('hidden');
        result.style.display = 'none';
    }
}

function toggleAngleMode() {
    angleMode = angleMode === 'DEG' ? 'RAD' : 'DEG';
    const btn = document.getElementById('angle-mode-btn');
    if (btn) {
        btn.textContent = angleMode;
    }
}

function clearCalculator() {
    const display = document.getElementById('calc-display');
    if (display) {
        display.value = '';
    }
    const result = document.getElementById('calc-result');
    if (result) {
        result.classList.add('hidden');
        result.style.display = 'none';
    }
}

function insertAtCursor(text) {
    const display = document.getElementById('calc-display');
    if (!display) return;
    
    const start = display.selectionStart;
    const end = display.selectionEnd;
    const value = display.value;
    
    display.value = value.substring(0, start) + text + value.substring(end);
    display.selectionStart = display.selectionEnd = start + text.length;
    display.focus();
}

function backspaceAtCursor() {
    const display = document.getElementById('calc-display');
    if (!display) return;
    
    const start = display.selectionStart;
    const end = display.selectionEnd;
    const value = display.value;
    
    if (start !== end) {
        display.value = value.substring(0, start) + value.substring(end);
        display.selectionStart = display.selectionEnd = start;
    } else if (start > 0) {
        display.value = value.substring(0, start - 1) + value.substring(start);
        display.selectionStart = display.selectionEnd = start - 1;
    }
    display.focus();
}

function calculateResult() {
    const display = document.getElementById('calc-display');
    if (!display) return;
    
    const expression = display.value;
    
    if (!expression.trim()) return;
    
    try {
        const result = evaluateExpression(expression);
        displayEnhancedCalculatorResult(result);
        const resultDiv = document.getElementById('calc-result');
        if (resultDiv) {
            resultDiv.classList.remove('hidden');
            resultDiv.style.display = 'block';
        }
    } catch (error) {
        const outputDiv = document.getElementById('calc-output');
        if (outputDiv) {
            outputDiv.innerHTML = '<div class="error-message">錯誤：' + error.message + '</div>';
        }
        const resultDiv = document.getElementById('calc-result');
        if (resultDiv) {
            resultDiv.classList.remove('hidden');
            resultDiv.style.display = 'block';
        }
    }
}

// Enhanced calculator result display with intelligent fraction detection
function displayEnhancedCalculatorResult(result) {
    const outputDiv = document.getElementById('calc-output');
    if (!outputDiv) return;
    
    if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
        outputDiv.innerHTML = '<div class="error-message">無效的計算結果</div>';
        return;
    }
    
    // Check if result is rational using enhanced detection
    if (isRationalNumber(result)) {
        const fraction = decimalToFraction(result);
        
        if (fraction.denominator === 1) {
            // Integer result
            outputDiv.innerHTML = `<div class="result-value">${result}</div>`;
        } else if (Math.abs(fraction.denominator) <= 1000) {
            // Rational number - show both decimal and fraction
            outputDiv.innerHTML = `
                <div class="fraction-result">
                    <div class="result-row">
                        <span class="result-type">小數結果</span>
                        <span class="result-value-fraction">${formatCalculatorResult(result)}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-type">分數形式</span>
                        <span class="result-value-fraction">${fraction.numerator}/${fraction.denominator}</span>
                    </div>
                </div>
            `;
        } else {
            // Rational but denominator too large
            outputDiv.innerHTML = `<div class="result-value">${formatCalculatorResult(result)}</div>`;
        }
    } else {
        // Irrational number - only show decimal
        outputDiv.innerHTML = `<div class="result-value">${formatCalculatorResult(result)}</div>`;
    }
}

// Enhanced rational number detection
function isRationalNumber(num, tolerance = 1e-12) {
    if (!isFinite(num) || isNaN(num)) return false;
    
    // Check if it's very close to an integer
    if (Math.abs(num - Math.round(num)) < tolerance) return true;
    
    // Use continued fractions for more accurate detection
    const fraction = decimalToFraction(num, tolerance);
    const reconstructed = fraction.numerator / fraction.denominator;
    
    return Math.abs(num - reconstructed) < tolerance && Math.abs(fraction.denominator) <= 10000;
}

// Enhanced Decimal to Fraction Conversion using Continued Fractions
function decimalToFraction(decimal, tolerance = 1e-12) {
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
    
    for (let i = 0; i < 100 && remainder > tolerance && q1 < 10000; i++) {
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

// Enhanced Quadratic Equation Solver with Factorization
function solveQuadraticEnhanced() {
    const a = parseFloat(document.getElementById('quad-a').value);
    const b = parseFloat(document.getElementById('quad-b').value) || 0;
    const c = parseFloat(document.getElementById('quad-c').value) || 0;
    
    const resultDiv = document.getElementById('quad-result');
    const outputDiv = document.getElementById('quad-output');
    
    if (!resultDiv || !outputDiv) {
        console.error('Result elements not found');
        return;
    }
    
    // Validation
    if (isNaN(a) || a === 0) {
        outputDiv.innerHTML = '<div class="error-message">錯誤：係數 a 不能為 0 或空白！</div>';
        resultDiv.classList.remove('hidden');
        resultDiv.style.display = 'block';
        return;
    }
    
    // Calculate discriminant
    const discriminant = b * b - 4 * a * c;
    
    let html = '<div class="result-item">';
    html += '<div class="result-label">方程式</div>';
    html += `<div class="result-value">${formatCoefficient(a)}x² ${formatTerm(b)}x ${formatTerm(c, true)} = 0</div>`;
    html += '</div>';
    
    // Try factorization first
    const factorization = factorQuadratic(a, b, c);
    if (factorization) {
        html += '<div class="factorization-section">';
        html += '<h4>因式分解</h4>';
        html += `<div class="factorization-result">${factorization}</div>`;
        html += '</div>';
    }
    
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
    resultDiv.style.display = 'block';
}

// Quadratic factorization function
function factorQuadratic(a, b, c) {
    const discriminant = b * b - 4 * a * c;
    
    if (discriminant < 0) return null; // No real roots
    
    const sqrtD = Math.sqrt(discriminant);
    
    // Check if discriminant is a perfect square
    if (!Number.isInteger(sqrtD)) return null;
    
    const root1 = (-b + sqrtD) / (2 * a);
    const root2 = (-b - sqrtD) / (2 * a);
    
    // Check if roots are rational numbers
    if (!isSimpleFraction(root1) || !isSimpleFraction(root2)) return null;
    
    return formatFactorizedForm(a, root1, root2);
}

function isSimpleFraction(num, tolerance = 1e-10) {
    if (Number.isInteger(num)) return true;
    
    // Check if it's a simple fraction
    for (let denom = 2; denom <= 20; denom++) {
        const numerator = num * denom;
        if (Math.abs(numerator - Math.round(numerator)) < tolerance) {
            return true;
        }
    }
    return false;
}

function formatFactorizedForm(a, root1, root2) {
    const formatRoot = (root) => {
        if (Number.isInteger(root)) {
            return root < 0 ? `+ ${-root}` : `- ${root}`;
        }
        // Handle fractions
        const frac = decimalToFraction(root);
        if (frac.denominator === 1) {
            return frac.numerator < 0 ? `+ ${-frac.numerator}` : `- ${frac.numerator}`;
        }
        return root < 0 ? `+ ${-root}` : `- ${root}`;
    };
    
    if (a === 1) {
        return `(x ${formatRoot(-root1)})(x ${formatRoot(-root2)})`;
    } else {
        return `${a}(x ${formatRoot(-root1)})(x ${formatRoot(-root2)})`;
    }
}

// Enhanced Cubic Equation Solver with Factorization
function solveCubicEnhanced() {
    const a = parseFloat(document.getElementById('cubic-a').value);
    const b = parseFloat(document.getElementById('cubic-b').value) || 0;
    const c = parseFloat(document.getElementById('cubic-c').value) || 0;
    const d = parseFloat(document.getElementById('cubic-d').value) || 0;
    
    const resultDiv = document.getElementById('cubic-result');
    const outputDiv = document.getElementById('cubic-output');
    
    if (!resultDiv || !outputDiv) {
        console.error('Cubic result elements not found');
        return;
    }
    
    // Validation
    if (isNaN(a) || a === 0) {
        outputDiv.innerHTML = '<div class="error-message">錯誤：係數 a 不能為 0 或空白！</div>';
        resultDiv.classList.remove('hidden');
        resultDiv.style.display = 'block';
        return;
    }
    
    let html = '<div class="result-item">';
    html += '<div class="result-label">方程式</div>';
    html += `<div class="result-value">${formatCoefficient(a)}x³ ${formatTerm(b)}x² ${formatTerm(c)}x ${formatTerm(d, true)} = 0</div>`;
    html += '</div>';
    
    // Try factorization first
    const factorization = factorCubic(a, b, c, d);
    if (factorization) {
        html += '<div class="factorization-section">';
        html += '<h4>因式分解</h4>';
        html += `<div class="factorization-result">${factorization}</div>`;
        html += '</div>';
    }
    
    // Calculate discriminant and solve
    const discriminant = calculateCubicDiscriminant(a, b, c, d);
    
    html += '<div class="result-item">';
    html += '<div class="result-label">判別式 Δ</div>';
    html += `<div class="result-value">Δ = ${discriminant.toFixed(6)}</div>`;
    html += '</div>';
    
    // Add simple root finding
    const roots = findCubicRoots(a, b, c, d);
    if (roots.length > 0) {
        html += '<div class="result-item">';
        html += '<div class="result-label">根的值</div>';
        roots.forEach((root, i) => {
            html += `<div class="result-value">x${i+1} = ${formatNumber(root)}</div>`;
        });
        html += '</div>';
    }
    
    outputDiv.innerHTML = html;
    resultDiv.classList.remove('hidden');
    resultDiv.style.display = 'block';
}

// Simplified cubic root finding
function findCubicRoots(a, b, c, d) {
    // Try some common integer roots first
    const possibleRoots = [-10, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 10];
    const roots = [];
    
    for (let root of possibleRoots) {
        const value = a * root * root * root + b * root * root + c * root + d;
        if (Math.abs(value) < 1e-10) {
            roots.push(root);
        }
    }
    
    return roots;
}

// Cubic factorization function
function factorCubic(a, b, c, d) {
    // Try to find integer roots using rational root theorem
    const possibleRoots = getRationalRoots(a, b, c, d);
    
    for (let root of possibleRoots.slice(0, 10)) { // Limit to first 10 candidates
        if (Math.abs(evaluatePolynomial([a, b, c, d], root)) < 1e-10) {
            // Found a root, perform synthetic division
            const quotient = syntheticDivision([a, b, c, d], root);
            if (quotient) {
                const quadraticPart = formatQuadratic(quotient[0], quotient[1], quotient[2]);
                return `(x ${root >= 0 ? '-' : '+'} ${Math.abs(root)})(${quadraticPart})`;
            }
        }
    }
    
    return null;
}

function getRationalRoots(a, b, c, d) {
    // Find all possible rational roots using p/q where p divides d and q divides a
    const pFactors = getFactors(Math.abs(d) || 1);
    const qFactors = getFactors(Math.abs(a));
    
    const roots = [];
    for (let p of pFactors.slice(0, 5)) { // Limit factors
        for (let q of qFactors.slice(0, 5)) {
            roots.push(p / q);
            roots.push(-p / q);
        }
    }
    
    return [...new Set(roots)].slice(0, 20); // Limit to 20 candidates
}

function getFactors(n) {
    if (n === 0) return [1];
    const factors = [1];
    for (let i = 2; i <= Math.min(Math.sqrt(Math.abs(n)), 10); i++) {
        if (n % i === 0) {
            factors.push(i);
            if (i !== n / i && n / i <= 10) {
                factors.push(n / i);
            }
        }
    }
    return factors;
}

function evaluatePolynomial(coeffs, x) {
    let result = 0;
    for (let i = 0; i < coeffs.length; i++) {
        result += coeffs[i] * Math.pow(x, coeffs.length - 1 - i);
    }
    return result;
}

function syntheticDivision(coeffs, root) {
    const result = [coeffs[0]];
    
    for (let i = 1; i < coeffs.length; i++) {
        result[i] = coeffs[i] + root * result[i - 1];
    }
    
    // Check if remainder is close to zero
    if (Math.abs(result[result.length - 1]) < 1e-10) {
        return result.slice(0, -1); // Return quotient without remainder
    }
    
    return null;
}

function formatQuadratic(a, b, c) {
    let result = '';
    
    if (a === 1) result += 'x²';
    else if (a === -1) result += '-x²';
    else result += `${a}x²`;
    
    if (b !== 0) {
        if (b > 0 && result) result += ' + ';
        else if (b < 0) result += ' - ';
        
        const absB = Math.abs(b);
        if (absB === 1) result += 'x';
        else result += `${absB}x`;
    }
    
    if (c !== 0) {
        if (c > 0 && result) result += ' + ';
        else if (c < 0) result += ' - ';
        result += Math.abs(c);
    }
    
    return result || '0';
}

// Multi-variable Polynomial Expander
function expandAdvancedPolynomial() {
    const input = document.getElementById('poly-input');
    if (!input) return;
    
    const inputValue = input.value.trim();
    
    if (!inputValue) {
        showError('polynomial', '請輸入多項式表達式！');
        return;
    }
    
    try {
        const result = parseAndExpandAdvancedPolynomial(inputValue);
        displayAdvancedPolynomialResult(inputValue, result);
    } catch (error) {
        showError('polynomial', '無效的多項式表達式：' + error.message);
    }
}

function parseAndExpandAdvancedPolynomial(input) {
    // Handle common patterns
    if (input.includes(')(')) {
        return expandMultipleBrackets(input);
    }
    
    // Handle single expressions
    return input;
}

function expandMultipleBrackets(input) {
    // Simple expansion for common cases like (x+a)(x+b)
    const pattern = /\(([^)]+)\)\(([^)]+)\)/;
    const match = input.match(pattern);
    
    if (match) {
        const expr1 = match[1];
        const expr2 = match[2];
        
        // Parse simple linear expressions
        const term1 = parseSimpleLinear(expr1);
        const term2 = parseSimpleLinear(expr2);
        
        if (term1 && term2) {
            return expandTwoTerms(term1, term2);
        }
    }
    
    return input + ' (展開功能正在開發中)';
}

function parseSimpleLinear(expr) {
    // Parse expressions like "x+1", "2x-3", "x+y", etc.
    expr = expr.replace(/\s/g, '');
    
    const result = { x: 0, y: 0, z: 0, constant: 0 };
    
    // Split by + and - operators
    const parts = expr.split(/([+-])/);
    let sign = 1;
    
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        
        if (part === '+') {
            sign = 1;
        } else if (part === '-') {
            sign = -1;
        } else if (part && part !== '') {
            if (part.includes('x')) {
                const coeff = part.replace('x', '') || '1';
                result.x = sign * (coeff === '' || coeff === '+' ? 1 : coeff === '-' ? -1 : parseFloat(coeff));
            } else if (part.includes('y')) {
                const coeff = part.replace('y', '') || '1';
                result.y = sign * (coeff === '' || coeff === '+' ? 1 : coeff === '-' ? -1 : parseFloat(coeff));
            } else if (part.includes('z')) {
                const coeff = part.replace('z', '') || '1';
                result.z = sign * (coeff === '' || coeff === '+' ? 1 : coeff === '-' ? -1 : parseFloat(coeff));
            } else {
                result.constant = sign * parseFloat(part);
            }
        }
    }
    
    return result;
}

function expandTwoTerms(term1, term2) {
    // (ax + by + c)(dx + ey + f) expansion
    let result = '';
    const terms = [];
    
    // x² terms
    if (term1.x !== 0 && term2.x !== 0) {
        const coeff = term1.x * term2.x;
        if (coeff !== 0) terms.push(formatTerm2(coeff, 'x²'));
    }
    
    // xy terms
    if (term1.x !== 0 && term2.y !== 0) {
        const coeff = term1.x * term2.y;
        if (coeff !== 0) terms.push(formatTerm2(coeff, 'xy'));
    }
    if (term1.y !== 0 && term2.x !== 0) {
        const coeff = term1.y * term2.x;
        if (coeff !== 0) terms.push(formatTerm2(coeff, 'xy'));
    }
    
    // y² terms
    if (term1.y !== 0 && term2.y !== 0) {
        const coeff = term1.y * term2.y;
        if (coeff !== 0) terms.push(formatTerm2(coeff, 'y²'));
    }
    
    // x terms
    if (term1.x !== 0 && term2.constant !== 0) {
        const coeff = term1.x * term2.constant;
        if (coeff !== 0) terms.push(formatTerm2(coeff, 'x'));
    }
    if (term1.constant !== 0 && term2.x !== 0) {
        const coeff = term1.constant * term2.x;
        if (coeff !== 0) terms.push(formatTerm2(coeff, 'x'));
    }
    
    // y terms
    if (term1.y !== 0 && term2.constant !== 0) {
        const coeff = term1.y * term2.constant;
        if (coeff !== 0) terms.push(formatTerm2(coeff, 'y'));
    }
    if (term1.constant !== 0 && term2.y !== 0) {
        const coeff = term1.constant * term2.y;
        if (coeff !== 0) terms.push(formatTerm2(coeff, 'y'));
    }
    
    // constant terms
    if (term1.constant !== 0 && term2.constant !== 0) {
        const coeff = term1.constant * term2.constant;
        if (coeff !== 0) terms.push(coeff.toString());
    }
    
    if (terms.length === 0) return '0';
    
    // Join terms with proper signs
    result = terms[0];
    for (let i = 1; i < terms.length; i++) {
        if (terms[i].startsWith('-')) {
            result += ' ' + terms[i];
        } else {
            result += ' + ' + terms[i];
        }
    }
    
    return result;
}

function formatTerm2(coeff, variable) {
    if (coeff === 1 && variable !== '') {
        return variable;
    } else if (coeff === -1 && variable !== '') {
        return '-' + variable;
    } else {
        return coeff + variable;
    }
}

function insertPolynomialExample(example) {
    const input = document.getElementById('poly-input');
    if (input) {
        input.value = example;
        input.focus();
    }
}

function displayAdvancedPolynomialResult(original, expanded) {
    const outputDiv = document.getElementById('poly-output');
    const resultDiv = document.getElementById('poly-result');
    
    if (!outputDiv || !resultDiv) return;
    
    let html = '<div class="polynomial-result">';
    html += '<div class="result-label">原始表達式</div>';
    html += `<div class="polynomial-original">${original}</div>`;
    html += '<div class="result-label">展開結果</div>';
    html += `<div class="polynomial-expanded">${expanded}</div>`;
    html += '</div>';
    
    // Add expansion steps if it's a simple case
    if (original.includes(')(')) {
        html += '<div class="expansion-steps">';
        html += '<h4>展開步驟</h4>';
        html += `<div class="expansion-step">1. 識別因子：${original}</div>`;
        html += `<div class="expansion-step">2. 應用分配律進行逐步展開</div>`;
        html += `<div class="expansion-step">3. 合併同類項得到最終結果</div>`;
        html += '</div>';
    }
    
    outputDiv.innerHTML = html;
    resultDiv.classList.remove('hidden');
    resultDiv.style.display = 'block';
}

// Keep existing functions for other calculators
function solveLinear() {
    const getValue = (id) => {
        const input = document.getElementById(id);
        if (!input || !input.value.trim()) return NaN;
        
        const value = input.value.trim();
        if (value.includes('/')) {
            const parts = value.split('/');
            if (parts.length === 2) {
                return parseFloat(parts[0]) / parseFloat(parts[1]);
            }
        }
        return parseFloat(value);
    };
    
    const a = getValue('linear-a');
    const b = getValue('linear-b');
    const c = getValue('linear-c');
    const d = getValue('linear-d');
    const e = getValue('linear-e');
    const f = getValue('linear-f');
    
    const resultDiv = document.getElementById('linear-result');
    const outputDiv = document.getElementById('linear-output');
    
    if (!resultDiv || !outputDiv) return;
    
    if ([a, b, c, d, e, f].some(val => isNaN(val))) {
        outputDiv.innerHTML = '<div class="error-message">錯誤：請填入所有係數！</div>';
        resultDiv.classList.remove('hidden');
        resultDiv.style.display = 'block';
        return;
    }
    
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
    
    if (Math.abs(determinant) > 1e-10) {
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
        html += '<div class="result-item">';
        html += '<div class="result-label">解的情況</div>';
        html += '<div class="result-value discriminant-negative">D = 0：無解或無窮多解</div>';
        html += '</div>';
    }
    
    outputDiv.innerHTML = html;
    resultDiv.classList.remove('hidden');
    resultDiv.style.display = 'block';
}

function simplifyRadical() {
    const input = document.getElementById('radical-n');
    if (!input) return;
    
    const n = parseInt(input.value);
    
    const resultDiv = document.getElementById('radical-result');
    const outputDiv = document.getElementById('radical-output');
    
    if (!resultDiv || !outputDiv) return;
    
    if (isNaN(n) || n <= 0) {
        outputDiv.innerHTML = '<div class="error-message">錯誤：請輸入正整數！</div>';
        resultDiv.classList.remove('hidden');
        resultDiv.style.display = 'block';
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
    resultDiv.style.display = 'block';
}

// Expression evaluation for scientific calculator
function evaluateExpression(expr) {
    expr = expr.replace(/pi/g, MATH_CONSTANTS.pi.toString());
    expr = expr.replace(/e(?![a-zA-Z])/g, MATH_CONSTANTS.e.toString());
    
    const tokens = tokenize(expr);
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
            let num = '';
            while (i < expr.length && (/\d/.test(expr[i]) || expr[i] === '.')) {
                num += expr[i];
                i++;
            }
            tokens.push({ type: 'NUMBER', value: parseFloat(num) });
        } else if (/[a-zA-Z]/.test(char)) {
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
            consume();
            const right = parsePower();
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
            
            consume();
            const arg = parseAddSub();
            
            if (!peek() || peek().type !== 'RPAREN') {
                throw new Error('缺少右括號');
            }
            
            consume();
            
            return evaluateFunction(funcName, arg);
        }
        
        if (token.type === 'LPAREN') {
            consume();
            const result = parseAddSub();
            
            if (!peek() || peek().type !== 'RPAREN') {
                throw new Error('缺少右括號');
            }
            
            consume();
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

// Helper functions
function calculateCubicDiscriminant(a, b, c, d) {
    return b*b*c*c - 4*a*c*c*c - 4*b*b*b*d - 27*a*a*d*d + 18*a*b*c*d;
}

function formatCalculatorResult(num) {
    if (Number.isInteger(num)) {
        return num.toString();
    }
    
    if (Math.abs(num) < 1e-10) {
        return '0';
    }
    
    if (Math.abs(num) > 1e10 || Math.abs(num) < 1e-4) {
        return num.toExponential(6);
    }
    
    return num.toFixed(10).replace(/\.?0+$/, '');
}

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

function showError(pageId, message) {
    const outputId = pageId === 'polynomial' ? 'poly-output' : `${pageId}-output`;
    const resultId = pageId === 'polynomial' ? 'poly-result' : `${pageId}-result`;
    
    const outputDiv = document.getElementById(outputId);
    const resultDiv = document.getElementById(resultId);
    
    if (outputDiv) {
        outputDiv.innerHTML = `<div class="error-message">${message}</div>`;
    }
    if (resultDiv) {
        resultDiv.classList.remove('hidden');
        resultDiv.style.display = 'block';
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    console.log('Enhanced Advanced Math Calculator App initialized');
    
    showPage('main-menu');
    
    // Add enter key support for inputs
    const inputs = document.querySelectorAll('input[type="number"], input[type="text"]');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const page = input.closest('.page');
                if (!page) return;
                
                switch (page.id) {
                    case 'quadratic':
                        solveQuadraticEnhanced();
                        break;
                    case 'linear':
                        solveLinear();
                        break;
                    case 'radical':
                        simplifyRadical();
                        break;
                    case 'cubic':
                        solveCubicEnhanced();
                        break;
                    case 'polynomial':
                        expandAdvancedPolynomial();
                        break;
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
    
    // Add cursor support for calculator display
    const calcDisplay = document.getElementById('calc-display');
    if (calcDisplay) {
        calcDisplay.addEventListener('click', function() {
            this.focus();
        });
    }
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
    }
}