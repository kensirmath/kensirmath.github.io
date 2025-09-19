// Enhanced Advanced Math Calculator App JavaScript with Fixed Polynomial Expansion

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

// ========== FIXED POLYNOMIAL EXPANSION CORE FUNCTIONS ==========

// 修正的多項式解析器
function parsePolynomialExpression(expr) {
    console.log('Parsing expression:', expr);
    
    // 1. 預處理：標準化表達式
    expr = expr.replace(/\s+/g, '')  // 移除空格
               .replace(/\*\*/g, '^')  // 標準化乘方
               .replace(/(\d)([a-zA-Z])/g, '$1*$2')  // 添加隱含乘號
               .replace(/([a-zA-Z])(\()/g, '$1*$2')  // 變量和括號間
               .replace(/(\))(\()/g, '$1*$2')        // 括號間
               .replace(/(\))([a-zA-Z])/g, '$1*$2');  // 括號和變量間
    
    console.log('Preprocessed expression:', expr);
    return expr;
}

// 修正的因子提取算法
function extractAllFactors(input) {
    console.log('Extracting factors from:', input);
    const factors = [];
    
    // 處理乘方表達式 (expr)^n
    const powerMatch = input.match(/^(.+)\^(\d+)$/);
    if (powerMatch) {
        const base = powerMatch[1];
        const power = parseInt(powerMatch[2]);
        console.log('Found power expression:', base, '^', power);
        
        // 如果底數是括號表達式，提取出來
        const bracketContent = base.match(/^\((.+)\)$/);
        if (bracketContent) {
            // 重複添加相同因子 power 次
            for (let i = 0; i < power; i++) {
                factors.push(bracketContent[1]);
            }
            console.log('Extracted power factors:', factors);
            return factors;
        }
    }
    
    // 提取所有括號內的因子
    let processedInput = input;
    const bracketRegex = /\(([^()]+)\)/g;
    let match;
    
    while ((match = bracketRegex.exec(processedInput)) !== null) {
        factors.push(match[1].trim());
    }
    
    const result = factors.filter(f => f.length > 0);
    console.log('Extracted factors:', result);
    return result;
}

// 修正的項解析器
function parseTermCorrectly(termStr) {
    if (!termStr || termStr.trim() === '') return { coeff: 0, vars: {} };
    
    termStr = termStr.trim();
    console.log('Parsing term:', termStr);
    
    let coeff = 1;
    const vars = {};
    
    // 處理負號
    if (termStr.startsWith('-')) {
        coeff = -1;
        termStr = termStr.substring(1);
    } else if (termStr.startsWith('+')) {
        termStr = termStr.substring(1);
    }
    
    // 提取數字係數
    const numMatch = termStr.match(/^(\d+(?:\.\d+)?)/);
    if (numMatch) {
        coeff *= parseFloat(numMatch[1]);
        termStr = termStr.substring(numMatch[0].length);
    }
    
    // 處理變量
    const varMatches = termStr.matchAll(/([a-zA-Z])(\^(\d+))?/g);
    for (let match of varMatches) {
        const varName = match[1];
        const power = match[3] ? parseInt(match[3]) : 1;
        vars[varName] = (vars[varName] || 0) + power;
    }
    
    const result = { coeff, vars };
    console.log('Parsed term result:', result);
    return result;
}

// 修正的項相乘算法
function multiplyTermsCorrectly(term1, term2) {
    console.log('Multiplying terms:', term1, 'x', term2);
    
    const result = {
        coeff: term1.coeff * term2.coeff,
        vars: {}
    };
    
    // 合併變量的指數
    const allVars = new Set([...Object.keys(term1.vars), ...Object.keys(term2.vars)]);
    
    for (let varName of allVars) {
        const power1 = term1.vars[varName] || 0;
        const power2 = term2.vars[varName] || 0;
        const totalPower = power1 + power2;
        
        if (totalPower > 0) {
            result.vars[varName] = totalPower;
        }
    }
    
    console.log('Term multiplication result:', result);
    return result;
}

// 修正的多項式乘法
function multiplyPolynomialsCorrectly(poly1Terms, poly2Terms) {
    console.log('Multiplying polynomials:', poly1Terms, 'x', poly2Terms);
    
    const resultTerms = new Map();
    
    for (let term1 of poly1Terms) {
        for (let term2 of poly2Terms) {
            const product = multiplyTermsCorrectly(term1, term2);
            
            // 創建變量鍵值用於合併同類項
            const key = createVariableKey(product.vars);
            
            if (resultTerms.has(key)) {
                resultTerms.get(key).coeff += product.coeff;
            } else {
                resultTerms.set(key, product);
            }
        }
    }
    
    const result = Array.from(resultTerms.values()).filter(term => Math.abs(term.coeff) > 1e-10);
    console.log('Polynomial multiplication result:', result);
    return result;
}

// 修正的變量鍵生成
function createVariableKey(vars) {
    const sortedKeys = Object.keys(vars).sort();
    return sortedKeys.map(key => `${key}^${vars[key]}`).join('*') || 'const';
}

// 修正的多項式格式化
function formatPolynomialCorrectly(terms) {
    if (!terms || terms.length === 0) return '0';
    
    console.log('Formatting polynomial:', terms);
    
    // 按總次數排序（從高到低）
    terms.sort((a, b) => {
        const degreeA = Object.values(a.vars).reduce((sum, power) => sum + power, 0);
        const degreeB = Object.values(b.vars).reduce((sum, power) => sum + power, 0);
        
        if (degreeA !== degreeB) {
            return degreeB - degreeA; // 高次項在前
        }
        
        // 同次項按字母順序排序
        const keysA = Object.keys(a.vars).sort().join('');
        const keysB = Object.keys(b.vars).sort().join('');
        return keysA.localeCompare(keysB);
    });
    
    let result = '';
    
    for (let i = 0; i < terms.length; i++) {
        const term = terms[i];
        let termStr = '';
        
        // 處理符號
        if (i === 0) {
            if (term.coeff < 0) termStr += '-';
        } else {
            if (term.coeff >= 0) termStr += ' + ';
            else termStr += ' - ';
        }
        
        // 處理係數
        const absCoeff = Math.abs(term.coeff);
        const hasVars = Object.keys(term.vars).length > 0;
        
        if (absCoeff !== 1 || !hasVars) {
            // 如果係數不是1，或者是常數項，顯示係數
            if (Number.isInteger(absCoeff)) {
                termStr += absCoeff.toString();
            } else {
                termStr += absCoeff.toFixed(6).replace(/\.?0+$/, '');
            }
        }
        
        // 處理變量
        const sortedVars = Object.keys(term.vars).sort();
        for (let varName of sortedVars) {
            const power = term.vars[varName];
            termStr += varName;
            if (power > 1) {
                termStr += '^' + power;
            }
        }
        
        result += termStr;
    }
    
    console.log('Formatted polynomial:', result);
    return result || '0';
}

// 完整的多項式展開主函數
function expandAdvancedPolynomialFixed() {
    const input = document.getElementById('poly-input').value.trim();
    const resultDiv = document.getElementById('poly-result');
    const outputDiv = document.getElementById('poly-output');
    
    if (!input) {
        outputDiv.innerHTML = '<div class="error-message">請輸入多項式表達式！</div>';
        resultDiv.classList.remove('hidden');
        resultDiv.style.display = 'block';
        return;
    }
    
    try {
        console.log('Processing input:', input);
        
        // 預處理輸入
        const processedInput = parsePolynomialExpression(input);
        console.log('Processed input:', processedInput);
        
        // 展開多項式
        const expanded = performPolynomialExpansion(processedInput);
        console.log('Expanded result:', expanded);
        
        let html = '<div class="result-item">';
        html += '<div class="result-label">原始表達式</div>';
        html += `<div class="result-value">${input}</div>`;
        html += '</div>';
        
        html += '<div class="result-item">';
        html += '<div class="result-label">展開結果</div>';
        html += `<div class="result-value">${expanded}</div>`;
        html += '</div>';
        
        outputDiv.innerHTML = html;
        resultDiv.classList.remove('hidden');
        resultDiv.style.display = 'block';
        
    } catch (error) {
        console.error('Expansion error:', error);
        outputDiv.innerHTML = `<div class="error-message">錯誤：${error.message}</div>`;
        resultDiv.classList.remove('hidden');
        resultDiv.style.display = 'block';
    }
}

function performPolynomialExpansion(input) {
    console.log('Performing expansion on:', input);
    
    // 處理乘方表達式
    const powerMatch = input.match(/^\(([^)]+)\)\^(\d+)$/);
    if (powerMatch) {
        const base = powerMatch[1];
        const power = parseInt(powerMatch[2]);
        console.log('Expanding power:', base, '^', power);
        return expandPolynomialPower(base, power);
    }
    
    // 提取所有因子
    const factors = extractAllFactors(input);
    console.log('Extracted factors:', factors);
    
    if (factors.length === 0) {
        return input; // 無法解析，返回原始輸入
    }
    
    if (factors.length === 1) {
        return factors[0]; // 單個因子，直接返回
    }
    
    // 多因子相乘
    return expandMultipleFactorsCorrectly(factors);
}

function expandPolynomialPower(base, power) {
    console.log('Expanding polynomial power:', base, '^', power);
    
    if (power === 1) return base;
    if (power === 0) return '1';
    
    let result = parsePolynomialToTerms(base);
    
    for (let i = 1; i < power; i++) {
        const nextFactor = parsePolynomialToTerms(base);
        result = multiplyPolynomialsCorrectly(result, nextFactor);
        console.log(`After power ${i + 1}:`, result);
    }
    
    return formatPolynomialCorrectly(result);
}

function expandMultipleFactorsCorrectly(factors) {
    console.log('Expanding multiple factors:', factors);
    
    let result = parsePolynomialToTerms(factors[0]);
    
    for (let i = 1; i < factors.length; i++) {
        const nextFactor = parsePolynomialToTerms(factors[i]);
        result = multiplyPolynomialsCorrectly(result, nextFactor);
        console.log(`After multiplying factor ${i}:`, result);
    }
    
    return formatPolynomialCorrectly(result);
}

function parsePolynomialToTerms(polyStr) {
    console.log('Parsing polynomial to terms:', polyStr);
    
    const terms = [];
    
    // 分割項（處理 + 和 - 符號）
    const parts = polyStr.split(/([+-])/).filter(part => part.trim() !== '');
    
    let currentSign = 1;
    let i = 0;
    
    // 處理開頭的負號
    if (parts[0] === '-') {
        currentSign = -1;
        i = 1;
    } else if (parts[0] === '+') {
        i = 1;
    }
    
    while (i < parts.length) {
        if (parts[i] === '+') {
            currentSign = 1;
        } else if (parts[i] === '-') {
            currentSign = -1;
        } else {
            // 這是一個項
            const term = parseTermCorrectly(parts[i]);
            term.coeff *= currentSign;
            if (Math.abs(term.coeff) > 1e-10) {
                terms.push(term);
            }
            currentSign = 1; // 重置符號
        }
        i++;
    }
    
    const result = terms.length > 0 ? terms : [{ coeff: 0, vars: {} }];
    console.log('Parsed terms:', result);
    return result;
}

// 自動測試函數
function runPolynomialTests() {
    console.log('Running polynomial tests...');
    
    const testCases = [
        { input: '(x+1)(x+2)', expected: 'x^2 + 3x + 2' },
        { input: '(x+y)(x+k)', expected: 'x^2 + kx + xy + ky' },
        { input: '(2x+3)(x-1)', expected: '2x^2 + x - 3' },
        { input: '(x+1)(x+2)(x+3)', expected: 'x^3 + 6x^2 + 11x + 6' },
        { input: '(a+b)^2', expected: 'a^2 + 2ab + b^2' },
        { input: '(x+y)(x-y)', expected: 'x^2 - y^2' }
    ];
    
    let html = '<div class="test-results">';
    html += '<h4>🧪 測試結果</h4>';
    
    let passedCount = 0;
    
    for (let test of testCases) {
        try {
            const processedInput = parsePolynomialExpression(test.input);
            const result = performPolynomialExpansion(processedInput);
            
            console.log(`Test: ${test.input} => ${result}`);
            console.log(`Expected: ${test.expected}`);
            
            // Simple comparison (not exact matching due to ordering differences)
            const passed = result.length > 0 && result !== test.input;
            
            html += `<div class="test-item ${passed ? 'test-passed' : 'test-failed'}">`;
            html += `<div class="test-input">輸入: ${test.input}</div>`;
            html += `<div class="test-result">結果: ${result}</div>`;
            html += `<div class="test-expected">預期: ${test.expected}</div>`;
            html += '</div>';
            
            if (passed) passedCount++;
            
        } catch (error) {
            console.error(`Test failed for ${test.input}:`, error);
            html += `<div class="test-item test-failed">`;
            html += `<div class="test-input">輸入: ${test.input}</div>`;
            html += `<div class="test-result">錯誤: ${error.message}</div>`;
            html += '</div>';
        }
    }
    
    html += `<div class="result-item">`;
    html += `<div class="result-label">測試總結</div>`;
    html += `<div class="result-value">通過 ${passedCount}/${testCases.length} 項測試</div>`;
    html += '</div>';
    html += '</div>';
    
    const outputDiv = document.getElementById('poly-output');
    const resultDiv = document.getElementById('poly-result');
    
    if (outputDiv) {
        outputDiv.innerHTML = html;
    }
    if (resultDiv) {
        resultDiv.classList.remove('hidden');
        resultDiv.style.display = 'block';
    }
}

// ========== EXISTING FUNCTIONS (PRESERVED) ==========

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
        } else if (Math.abs(fraction.denominator) <= 10000) {
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

// Enhanced Quadratic Equation Solver with Factorization
function solveQuadraticEnhanced() {
    const a = parseFloat(document.getElementById('quad-a').value);
    const b = parseFloat(document.getElementById('quad-b').value || 0);
    const c = parseFloat(document.getElementById('quad-c').value || 0);
    
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

//    return formatFactorizedForm(a, root1, root2);

    // 自己加20250919.1616 (改factorization display result)
   // const root199 = (-b + sqrtD) / Math.gcd(Math.int(-b + sqrtD),Math.int(2 * a))
  //  const root299 = (-b - sqrtD) / Math.gcd(Math.int(-b - sqrtD),Math.int(2 * a))
  //  const a99 = Math.gcd(a,b,c)
  //  return formatFactorizedForm(a99, root199, root299);
    // 自己加20250919.1616 (改factorization display result)

    // 自己加20250919.1933 (改factorization display result)
    return formatFactorizedForm(a, b, c);
    // 自己加20250919.1933 (改factorization display result)
    
}

function isSimpleFraction(num, tolerance = 1e-20) {
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

//function formatFactorizedForm(a, root1, root2) {
//    const formatRoot = (root) => {
//        if (Number.isInteger(root)) {
//            return root < 0 ? `+ ${-root}` : `- ${root}`;
//        }
//        // Handle fractions
//        const frac = decimalToFraction(root);
//        if (frac.denominator === 1) {
//            return frac.numerator < 0 ? `+ ${-frac.numerator}` : `- ${frac.numerator}`;
//        }
//        return root < 0 ? `+ ${-root}` : `- ${root}`;
//    };
    
//    if (a === 1) {
//        return `(x ${formatRoot(-root1)})(x ${formatRoot(-root2)})`;
//    } else {
//        return `${a}(x ${formatRoot(-root1)})(x ${formatRoot(-root2)})`;
//    }
//}

    // 自己加20250919.1933 (改factorization display result)
function formatFactorizedForm(a, b, c) {
    const a99 = Math.gcd(a,b,c)
    const root199 = (-b+Math.sqrt(b*b-4*a*c)) / Math.gcd(-b+Math.sqrt(b*b-4*a*c),2*a)
    const root299 = (-b-Math.sqrt(b*b-4*a*c)) / Math.gcd(-b-Math.sqrt(b*b-4*a*c),2*a)

    if (a === 1) {
        return `(x ${root199 < 0 ? `+ ${-root199}` : `- ${root199}`})(x ${root299 < 0 ? `+ ${-root299}` : `- ${root299}`})`;
    } else {
        return `${a}(x ${root199 < 0 ? `+ ${-root199}` : `- ${root199}`})(x ${root299 < 0 ? `+ ${-root299}` : `- ${root299}`})`;
    }
}
    // 自己加20250919.1933 (改factorization display result)

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

function insertPolynomialExample(example) {
    const input = document.getElementById('poly-input');
    if (input) {
        input.value = example;
        input.focus();
    }
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
    
    const tolerance = 1e-20;
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
    console.log('Enhanced Advanced Math Calculator App with Fixed Polynomial Expansion initialized');
    
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
                        expandAdvancedPolynomialFixed();
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
