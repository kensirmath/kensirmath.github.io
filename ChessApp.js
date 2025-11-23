// Chess pieces data
const chessPieces = [
    {
        name_en: "King",
        name_zh: "國王",
        symbol_white: "♔",
        symbol_black: "♚",
        value: "∞",
        moves_en: "One square in any direction",
        moves_zh: "可以向任何方向移動一格",
        special_en: "Castling allowed",
        special_zh: "可以進行易位"
    },
    {
        name_en: "Queen",
        name_zh: "皇后",
        symbol_white: "♕",
        symbol_black: "♛",
        value: "9",
        moves_en: "Any number of squares horizontally, vertically, or diagonally",
        moves_zh: "可以沿著直線、橫線或斜線移動任意數格",
        special_en: "Most powerful piece",
        special_zh: "最強大的棋子"
    },
    {
        name_en: "Rook",
        name_zh: "城堡",
        symbol_white: "♖",
        symbol_black: "♜",
        value: "5",
        moves_en: "Any number of squares horizontally or vertically",
        moves_zh: "可以沿著直線或橫線移動任意數格",
        special_en: "Used in castling",
        special_zh: "可用於進行易位"
    },
    {
        name_en: "Bishop",
        name_zh: "象",
        symbol_white: "♗",
        symbol_black: "♝",
        value: "3",
        moves_en: "Any number of squares diagonally",
        moves_zh: "可以沿著斜線移動任意數格",
        special_en: "Stays on same color squares",
        special_zh: "始終停留在同一顏色的格子上"
    },
    {
        name_en: "Knight",
        name_zh: "馬",
        symbol_white: "♘",
        symbol_black: "♞",
        value: "3",
        moves_en: "L-shaped: 2 squares in one direction, 1 square perpendicular",
        moves_zh: "L形移動：先向一方向移動2格，再垂直移動1格",
        special_en: "Can jump over pieces",
        special_zh: "可以跳過其他棋子"
    },
    {
        name_en: "Pawn",
        name_zh: "兵",
        symbol_white: "♙",
        symbol_black: "♟",
        value: "1",
        moves_en: "One square forward (two squares on first move)",
        moves_zh: "向前移動一格（初始位置可移動兩格）",
        special_en: "Promotes on last rank",
        special_zh: "到達最後一行時可升變為其他棋子"
    }
];

// Initialize navigation
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSection = btn.getAttribute('data-section');

            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            sections.forEach(section => {
                section.classList.remove('active');
            });

            document.getElementById(`${targetSection}-section`).classList.add('active');
        });
    });
}

// Render pieces section
function renderPieces() {
    const grid = document.getElementById('pieces-grid');

    chessPieces.forEach(piece => {
        const card = document.createElement('div');
        card.className = 'piece-card';
        card.innerHTML = `
            <div class="piece-header">
                <div class="piece-symbol">${piece.symbol_white}</div>
                <div class="piece-info">
                    <h3>${piece.name_zh} / ${piece.name_en}</h3>
                    <div class="piece-value">價值 / Value: ${piece.value}</div>
                </div>
            </div>
            <div class="piece-moves">
                <p>${piece.moves_zh}</p>
                <p>${piece.moves_en}</p>
            </div>
            <div class="piece-special">
                <p><strong>特殊：</strong>${piece.special_zh}</p>
                <p><strong>Special:</strong> ${piece.special_en}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Create chessboard
function createChessboard(elementId, showCoordinates = false) {
    const board = document.getElementById(elementId);
    board.innerHTML = '';

    for (let row = 7; row >= 0; row--) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = 'square';
            square.className += (row + col) % 2 === 0 ? ' light' : ' dark';
            square.dataset.row = row;
            square.dataset.col = col;

            if (showCoordinates && (row === 0 || col === 0)) {
                const coord = String.fromCharCode(97 + col) + (row + 1);
                square.textContent = coord;
                square.style.fontSize = '10px';
                square.style.color = '#666';
            }

            board.appendChild(square);
        }
    }
}

// Board notation
function initBoardNotation() {
    createChessboard('notation-board', true);
}

// Exercise 1: Move Knight
let exercise1State = {
    knightPos: { row: 0, col: 6 }, // g1
    targetPos: { row: 2, col: 5 }, // f3
    selectedSquare: null
};

function initExercise1() {
    createChessboard('exercise1-board');
    const board = document.getElementById('exercise1-board');
    const squares = board.querySelectorAll('.square');

    squares.forEach(square => {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);

        if (row === exercise1State.knightPos.row && col === exercise1State.knightPos.col) {
            square.textContent = '♘';
        }

        if (row === exercise1State.targetPos.row && col === exercise1State.targetPos.col) {
            square.style.border = '3px solid #32a852';
        }

        square.addEventListener('click', () => handleExercise1Click(row, col));
    });
}

function handleExercise1Click(row, col) {
    const board = document.getElementById('exercise1-board');
    const squares = board.querySelectorAll('.square');

    if (row === exercise1State.knightPos.row && col === exercise1State.knightPos.col) {
        // Select knight
        exercise1State.selectedSquare = { row, col };
        squares.forEach(sq => sq.classList.remove('selected', 'valid-move'));

        const selectedSq = Array.from(squares).find(sq =>
            parseInt(sq.dataset.row) === row && parseInt(sq.dataset.col) === col
        );
        selectedSq.classList.add('selected');

        // Show valid knight moves
        const validMoves = getKnightMoves(row, col);
        validMoves.forEach(move => {
            const moveSq = Array.from(squares).find(sq =>
                parseInt(sq.dataset.row) === move.row && parseInt(sq.dataset.col) === move.col
            );
            if (moveSq) moveSq.classList.add('valid-move');
        });
    } else if (exercise1State.selectedSquare) {
        // Try to move knight
        const validMoves = getKnightMoves(exercise1State.selectedSquare.row, exercise1State.selectedSquare.col);
        const isValid = validMoves.some(move => move.row === row && move.col === col);

        if (isValid) {
            const feedback = document.getElementById('exercise1-feedback');

            if (row === exercise1State.targetPos.row && col === exercise1State.targetPos.col) {
                // Correct!
                exercise1State.knightPos = { row, col };
                squares.forEach(sq => sq.textContent = '');
                const targetSq = Array.from(squares).find(sq =>
                    parseInt(sq.dataset.row) === row && parseInt(sq.dataset.col) === col
                );
                targetSq.textContent = '♘';

                feedback.className = 'exercise-feedback show correct';
                feedback.innerHTML = '<p>正確！馬已成功移動到f3！</p><p>Correct! The Knight moved to f3 successfully!</p>';
            } else {
                // Valid move but not target
                exercise1State.knightPos = { row, col };
                squares.forEach(sq => {
                    sq.textContent = '';
                    sq.classList.remove('selected', 'valid-move');
                });
                const newSq = Array.from(squares).find(sq =>
                    parseInt(sq.dataset.row) === row && parseInt(sq.dataset.col) === col
                );
                newSq.textContent = '♘';
                exercise1State.selectedSquare = null;

                feedback.className = 'exercise-feedback show incorrect';
                feedback.innerHTML = '<p>這是合法的走法，但不是目標位置。請試著移到f3！</p><p>Valid move, but not the target. Try moving to f3!</p>';
            }
        }
    }
}

function getKnightMoves(row, col) {
    const moves = [
        { row: row + 2, col: col + 1 },
        { row: row + 2, col: col - 1 },
        { row: row - 2, col: col + 1 },
        { row: row - 2, col: col - 1 },
        { row: row + 1, col: col + 2 },
        { row: row + 1, col: col - 2 },
        { row: row - 1, col: col + 2 },
        { row: row - 1, col: col - 2 }
    ];

    return moves.filter(move =>
        move.row >= 0 && move.row < 8 && move.col >= 0 && move.col < 8
    );
}

function resetExercise1() {
    exercise1State = {
        knightPos: { row: 0, col: 6 },
        targetPos: { row: 2, col: 5 },
        selectedSquare: null
    };
    document.getElementById('exercise1-feedback').className = 'exercise-feedback';
    initExercise1();
}

// Exercise 2: Best Opening Move
let exercise2State = {
    selectedOption: null,
    answered: false
};

const exercise2Options = [
    {
        move: 'e4',
        description_zh: '將兵移到中心',
        description_en: 'Move the pawn to the center',
        correct: true
    },
    {
        move: 'd4',
        description_zh: '將兵移到中心',
        description_en: 'Move the pawn to the center',
        correct: true
    },
    {
        move: 'a4',
        description_zh: '移動邊緣兵（不推薦）',
        description_en: 'Move the edge pawn (not recommended)',
        correct: false
    },
    {
        move: 'h4',
        description_zh: '移動邊緣兵（不推薦）',
        description_en: 'Move the edge pawn (not recommended)',
        correct: false
    }
];

function initExercise2() {
    const container = document.getElementById('exercise2-options');
    container.innerHTML = '';

    exercise2Options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `
            <div class="option-move">${option.move}</div>
            <div class="option-description">${option.description_zh} / ${option.description_en}</div>
        `;
        btn.addEventListener('click', () => handleExercise2Click(index));
        container.appendChild(btn);
    });
}

function handleExercise2Click(index) {
    if (exercise2State.answered) return;

    const option = exercise2Options[index];
    const buttons = document.querySelectorAll('#exercise2-options .option-btn');
    const feedback = document.getElementById('exercise2-feedback');

    exercise2State.selectedOption = index;
    exercise2State.answered = true;

    buttons.forEach((btn, i) => {
        btn.disabled = true;
        if (exercise2Options[i].correct) {
            btn.classList.add('correct');
        } else if (i === index) {
            btn.classList.add('incorrect');
        }
    });

    if (option.correct) {
        feedback.className = 'exercise-feedback show correct';
        feedback.innerHTML = '<p>正確！這是一個很好的開局走法，控制了中心。</p><p>Correct! This is a good opening move that controls the center.</p>';
    } else {
        feedback.className = 'exercise-feedback show incorrect';
        feedback.innerHTML = '<p>不太理想。開局應該控制中心格子，例如e4或d4。</p><p>Not ideal. You should control the center squares like e4 or d4 in the opening.</p>';
    }
}

function resetExercise2() {
    exercise2State = {
        selectedOption: null,
        answered: false
    };
    document.getElementById('exercise2-feedback').className = 'exercise-feedback';
    initExercise2();
}

// Exercise 1b: Move Rook
let exercise1bState = {
    rookPos: { row: 0, col: 0 }, // a1
    targetPos: { row: 3, col: 4 }, // e4
    selectedSquare: null
};

function initExercise1b() {
    createChessboard('exercise1b-board');
    const board = document.getElementById('exercise1b-board');
    const squares = board.querySelectorAll('.square');

    squares.forEach(square => {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);

        if (row === exercise1bState.rookPos.row && col === exercise1bState.rookPos.col) {
            square.textContent = '♖';
        }

        if (row === exercise1bState.targetPos.row && col === exercise1bState.targetPos.col) {
            square.style.border = '3px solid #32a852';
        }

        square.addEventListener('click', () => handleExercise1bClick(row, col));
    });
}

function handleExercise1bClick(row, col) {
    const board = document.getElementById('exercise1b-board');
    const squares = board.querySelectorAll('.square');

    if (row === exercise1bState.rookPos.row && col === exercise1bState.rookPos.col) {
        exercise1bState.selectedSquare = { row, col };
        squares.forEach(sq => sq.classList.remove('selected', 'valid-move'));

        const selectedSq = Array.from(squares).find(sq =>
            parseInt(sq.dataset.row) === row && parseInt(sq.dataset.col) === col
        );
        selectedSq.classList.add('selected');

        const validMoves = getRookMovesExercise(row, col);
        validMoves.forEach(move => {
            const moveSq = Array.from(squares).find(sq =>
                parseInt(sq.dataset.row) === move.row && parseInt(sq.dataset.col) === move.col
            );
            if (moveSq) moveSq.classList.add('valid-move');
        });
    } else if (exercise1bState.selectedSquare) {
        const validMoves = getRookMovesExercise(exercise1bState.selectedSquare.row, exercise1bState.selectedSquare.col);
        const isValid = validMoves.some(move => move.row === row && move.col === col);

        if (isValid) {
            const feedback = document.getElementById('exercise1b-feedback');

            if (row === exercise1bState.targetPos.row && col === exercise1bState.targetPos.col) {
                exercise1bState.rookPos = { row, col };
                squares.forEach(sq => sq.textContent = '');
                const targetSq = Array.from(squares).find(sq =>
                    parseInt(sq.dataset.row) === row && parseInt(sq.dataset.col) === col
                );
                targetSq.textContent = '♖';

                feedback.className = 'exercise-feedback show correct';
                feedback.innerHTML = '<p>正確！城堡已移動到e4！</p><p>Correct! The Rook moved to e4!</p>';
            } else {
                exercise1bState.rookPos = { row, col };
                squares.forEach(sq => {
                    sq.textContent = '';
                    sq.classList.remove('selected', 'valid-move');
                });
                const newSq = Array.from(squares).find(sq =>
                    parseInt(sq.dataset.row) === row && parseInt(sq.dataset.col) === col
                );
                newSq.textContent = '♖';
                exercise1bState.selectedSquare = null;

                feedback.className = 'exercise-feedback show incorrect';
                feedback.innerHTML = '<p>這是合法的走法，但不是目標位置。請試著移到e4！</p><p>Valid move, but not the target. Try moving to e4!</p>';
            }
        }
    }
}

function getRookMovesExercise(row, col) {
    const moves = [];
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    for (const [drow, dcol] of directions) {
        let newRow = row + drow;
        let newCol = col + dcol;

        while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            moves.push({ row: newRow, col: newCol });
            newRow += drow;
            newCol += dcol;
        }
    }

    return moves;
}

function resetExercise1b() {
    exercise1bState = {
        rookPos: { row: 0, col: 0 },
        targetPos: { row: 3, col: 4 },
        selectedSquare: null
    };
    document.getElementById('exercise1b-feedback').className = 'exercise-feedback';
    initExercise1b();
}

// Exercise 1c: Move Bishop
let exercise1cState = {
    bishopPos: { row: 0, col: 2 }, // c1
    targetPos: { row: 4, col: 6 }, // g5
    selectedSquare: null
};

function initExercise1c() {
    createChessboard('exercise1c-board');
    const board = document.getElementById('exercise1c-board');
    const squares = board.querySelectorAll('.square');

    squares.forEach(square => {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);

        if (row === exercise1cState.bishopPos.row && col === exercise1cState.bishopPos.col) {
            square.textContent = '♗';
        }

        if (row === exercise1cState.targetPos.row && col === exercise1cState.targetPos.col) {
            square.style.border = '3px solid #32a852';
        }

        square.addEventListener('click', () => handleExercise1cClick(row, col));
    });
}

function handleExercise1cClick(row, col) {
    const board = document.getElementById('exercise1c-board');
    const squares = board.querySelectorAll('.square');

    if (row === exercise1cState.bishopPos.row && col === exercise1cState.bishopPos.col) {
        exercise1cState.selectedSquare = { row, col };
        squares.forEach(sq => sq.classList.remove('selected', 'valid-move'));

        const selectedSq = Array.from(squares).find(sq =>
            parseInt(sq.dataset.row) === row && parseInt(sq.dataset.col) === col
        );
        selectedSq.classList.add('selected');

        const validMoves = getBishopMovesExercise(row, col);
        validMoves.forEach(move => {
            const moveSq = Array.from(squares).find(sq =>
                parseInt(sq.dataset.row) === move.row && parseInt(sq.dataset.col) === move.col
            );
            if (moveSq) moveSq.classList.add('valid-move');
        });
    } else if (exercise1cState.selectedSquare) {
        const validMoves = getBishopMovesExercise(exercise1cState.selectedSquare.row, exercise1cState.selectedSquare.col);
        const isValid = validMoves.some(move => move.row === row && move.col === col);

        if (isValid) {
            const feedback = document.getElementById('exercise1c-feedback');

            if (row === exercise1cState.targetPos.row && col === exercise1cState.targetPos.col) {
                exercise1cState.bishopPos = { row, col };
                squares.forEach(sq => sq.textContent = '');
                const targetSq = Array.from(squares).find(sq =>
                    parseInt(sq.dataset.row) === row && parseInt(sq.dataset.col) === col
                );
                targetSq.textContent = '♗';

                feedback.className = 'exercise-feedback show correct';
                feedback.innerHTML = '<p>正確！象已移動到g5！</p><p>Correct! The Bishop moved to g5!</p>';
            } else {
                exercise1cState.bishopPos = { row, col };
                squares.forEach(sq => {
                    sq.textContent = '';
                    sq.classList.remove('selected', 'valid-move');
                });
                const newSq = Array.from(squares).find(sq =>
                    parseInt(sq.dataset.row) === row && parseInt(sq.dataset.col) === col
                );
                newSq.textContent = '♗';
                exercise1cState.selectedSquare = null;

                feedback.className = 'exercise-feedback show incorrect';
                feedback.innerHTML = '<p>這是合法的走法，但不是目標位置。請試著移到g5！</p><p>Valid move, but not the target. Try moving to g5!</p>';
            }
        }
    }
}

function getBishopMovesExercise(row, col) {
    const moves = [];
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

    for (const [drow, dcol] of directions) {
        let newRow = row + drow;
        let newCol = col + dcol;

        while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            moves.push({ row: newRow, col: newCol });
            newRow += drow;
            newCol += dcol;
        }
    }

    return moves;
}

function resetExercise1c() {
    exercise1cState = {
        bishopPos: { row: 0, col: 2 },
        targetPos: { row: 4, col: 6 },
        selectedSquare: null
    };
    document.getElementById('exercise1c-feedback').className = 'exercise-feedback';
    initExercise1c();
}

// Exercise 1d: Move Pawn
let exercise1dState = {
    pawnPos: { row: 1, col: 4 }, // e2
    targetPos: { row: 3, col: 4 }, // e4
    selectedSquare: null
};

function initExercise1d() {
    createChessboard('exercise1d-board');
    const board = document.getElementById('exercise1d-board');
    const squares = board.querySelectorAll('.square');

    squares.forEach(square => {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);

        if (row === exercise1dState.pawnPos.row && col === exercise1dState.pawnPos.col) {
            square.textContent = '♙';
        }

        if (row === exercise1dState.targetPos.row && col === exercise1dState.targetPos.col) {
            square.style.border = '3px solid #32a852';
        }

        square.addEventListener('click', () => handleExercise1dClick(row, col));
    });
}

function handleExercise1dClick(row, col) {
    const board = document.getElementById('exercise1d-board');
    const squares = board.querySelectorAll('.square');

    if (row === exercise1dState.pawnPos.row && col === exercise1dState.pawnPos.col) {
        exercise1dState.selectedSquare = { row, col };
        squares.forEach(sq => sq.classList.remove('selected', 'valid-move'));

        const selectedSq = Array.from(squares).find(sq =>
            parseInt(sq.dataset.row) === row && parseInt(sq.dataset.col) === col
        );
        selectedSq.classList.add('selected');

        const validMoves = getPawnMovesExercise(row, col);
        validMoves.forEach(move => {
            const moveSq = Array.from(squares).find(sq =>
                parseInt(sq.dataset.row) === move.row && parseInt(sq.dataset.col) === move.col
            );
            if (moveSq) moveSq.classList.add('valid-move');
        });
    } else if (exercise1dState.selectedSquare) {
        const validMoves = getPawnMovesExercise(exercise1dState.selectedSquare.row, exercise1dState.selectedSquare.col);
        const isValid = validMoves.some(move => move.row === row && move.col === col);

        if (isValid) {
            const feedback = document.getElementById('exercise1d-feedback');

            if (row === exercise1dState.targetPos.row && col === exercise1dState.targetPos.col) {
                exercise1dState.pawnPos = { row, col };
                squares.forEach(sq => sq.textContent = '');
                const targetSq = Array.from(squares).find(sq =>
                    parseInt(sq.dataset.row) === row && parseInt(sq.dataset.col) === col
                );
                targetSq.textContent = '♙';

                feedback.className = 'exercise-feedback show correct';
                feedback.innerHTML = '<p>正確！兵已移動到e4！</p><p>Correct! The Pawn moved to e4!</p>';
            } else {
                exercise1dState.pawnPos = { row, col };
                squares.forEach(sq => {
                    sq.textContent = '';
                    sq.classList.remove('selected', 'valid-move');
                });
                const newSq = Array.from(squares).find(sq =>
                    parseInt(sq.dataset.row) === row && parseInt(sq.dataset.col) === col
                );
                newSq.textContent = '♙';
                exercise1dState.selectedSquare = null;

                feedback.className = 'exercise-feedback show incorrect';
                feedback.innerHTML = '<p>這是合法的走法，但不是目標位置。請試著移到e4！</p><p>Valid move, but not the target. Try moving to e4!</p>';
            }
        }
    }
}

function getPawnMovesExercise(row, col) {
    const moves = [];
    // White pawn moves forward
    if (row === 1) {
        // Can move 1 or 2 squares from starting position
        moves.push({ row: row + 1, col });
        moves.push({ row: row + 2, col });
    } else {
        // Can only move 1 square
        if (row + 1 < 8) {
            moves.push({ row: row + 1, col });
        }
    }
    return moves;
}

function resetExercise1d() {
    exercise1dState = {
        pawnPos: { row: 1, col: 4 },
        targetPos: { row: 3, col: 4 },
        selectedSquare: null
    };
    document.getElementById('exercise1d-feedback').className = 'exercise-feedback';
    initExercise1d();
}

// Exercise 1e: Move Queen
let exercise1eState = {
    queenPos: { row: 0, col: 3 }, // d1
    targetPos: { row: 3, col: 3 }, // d4
    selectedSquare: null
};

function initExercise1e() {
    createChessboard('exercise1e-board');
    const board = document.getElementById('exercise1e-board');
    const squares = board.querySelectorAll('.square');

    squares.forEach(square => {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);

        if (row === exercise1eState.queenPos.row && col === exercise1eState.queenPos.col) {
            square.textContent = '♕';
        }

        if (row === exercise1eState.targetPos.row && col === exercise1eState.targetPos.col) {
            square.style.border = '3px solid #32a852';
        }

        square.addEventListener('click', () => handleExercise1eClick(row, col));
    });
}

function handleExercise1eClick(row, col) {
    const board = document.getElementById('exercise1e-board');
    const squares = board.querySelectorAll('.square');

    if (row === exercise1eState.queenPos.row && col === exercise1eState.queenPos.col) {
        exercise1eState.selectedSquare = { row, col };
        squares.forEach(sq => sq.classList.remove('selected', 'valid-move'));

        const selectedSq = Array.from(squares).find(sq =>
            parseInt(sq.dataset.row) === row && parseInt(sq.dataset.col) === col
        );
        selectedSq.classList.add('selected');

        const validMoves = getQueenMovesExercise(row, col);
        validMoves.forEach(move => {
            const moveSq = Array.from(squares).find(sq =>
                parseInt(sq.dataset.row) === move.row && parseInt(sq.dataset.col) === move.col
            );
            if (moveSq) moveSq.classList.add('valid-move');
        });
    } else if (exercise1eState.selectedSquare) {
        const validMoves = getQueenMovesExercise(exercise1eState.selectedSquare.row, exercise1eState.selectedSquare.col);
        const isValid = validMoves.some(move => move.row === row && move.col === col);

        if (isValid) {
            const feedback = document.getElementById('exercise1e-feedback');

            if (row === exercise1eState.targetPos.row && col === exercise1eState.targetPos.col) {
                exercise1eState.queenPos = { row, col };
                squares.forEach(sq => sq.textContent = '');
                const targetSq = Array.from(squares).find(sq =>
                    parseInt(sq.dataset.row) === row && parseInt(sq.dataset.col) === col
                );
                targetSq.textContent = '♕';

                feedback.className = 'exercise-feedback show correct';
                feedback.innerHTML = '<p>正確！皇后已移動到d4！</p><p>Correct! The Queen moved to d4!</p>';
            } else {
                exercise1eState.queenPos = { row, col };
                squares.forEach(sq => {
                    sq.textContent = '';
                    sq.classList.remove('selected', 'valid-move');
                });
                const newSq = Array.from(squares).find(sq =>
                    parseInt(sq.dataset.row) === row && parseInt(sq.dataset.col) === col
                );
                newSq.textContent = '♕';
                exercise1eState.selectedSquare = null;

                feedback.className = 'exercise-feedback show incorrect';
                feedback.innerHTML = '<p>這是合法的走法，但不是目標位置。請試著移到d4！</p><p>Valid move, but not the target. Try moving to d4!</p>';
            }
        }
    }
}

function getQueenMovesExercise(row, col) {
    return [...getRookMovesExercise(row, col), ...getBishopMovesExercise(row, col)];
}

function resetExercise1e() {
    exercise1eState = {
        queenPos: { row: 0, col: 3 },
        targetPos: { row: 3, col: 3 },
        selectedSquare: null
    };
    document.getElementById('exercise1e-feedback').className = 'exercise-feedback';
    initExercise1e();
}

// Exercise 1f: Move King
let exercise1fState = {
    kingPos: { row: 0, col: 4 }, // e1
    targetPos: { row: 1, col: 4 }, // e2
    selectedSquare: null
};

function initExercise1f() {
    createChessboard('exercise1f-board');
    const board = document.getElementById('exercise1f-board');
    const squares = board.querySelectorAll('.square');

    squares.forEach(square => {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);

        if (row === exercise1fState.kingPos.row && col === exercise1fState.kingPos.col) {
            square.textContent = '♔';
        }

        if (row === exercise1fState.targetPos.row && col === exercise1fState.targetPos.col) {
            square.style.border = '3px solid #32a852';
        }

        square.addEventListener('click', () => handleExercise1fClick(row, col));
    });
}

function handleExercise1fClick(row, col) {
    const board = document.getElementById('exercise1f-board');
    const squares = board.querySelectorAll('.square');

    if (row === exercise1fState.kingPos.row && col === exercise1fState.kingPos.col) {
        exercise1fState.selectedSquare = { row, col };
        squares.forEach(sq => sq.classList.remove('selected', 'valid-move'));

        const selectedSq = Array.from(squares).find(sq =>
            parseInt(sq.dataset.row) === row && parseInt(sq.dataset.col) === col
        );
        selectedSq.classList.add('selected');

        const validMoves = getKingMovesExercise(row, col);
        validMoves.forEach(move => {
            const moveSq = Array.from(squares).find(sq =>
                parseInt(sq.dataset.row) === move.row && parseInt(sq.dataset.col) === move.col
            );
            if (moveSq) moveSq.classList.add('valid-move');
        });
    } else if (exercise1fState.selectedSquare) {
        const validMoves = getKingMovesExercise(exercise1fState.selectedSquare.row, exercise1fState.selectedSquare.col);
        const isValid = validMoves.some(move => move.row === row && move.col === col);

        if (isValid) {
            const feedback = document.getElementById('exercise1f-feedback');

            if (row === exercise1fState.targetPos.row && col === exercise1fState.targetPos.col) {
                exercise1fState.kingPos = { row, col };
                squares.forEach(sq => sq.textContent = '');
                const targetSq = Array.from(squares).find(sq =>
                    parseInt(sq.dataset.row) === row && parseInt(sq.dataset.col) === col
                );
                targetSq.textContent = '♔';

                feedback.className = 'exercise-feedback show correct';
                feedback.innerHTML = '<p>正確！國王已移動到e2！</p><p>Correct! The King moved to e2!</p>';
            } else {
                exercise1fState.kingPos = { row, col };
                squares.forEach(sq => {
                    sq.textContent = '';
                    sq.classList.remove('selected', 'valid-move');
                });
                const newSq = Array.from(squares).find(sq =>
                    parseInt(sq.dataset.row) === row && parseInt(sq.dataset.col) === col
                );
                newSq.textContent = '♔';
                exercise1fState.selectedSquare = null;

                feedback.className = 'exercise-feedback show incorrect';
                feedback.innerHTML = '<p>這不是合法的國王走法。國王只能向任何方向移動一格。請重試！</p><p>That\'s not a legal King move. Kings can only move one square in any direction. Try again!</p>';
            }
        }
    }
}

function getKingMovesExercise(row, col) {
    const moves = [];
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];

    for (const [drow, dcol] of directions) {
        const newRow = row + drow;
        const newCol = col + dcol;

        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            moves.push({ row: newRow, col: newCol });
        }
    }

    return moves;
}

function resetExercise1f() {
    exercise1fState = {
        kingPos: { row: 0, col: 4 },
        targetPos: { row: 1, col: 4 },
        selectedSquare: null
    };
    document.getElementById('exercise1f-feedback').className = 'exercise-feedback';
    initExercise1f();
}

// Exercise 3a: Castling
let exercise3aState = {
    board: [
        [{ piece: 'rook', color: 'white' }, null, null, null, { piece: 'king', color: 'white' }, null, null, { piece: 'rook', color: 'white' }],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null]
    ],
    kingPos: { row: 0, col: 4 },
    selectedSquare: null,
    completed: false
};

function initExercise3a() {
    createChessboard('exercise3a-board');
    renderExercise3aBoard();
}

function renderExercise3aBoard() {
    const board = document.getElementById('exercise3a-board');
    const squares = board.querySelectorAll('.square');

    squares.forEach(square => {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        const piece = exercise3aState.board[row][col];

        square.textContent = '';
        square.classList.remove('selected', 'valid-move');

        if (piece) {
            square.textContent = getPieceSymbol(piece.piece, piece.color);
        }

        square.onclick = () => handleExercise3aClick(row, col);
    });
}

function handleExercise3aClick(row, col) {
    if (exercise3aState.completed) return;

    const piece = exercise3aState.board[row][col];

    if (exercise3aState.selectedSquare) {
        const fromRow = exercise3aState.selectedSquare.row;
        const fromCol = exercise3aState.selectedSquare.col;
        const movingPiece = exercise3aState.board[fromRow][fromCol];

        if (movingPiece && movingPiece.piece === 'king' && movingPiece.color === 'white') {
            const feedback = document.getElementById('exercise3a-feedback');

            // Check for kingside castling (King moves from e1 to g1)
            if (fromRow === 0 && fromCol === 4 && row === 0 && col === 6) {
                // Kingside castling
                exercise3aState.board[0][6] = { piece: 'king', color: 'white' };
                exercise3aState.board[0][5] = { piece: 'rook', color: 'white' };
                exercise3aState.board[0][4] = null;
                exercise3aState.board[0][7] = null;
                exercise3aState.completed = true;

                feedback.className = 'exercise-feedback show correct';
                feedback.innerHTML = '<p>正確！你成功進行了王翼易位！</p><p>Correct! You successfully castled kingside!</p>';
                renderExercise3aBoard();
            }
            // Check for queenside castling (King moves from e1 to c1)
            else if (fromRow === 0 && fromCol === 4 && row === 0 && col === 2) {
                // Queenside castling
                exercise3aState.board[0][2] = { piece: 'king', color: 'white' };
                exercise3aState.board[0][3] = { piece: 'rook', color: 'white' };
                exercise3aState.board[0][4] = null;
                exercise3aState.board[0][0] = null;
                exercise3aState.completed = true;

                feedback.className = 'exercise-feedback show correct';
                feedback.innerHTML = '<p>正確！你成功進行了后翼易位！</p><p>Correct! You successfully castled queenside!</p>';
                renderExercise3aBoard();
            } else {
                feedback.className = 'exercise-feedback show incorrect';
                feedback.innerHTML = '<p>這不是易位。記住：將國王向城堡方向移動兩格。</p><p>That\'s not castling. Remember: move the King TWO squares toward the Rook.</p>';
            }
            exercise3aState.selectedSquare = null;
            renderExercise3aBoard();
            return;
        }

        exercise3aState.selectedSquare = null;
        renderExercise3aBoard();
    }

    if (piece && piece.piece === 'king' && piece.color === 'white') {
        exercise3aState.selectedSquare = { row, col };
        renderExercise3aBoard();

        const board = document.getElementById('exercise3a-board');
        const squares = board.querySelectorAll('.square');
        const selectedSq = Array.from(squares).find(sq =>
            parseInt(sq.dataset.row) === row && parseInt(sq.dataset.col) === col
        );
        if (selectedSq) selectedSq.classList.add('selected');

        // Highlight castling squares
        const kingsideSq = Array.from(squares).find(sq =>
            parseInt(sq.dataset.row) === 0 && parseInt(sq.dataset.col) === 6
        );
        const queensideSq = Array.from(squares).find(sq =>
            parseInt(sq.dataset.row) === 0 && parseInt(sq.dataset.col) === 2
        );
        if (kingsideSq) kingsideSq.classList.add('valid-move');
        if (queensideSq) queensideSq.classList.add('valid-move');
    }
}

function resetExercise3a() {
    exercise3aState = {
        board: [
            [{ piece: 'rook', color: 'white' }, null, null, null, { piece: 'king', color: 'white' }, null, null, { piece: 'rook', color: 'white' }],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null]
        ],
        kingPos: { row: 0, col: 4 },
        selectedSquare: null,
        completed: false
    };
    document.getElementById('exercise3a-feedback').className = 'exercise-feedback';
    initExercise3a();
}

// Exercise 3b: Pawn Promotion
let exercise3bState = {
    board: [
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, { piece: 'pawn', color: 'white' }, null, null, null],
        [null, null, null, { piece: 'king', color: 'black' }, null, null, null, null]
    ],
    pawnPos: { row: 6, col: 4 },
    selectedSquare: null,
    completed: false,
    waitingForPromotion: false,
    promotionSquare: null
};

function initExercise3b() {
    createChessboard('exercise3b-board');
    renderExercise3bBoard();
}

function renderExercise3bBoard() {
    const board = document.getElementById('exercise3b-board');
    const squares = board.querySelectorAll('.square');

    squares.forEach(square => {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        const piece = exercise3bState.board[row][col];

        square.textContent = '';
        square.classList.remove('selected', 'valid-move');

        if (piece) {
            square.textContent = getPieceSymbol(piece.piece, piece.color);
        }

        square.onclick = () => handleExercise3bClick(row, col);
    });
}

function handleExercise3bClick(row, col) {
    if (exercise3bState.completed || exercise3bState.waitingForPromotion) return;

    const piece = exercise3bState.board[row][col];

    if (exercise3bState.selectedSquare) {
        const fromRow = exercise3bState.selectedSquare.row;
        const fromCol = exercise3bState.selectedSquare.col;
        const movingPiece = exercise3bState.board[fromRow][fromCol];

        if (movingPiece && movingPiece.piece === 'pawn' && movingPiece.color === 'white') {
            const validMoves = getPawnMoves(fromRow, fromCol, 'white');
            const isValid = validMoves.some(m => m.row === row && m.col === col);

            if (isValid && row === 7) {
                // Pawn reached the last rank - show promotion dialog
                exercise3bState.board[row][col] = movingPiece;
                exercise3bState.board[fromRow][fromCol] = null;
                exercise3bState.waitingForPromotion = true;
                exercise3bState.promotionSquare = { row, col };
                renderExercise3bBoard();
                showPromotionDialog('white', row, col, true); // true for exercise mode
            }
        }

        exercise3bState.selectedSquare = null;
        renderExercise3bBoard();
    }

    if (piece && piece.piece === 'pawn' && piece.color === 'white') {
        exercise3bState.selectedSquare = { row, col };
        renderExercise3bBoard();

        const board = document.getElementById('exercise3b-board');
        const squares = board.querySelectorAll('.square');
        const selectedSq = Array.from(squares).find(sq =>
            parseInt(sq.dataset.row) === row && parseInt(sq.dataset.col) === col
        );
        if (selectedSq) selectedSq.classList.add('selected');

        // Show valid moves
        const validMoves = getPawnMoves(row, col, 'white');
        validMoves.forEach(move => {
            const moveSq = Array.from(squares).find(sq =>
                parseInt(sq.dataset.row) === move.row && parseInt(sq.dataset.col) === move.col
            );
            if (moveSq) moveSq.classList.add('valid-move');
        });
    }
}

function resetExercise3b() {
    exercise3bState = {
        board: [
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, { piece: 'pawn', color: 'white' }, null, null, null],
            [null, null, null, { piece: 'king', color: 'black' }, null, null, null, null]
        ],
        pawnPos: { row: 6, col: 4 },
        selectedSquare: null,
        completed: false,
        waitingForPromotion: false,
        promotionSquare: null
    };
    document.getElementById('exercise3b-feedback').className = 'exercise-feedback';
    initExercise3b();
}

function getPieceSymbol(piece, color) {
    const symbols = {
        king: { white: '♔', black: '♚' },
        queen: { white: '♕', black: '♛' },
        rook: { white: '♖', black: '♜' },
        bishop: { white: '♗', black: '♝' },
        knight: { white: '♘', black: '♞' },
        pawn: { white: '♙', black: '♟' }
    };
    return symbols[piece][color];
}

// Full Chess Game
let gameState = {
    board: [],
    currentTurn: 'white',
    selectedSquare: null,
    moveHistory: [],
    boardHistory: [],
    capturedPieces: { white: [], black: [] },
    isFlipped: false,
    kingPositions: { white: { row: 0, col: 4 }, black: { row: 7, col: 4 } },
    hasMoved: {
        whiteKing: false,
        blackKing: false,
        whiteRookA: false,
        whiteRookH: false,
        blackRookA: false,
        blackRookH: false
    },
    gameOver: false
};

function initGame() {
    // Initialize board
    gameState.board = Array(8).fill(null).map(() => Array(8).fill(null));

    // Set up pieces
    // Pawns
    for (let i = 0; i < 8; i++) {
        gameState.board[1][i] = { piece: 'pawn', color: 'white' };
        gameState.board[6][i] = { piece: 'pawn', color: 'black' };
    }

    // Rooks
    gameState.board[0][0] = { piece: 'rook', color: 'white' };
    gameState.board[0][7] = { piece: 'rook', color: 'white' };
    gameState.board[7][0] = { piece: 'rook', color: 'black' };
    gameState.board[7][7] = { piece: 'rook', color: 'black' };

    // Knights
    gameState.board[0][1] = { piece: 'knight', color: 'white' };
    gameState.board[0][6] = { piece: 'knight', color: 'white' };
    gameState.board[7][1] = { piece: 'knight', color: 'black' };
    gameState.board[7][6] = { piece: 'knight', color: 'black' };

    // Bishops
    gameState.board[0][2] = { piece: 'bishop', color: 'white' };
    gameState.board[0][5] = { piece: 'bishop', color: 'white' };
    gameState.board[7][2] = { piece: 'bishop', color: 'black' };
    gameState.board[7][5] = { piece: 'bishop', color: 'black' };

    // Queens
    gameState.board[0][3] = { piece: 'queen', color: 'white' };
    gameState.board[7][3] = { piece: 'queen', color: 'black' };

    // Kings
    gameState.board[0][4] = { piece: 'king', color: 'white' };
    gameState.board[7][4] = { piece: 'king', color: 'black' };

    renderGameBoard();
}

function renderGameBoard() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';

    const startRow = gameState.isFlipped ? 0 : 7;
    const endRow = gameState.isFlipped ? 8 : -1;
    const rowStep = gameState.isFlipped ? 1 : -1;
    const startCol = gameState.isFlipped ? 7 : 0;
    const endCol = gameState.isFlipped ? -1 : 8;
    const colStep = gameState.isFlipped ? -1 : 1;

    for (let row = startRow; gameState.isFlipped ? row < endRow : row > endRow; row += rowStep) {
        for (let col = startCol; gameState.isFlipped ? col > endCol : col < endCol; col += colStep) {
            const square = document.createElement('div');
            square.className = 'square';
            square.className += (row + col) % 2 === 0 ? ' light' : ' dark';
            square.dataset.row = row;
            square.dataset.col = col;

            const piece = gameState.board[row][col];
            if (piece) {
                square.textContent = getPieceSymbol(piece.piece, piece.color);
            }

            square.addEventListener('click', () => handleGameClick(row, col));
            board.appendChild(square);
        }
    }
}

function handleGameClick(row, col) {
    // Prevent moves if game is over
    if (gameState.gameOver) return;

    const piece = gameState.board[row][col];
    const board = document.getElementById('game-board');
    const squares = board.querySelectorAll('.square');

    if (gameState.selectedSquare) {
        // Try to move
        const validMoves = getValidMoves(gameState.selectedSquare.row, gameState.selectedSquare.col);
        const isValidMove = validMoves.some(move => move.row === row && move.col === col);

        if (isValidMove) {
            makeMove(gameState.selectedSquare.row, gameState.selectedSquare.col, row, col);
            gameState.selectedSquare = null;
        } else if (piece && piece.color === gameState.currentTurn) {
            // Select different piece
            gameState.selectedSquare = { row, col };
        } else {
            gameState.selectedSquare = null;
        }

        renderGameBoard();
        highlightValidMoves();
    } else if (piece && piece.color === gameState.currentTurn) {
        // Select piece
        gameState.selectedSquare = { row, col };
        renderGameBoard();
        highlightValidMoves();
    }
}

function highlightValidMoves() {
    if (!gameState.selectedSquare) return;

    const board = document.getElementById('game-board');
    const squares = board.querySelectorAll('.square');

    // Highlight selected square
    const selectedSq = Array.from(squares).find(sq =>
        parseInt(sq.dataset.row) === gameState.selectedSquare.row &&
        parseInt(sq.dataset.col) === gameState.selectedSquare.col
    );
    if (selectedSq) selectedSq.classList.add('selected');

    // Highlight valid moves
    const validMoves = getValidMoves(gameState.selectedSquare.row, gameState.selectedSquare.col);
    validMoves.forEach(move => {
        const moveSq = Array.from(squares).find(sq =>
            parseInt(sq.dataset.row) === move.row &&
            parseInt(sq.dataset.col) === move.col
        );
        if (moveSq) moveSq.classList.add('valid-move');
    });
}

function getValidMoves(row, col) {
    const piece = gameState.board[row][col];
    if (!piece) return [];

    let moves = [];

    switch (piece.piece) {
        case 'pawn':
            moves = getPawnMoves(row, col, piece.color);
            break;
        case 'knight':
            moves = getKnightMovesGame(row, col, piece.color);
            break;
        case 'bishop':
            moves = getBishopMoves(row, col, piece.color);
            break;
        case 'rook':
            moves = getRookMoves(row, col, piece.color);
            break;
        case 'queen':
            moves = getQueenMoves(row, col, piece.color);
            break;
        case 'king':
            moves = getKingMoves(row, col, piece.color);
            break;
    }

    return moves;
}

function getPawnMoves(row, col, color) {
    const moves = [];
    const direction = color === 'white' ? 1 : -1;
    const startRow = color === 'white' ? 1 : 6;

    // Move forward one square
    if (isValidSquare(row + direction, col) && !gameState.board[row + direction][col]) {
        moves.push({ row: row + direction, col });

        // Move forward two squares from starting position
        if (row === startRow && !gameState.board[row + 2 * direction][col]) {
            moves.push({ row: row + 2 * direction, col });
        }
    }

    // Capture diagonally
    for (const dcol of [-1, 1]) {
        const newRow = row + direction;
        const newCol = col + dcol;
        if (isValidSquare(newRow, newCol)) {
            const target = gameState.board[newRow][newCol];
            if (target && target.color !== color) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    }

    return moves;
}

function getKnightMovesGame(row, col, color) {
    const moves = [
        { row: row + 2, col: col + 1 },
        { row: row + 2, col: col - 1 },
        { row: row - 2, col: col + 1 },
        { row: row - 2, col: col - 1 },
        { row: row + 1, col: col + 2 },
        { row: row + 1, col: col - 2 },
        { row: row - 1, col: col + 2 },
        { row: row - 1, col: col - 2 }
    ];

    return moves.filter(move =>
        isValidSquare(move.row, move.col) &&
        (!gameState.board[move.row][move.col] || gameState.board[move.row][move.col].color !== color)
    );
}

function getBishopMoves(row, col, color) {
    const moves = [];
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

    for (const [drow, dcol] of directions) {
        let newRow = row + drow;
        let newCol = col + dcol;

        while (isValidSquare(newRow, newCol)) {
            const target = gameState.board[newRow][newCol];
            if (!target) {
                moves.push({ row: newRow, col: newCol });
            } else {
                if (target.color !== color) {
                    moves.push({ row: newRow, col: newCol });
                }
                break;
            }
            newRow += drow;
            newCol += dcol;
        }
    }

    return moves;
}

function getRookMoves(row, col, color) {
    const moves = [];
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    for (const [drow, dcol] of directions) {
        let newRow = row + drow;
        let newCol = col + dcol;

        while (isValidSquare(newRow, newCol)) {
            const target = gameState.board[newRow][newCol];
            if (!target) {
                moves.push({ row: newRow, col: newCol });
            } else {
                if (target.color !== color) {
                    moves.push({ row: newRow, col: newCol });
                }
                break;
            }
            newRow += drow;
            newCol += dcol;
        }
    }

    return moves;
}

function getQueenMoves(row, col, color) {
    return [...getBishopMoves(row, col, color), ...getRookMoves(row, col, color)];
}

function getKingMoves(row, col, color) {
    const moves = [];
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];

    for (const [drow, dcol] of directions) {
        const newRow = row + drow;
        const newCol = col + dcol;

        if (isValidSquare(newRow, newCol)) {
            const target = gameState.board[newRow][newCol];
            if (!target || target.color !== color) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    }

    return moves;
}

function isValidSquare(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function makeMove(fromRow, fromCol, toRow, toCol) {
    // Save current state to history before making the move
    gameState.boardHistory.push({
        board: JSON.parse(JSON.stringify(gameState.board)),
        currentTurn: gameState.currentTurn,
        kingPositions: JSON.parse(JSON.stringify(gameState.kingPositions)),
        hasMoved: JSON.parse(JSON.stringify(gameState.hasMoved)),
        capturedPieces: JSON.parse(JSON.stringify(gameState.capturedPieces))
    });

    const piece = gameState.board[fromRow][fromCol];
    const captured = gameState.board[toRow][toCol];

    // Capture piece
    if (captured) {
        gameState.capturedPieces[captured.color].push(captured.piece);
        updateCapturedPieces();

        // Check if King was captured - GAME OVER
        if (captured.piece === 'king') {
            gameState.board[toRow][toCol] = piece;
            gameState.board[fromRow][fromCol] = null;
            renderGameBoard();
            showGameOver(piece.color);
            return;
        }
    }

    // Move piece
    gameState.board[toRow][toCol] = piece;
    gameState.board[fromRow][fromCol] = null;

    // Update king position
    if (piece.piece === 'king') {
        gameState.kingPositions[piece.color] = { row: toRow, col: toCol };
        gameState.hasMoved[piece.color + 'King'] = true;
    }

    // Track rook moves for castling
    if (piece.piece === 'rook') {
        if (fromRow === 0 && fromCol === 0) gameState.hasMoved.whiteRookA = true;
        if (fromRow === 0 && fromCol === 7) gameState.hasMoved.whiteRookH = true;
        if (fromRow === 7 && fromCol === 0) gameState.hasMoved.blackRookA = true;
        if (fromRow === 7 && fromCol === 7) gameState.hasMoved.blackRookH = true;
    }

    // Pawn promotion
    if (piece.piece === 'pawn') {
        if ((piece.color === 'white' && toRow === 7) || (piece.color === 'black' && toRow === 0)) {
            // Show promotion dialog
            renderGameBoard();
            showPromotionDialog(piece.color, toRow, toCol, false); // false for game mode
            return; // Don't continue - wait for promotion choice
        }
    }

    // Record move
    const fromSquare = String.fromCharCode(97 + fromCol) + (fromRow + 1);
    const toSquare = String.fromCharCode(97 + toCol) + (toRow + 1);
    const moveNotation = `${getPieceLetter(piece.piece)}${fromSquare}-${toSquare}`;
    gameState.moveHistory.push(moveNotation);
    updateMoveHistory();

    // Switch turn
    gameState.currentTurn = gameState.currentTurn === 'white' ? 'black' : 'white';
    updateTurnIndicator();

    // Check for check/checkmate
    checkGameStatus();
}

function getPieceLetter(piece) {
    const letters = {
        king: 'K',
        queen: 'Q',
        rook: 'R',
        bishop: 'B',
        knight: 'N',
        pawn: 'P'
    };
    return letters[piece];
}

function updateTurnIndicator() {
    const indicator = document.getElementById('turn-indicator');
    if (gameState.currentTurn === 'white') {
        indicator.className = 'turn-indicator white';
        indicator.textContent = '白方回合 / White\'s Turn';
    } else {
        indicator.className = 'turn-indicator black';
        indicator.textContent = '黑方回合 / Black\'s Turn';
    }
}

function updateMoveHistory() {
    const history = document.getElementById('move-history');
    history.innerHTML = gameState.moveHistory.map((move, i) =>
        `${i + 1}. ${move}`
    ).join('<br>');
    history.scrollTop = history.scrollHeight;
}

function updateCapturedPieces() {
    const whiteContainer = document.getElementById('captured-white');
    const blackContainer = document.getElementById('captured-black');

    whiteContainer.innerHTML = gameState.capturedPieces.white.map(piece =>
        getPieceSymbol(piece, 'white')
    ).join(' ');

    blackContainer.innerHTML = gameState.capturedPieces.black.map(piece =>
        getPieceSymbol(piece, 'black')
    ).join(' ');
}

function checkGameStatus() {
    const kingPos = gameState.kingPositions[gameState.currentTurn];
    const isInCheck = isSquareUnderAttack(kingPos.row, kingPos.col, gameState.currentTurn);

    const message = document.getElementById('game-message');

    if (isInCheck) {
        message.className = 'game-message show check';
        message.innerHTML = '<p>將軍 / Check!</p>';
    } else {
        message.className = 'game-message';
    }
}

function isSquareUnderAttack(row, col, color) {
    const enemyColor = color === 'white' ? 'black' : 'white';

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = gameState.board[r][c];
            if (piece && piece.color === enemyColor) {
                const moves = getValidMoves(r, c);
                if (moves.some(move => move.row === row && move.col === col)) {
                    return true;
                }
            }
        }
    }

    return false;
}

function resetGame() {
    const wasFlipped = gameState.isFlipped;
    gameState = {
        board: [],
        currentTurn: 'white',
        selectedSquare: null,
        moveHistory: [],
        boardHistory: [],
        capturedPieces: { white: [], black: [] },
        isFlipped: wasFlipped,
        kingPositions: { white: { row: 0, col: 4 }, black: { row: 7, col: 4 } },
        hasMoved: {
            whiteKing: false,
            blackKing: false,
            whiteRookA: false,
            whiteRookH: false,
            blackRookA: false,
            blackRookH: false
        },
        gameOver: false
    };

    document.getElementById('game-message').className = 'game-message';
    document.getElementById('move-history').innerHTML = '開始新遊戲 / New game started';
    document.getElementById('captured-white').innerHTML = '';
    document.getElementById('captured-black').innerHTML = '';

    initGame();
}

function undoMove() {
    if (gameState.moveHistory.length === 0) {
        const message = document.getElementById('game-message');
        message.className = 'game-message show check';
        message.innerHTML = '<p>沒有可撤銷的走法 / No moves to undo</p>';
        setTimeout(() => {
            message.className = 'game-message';
        }, 2000);
        return;
    }

    // Get the last state from history
    const lastState = gameState.boardHistory[gameState.boardHistory.length - 1];

    // Restore board state
    gameState.board = JSON.parse(JSON.stringify(lastState.board));
    gameState.currentTurn = lastState.currentTurn;
    gameState.kingPositions = JSON.parse(JSON.stringify(lastState.kingPositions));
    gameState.hasMoved = JSON.parse(JSON.stringify(lastState.hasMoved));
    gameState.capturedPieces = JSON.parse(JSON.stringify(lastState.capturedPieces));

    // Remove last move and state from history
    gameState.moveHistory.pop();
    gameState.boardHistory.pop();

    // Update display
    renderGameBoard();
    updateTurnIndicator();
    updateMoveHistory();
    updateCapturedPieces();

    const message = document.getElementById('game-message');
    message.className = 'game-message show check';
    message.innerHTML = '<p>上一步已撤銷 / Move undone</p>';
    setTimeout(() => {
        message.className = 'game-message';
    }, 1500);
}

function flipBoard() {
    gameState.isFlipped = !gameState.isFlipped;
    renderGameBoard();
    if (gameState.selectedSquare) {
        highlightValidMoves();
    }
}

function showGameOver(winnerColor) {
    const message = document.getElementById('game-message');
    const winnerName = winnerColor === 'white' ? '白方 / White' : '黑方 / Black';
    const winMessage = winnerColor === 'white' ?
        '白方勝利！恭喜白方贏得比賽！' :
        '黑方勝利！恭喜黑方贏得比賽！';
    const winMessageEn = winnerColor === 'white' ?
        'White Wins! Congratulations White on your victory!' :
        'Black Wins! Congratulations Black on your victory!';

    message.className = 'game-message show checkmate';
    message.innerHTML = `
        <h3 style="font-size: var(--font-size-2xl); margin-bottom: var(--space-12);">國王被吃！遊戲結束。 / King captured! Game Over.</h3>
        <p style="font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-8);">${winMessage}</p>
        <p style="font-size: var(--font-size-lg); margin-bottom: var(--space-16);">${winMessageEn}</p>
        <button class="btn" onclick="resetGame()" style="margin-top: var(--space-12);">再玩一次 / Play Again</button>
    `;

    // Disable further moves
    gameState.gameOver = true;
    gameState.selectedSquare = null;
}

// Exercise 4a: Knight Captures
let exercise4aState = {
    board: [
        [null, null, null, null, null, null, { piece: 'knight', color: 'white' }, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, { piece: 'pawn', color: 'black' }, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null]
    ],
    knightPos: { row: 0, col: 6 }, // g1
    targetPos: { row: 2, col: 5 }, // f3
    selectedSquare: null,
    completed: false
};

function initExercise4a() {
    createChessboard('exercise4a-board');
    renderExercise4aBoard();
}

function renderExercise4aBoard() {
    const board = document.getElementById('exercise4a-board');
    const squares = board.querySelectorAll('.square');

    squares.forEach(square => {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        const piece = exercise4aState.board[row][col];

        square.textContent = '';
        square.classList.remove('selected', 'valid-move');

        if (piece) {
            square.textContent = getPieceSymbol(piece.piece, piece.color);
        }

        square.onclick = () => handleExercise4aClick(row, col);
    });
}

function handleExercise4aClick(row, col) {
    if (exercise4aState.completed) return;

    const piece = exercise4aState.board[row][col];

    if (exercise4aState.selectedSquare) {
        const fromRow = exercise4aState.selectedSquare.row;
        const fromCol = exercise4aState.selectedSquare.col;
        const movingPiece = exercise4aState.board[fromRow][fromCol];

        if (movingPiece && movingPiece.piece === 'knight' && movingPiece.color === 'white') {
            const validMoves = getKnightMovesGame(fromRow, fromCol, 'white');
            const isValid = validMoves.some(m => m.row === row && m.col === col);

            if (isValid) {
                const feedback = document.getElementById('exercise4a-feedback');
                const targetPiece = exercise4aState.board[row][col];

                if (row === exercise4aState.targetPos.row && col === exercise4aState.targetPos.col && targetPiece) {
                    exercise4aState.board[row][col] = movingPiece;
                    exercise4aState.board[fromRow][fromCol] = null;
                    exercise4aState.completed = true;

                    feedback.className = 'exercise-feedback show correct';
                    feedback.innerHTML = '<p>正確！馬吃掉了黑方的棋子！</p><p>Correct! The Knight captured the Black piece!</p>';
                    renderExercise4aBoard();
                } else {
                    feedback.className = 'exercise-feedback show incorrect';
                    feedback.innerHTML = '<p>這不是馬的吃掉走法。請重試！</p><p>That\'s not a Knight capture. Try again!</p>';
                }
                exercise4aState.selectedSquare = null;
                renderExercise4aBoard();
                return;
            }
        }

        exercise4aState.selectedSquare = null;
        renderExercise4aBoard();
    }

    if (piece && piece.piece === 'knight' && piece.color === 'white') {
        exercise4aState.selectedSquare = { row, col };
        renderExercise4aBoard();

        const board = document.getElementById('exercise4a-board');
        const squares = board.querySelectorAll('.square');
        const selectedSq = Array.from(squares).find(sq =>
            parseInt(sq.dataset.row) === row && parseInt(sq.dataset.col) === col
        );
        if (selectedSq) selectedSq.classList.add('selected');
    }
}

function resetExercise4a() {
    exercise4aState = {
        board: [
            [null, null, null, null, null, null, { piece: 'knight', color: 'white' }, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, { piece: 'pawn', color: 'black' }, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null]
        ],
        knightPos: { row: 0, col: 6 },
        targetPos: { row: 2, col: 5 },
        selectedSquare: null,
        completed: false
    };
    document.getElementById('exercise4a-feedback').className = 'exercise-feedback';
    initExercise4a();
}

// Exercise 4b: Rook Captures (Fixed - target is a7)
let exercise4bState = {
    board: Array(8).fill(null).map(() => Array(8).fill(null)),
    rookPos: { row: 0, col: 0 },
    targetPos: { row: 6, col: 0 },
    selectedSquare: null,
    completed: false
};
exercise4bState.board[0][0] = { piece: 'rook', color: 'white' };
exercise4bState.board[6][0] = { piece: 'pawn', color: 'black' };

function initExercise4b() {
    createChessboard('exercise4b-board');
    renderExercise4bBoard();
}

function renderExercise4bBoard() {
    const board = document.getElementById('exercise4b-board');
    const squares = board.querySelectorAll('.square');

    squares.forEach(square => {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        const piece = exercise4bState.board[row][col];

        square.textContent = '';
        square.classList.remove('selected', 'valid-move');

        if (piece) {
            square.textContent = getPieceSymbol(piece.piece, piece.color);
        }

        square.onclick = () => handleExercise4bClick(row, col);
    });
}

function handleExercise4bClick(row, col) {
    if (exercise4bState.completed) return;

    const piece = exercise4bState.board[row][col];

    if (exercise4bState.selectedSquare) {
        const fromRow = exercise4bState.selectedSquare.row;
        const fromCol = exercise4bState.selectedSquare.col;
        const movingPiece = exercise4bState.board[fromRow][fromCol];

        if (movingPiece && movingPiece.piece === 'rook' && movingPiece.color === 'white') {
            const validMoves = getRookMovesForExercise4b(fromRow, fromCol);
            const isValid = validMoves.some(m => m.row === row && m.col === col);

            if (isValid) {
                const feedback = document.getElementById('exercise4b-feedback');
                const targetPiece = exercise4bState.board[row][col];

                if (row === exercise4bState.targetPos.row && col === exercise4bState.targetPos.col && targetPiece) {
                    exercise4bState.board[row][col] = movingPiece;
                    exercise4bState.board[fromRow][fromCol] = null;
                    exercise4bState.completed = true;

                    feedback.className = 'exercise-feedback show correct';
                    feedback.innerHTML = '<p>正確！城堡吃掉了黑方的棋子！</p><p>Correct! The Rook captured the Black piece!</p>';
                    renderExercise4bBoard();
                } else {
                    feedback.className = 'exercise-feedback show incorrect';
                    feedback.innerHTML = '<p>這不是城堡的吃掉走法。請重試！</p><p>That\'s not a Rook capture. Try again!</p>';
                }
                exercise4bState.selectedSquare = null;
                renderExercise4bBoard();
                return;
            }
        }

        exercise4bState.selectedSquare = null;
        renderExercise4bBoard();
    }

    if (piece && piece.piece === 'rook' && piece.color === 'white') {
        exercise4bState.selectedSquare = { row, col };
        renderExercise4bBoard();

        const board = document.getElementById('exercise4b-board');
        const squares = board.querySelectorAll('.square');
        const selectedSq = Array.from(squares).find(sq =>
            parseInt(sq.dataset.row) === row && parseInt(sq.dataset.col) === col
        );
        if (selectedSq) selectedSq.classList.add('selected');

        // Highlight valid moves
        const validMoves = getRookMovesForExercise4b(row, col);
        validMoves.forEach(move => {
            const moveSq = Array.from(squares).find(sq =>
                parseInt(sq.dataset.row) === move.row && parseInt(sq.dataset.col) === move.col
            );
            if (moveSq) moveSq.classList.add('valid-move');
        });
    }
}

function getRookMovesForExercise4b(row, col) {
    const moves = [];
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    for (const [drow, dcol] of directions) {
        let newRow = row + drow;
        let newCol = col + dcol;

        while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const target = exercise4bState.board[newRow][newCol];
            if (!target) {
                moves.push({ row: newRow, col: newCol });
            } else {
                if (target.color === 'black') {
                    moves.push({ row: newRow, col: newCol });
                }
                break;
            }
            newRow += drow;
            newCol += dcol;
        }
    }

    return moves;
}

function resetExercise4b() {
    exercise4bState = {
        board: Array(8).fill(null).map(() => Array(8).fill(null)),
        rookPos: { row: 0, col: 0 },
        targetPos: { row: 6, col: 0 },
        selectedSquare: null,
        completed: false
    };
    exercise4bState.board[0][0] = { piece: 'rook', color: 'white' };
    exercise4bState.board[6][0] = { piece: 'pawn', color: 'black' };
    document.getElementById('exercise4b-feedback').className = 'exercise-feedback';
    initExercise4b();
}

// Exercise 4c: Bishop Captures (Fixed - target is h6)
let exercise4cState = {
    board: Array(8).fill(null).map(() => Array(8).fill(null)),
    bishopPos: { row: 0, col: 2 },
    targetPos: { row: 5, col: 7 },
    selectedSquare: null,
    completed: false
};
exercise4cState.board[0][2] = { piece: 'bishop', color: 'white' };
exercise4cState.board[5][7] = { piece: 'pawn', color: 'black' };

function initExercise4c() {
    createChessboard('exercise4c-board');
    renderExercise4cBoard();
}

function renderExercise4cBoard() {
    const board = document.getElementById('exercise4c-board');
    const squares = board.querySelectorAll('.square');

    squares.forEach(square => {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        const piece = exercise4cState.board[row][col];

        square.textContent = '';
        square.classList.remove('selected', 'valid-move');

        if (piece) {
            square.textContent = getPieceSymbol(piece.piece, piece.color);
        }

        square.onclick = () => handleExercise4cClick(row, col);
    });
}

function handleExercise4cClick(row, col) {
    if (exercise4cState.completed) return;

    const piece = exercise4cState.board[row][col];

    if (exercise4cState.selectedSquare) {
        const fromRow = exercise4cState.selectedSquare.row;
        const fromCol = exercise4cState.selectedSquare.col;
        const movingPiece = exercise4cState.board[fromRow][fromCol];

        if (movingPiece && movingPiece.piece === 'bishop' && movingPiece.color === 'white') {
            const validMoves = getBishopMovesForExercise4c(fromRow, fromCol);
            const isValid = validMoves.some(m => m.row === row && m.col === col);

            if (isValid) {
                const feedback = document.getElementById('exercise4c-feedback');
                const targetPiece = exercise4cState.board[row][col];

                if (targetPiece && targetPiece.color === 'black') {
                    exercise4cState.board[row][col] = movingPiece;
                    exercise4cState.board[fromRow][fromCol] = null;
                    exercise4cState.completed = true;

                    feedback.className = 'exercise-feedback show correct';
                    feedback.innerHTML = '<p>正確！象吃掉了黑方的棋子！</p><p>Correct! The Bishop captured the Black piece!</p>';
                    renderExercise4cBoard();
                } else {
                    feedback.className = 'exercise-feedback show incorrect';
                    feedback.innerHTML = '<p>這不是象的吃掉走法。請重試！</p><p>That\'s not a Bishop capture. Try again!</p>';
                }
                exercise4cState.selectedSquare = null;
                renderExercise4cBoard();
                return;
            }
        }

        exercise4cState.selectedSquare = null;
        renderExercise4cBoard();
    }

    if (piece && piece.piece === 'bishop' && piece.color === 'white') {
        exercise4cState.selectedSquare = { row, col };
        renderExercise4cBoard();

        const board = document.getElementById('exercise4c-board');
        const squares = board.querySelectorAll('.square');
        const selectedSq = Array.from(squares).find(sq =>
            parseInt(sq.dataset.row) === row && parseInt(sq.dataset.col) === col
        );
        if (selectedSq) selectedSq.classList.add('selected');

        // Highlight valid moves
        const validMoves = getBishopMovesForExercise4c(row, col);
        validMoves.forEach(move => {
            const moveSq = Array.from(squares).find(sq =>
                parseInt(sq.dataset.row) === move.row && parseInt(sq.dataset.col) === move.col
            );
            if (moveSq) moveSq.classList.add('valid-move');
        });
    }
}

function getBishopMovesForExercise4c(row, col) {
    const moves = [];
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

    for (const [drow, dcol] of directions) {
        let newRow = row + drow;
        let newCol = col + dcol;

        while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const target = exercise4cState.board[newRow][newCol];
            if (!target) {
                moves.push({ row: newRow, col: newCol });
            } else {
                if (target.color === 'black') {
                    moves.push({ row: newRow, col: newCol });
                }
                break;
            }
            newRow += drow;
            newCol += dcol;
        }
    }

    return moves;
}

function resetExercise4c() {
    exercise4cState = {
        board: Array(8).fill(null).map(() => Array(8).fill(null)),
        bishopPos: { row: 0, col: 2 },
        targetPos: { row: 5, col: 7 },
        selectedSquare: null,
        completed: false
    };
    exercise4cState.board[0][2] = { piece: 'bishop', color: 'white' };
    exercise4cState.board[5][7] = { piece: 'pawn', color: 'black' };
    document.getElementById('exercise4c-feedback').className = 'exercise-feedback';
    initExercise4c();
}

// Exercise 4d: Pawn Captures (Fixed - e4 pawn captures d5 pawn diagonally)
let exercise4dState = {
    board: Array(8).fill(null).map(() => Array(8).fill(null)),
    pawnPos: { row: 3, col: 4 },
    targetPos: { row: 4, col: 3 },
    selectedSquare: null,
    completed: false
};
exercise4dState.board[3][4] = { piece: 'pawn', color: 'white' };
exercise4dState.board[4][3] = { piece: 'pawn', color: 'black' };

function initExercise4d() {
    createChessboard('exercise4d-board');
    renderExercise4dBoard();
}

function renderExercise4dBoard() {
    const board = document.getElementById('exercise4d-board');
    const squares = board.querySelectorAll('.square');

    squares.forEach(square => {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        const piece = exercise4dState.board[row][col];

        square.textContent = '';
        square.classList.remove('selected', 'valid-move');

        if (piece) {
            square.textContent = getPieceSymbol(piece.piece, piece.color);
        }

        square.onclick = () => handleExercise4dClick(row, col);
    });
}

function handleExercise4dClick(row, col) {
    if (exercise4dState.completed) return;

    const piece = exercise4dState.board[row][col];

    if (exercise4dState.selectedSquare) {
        const fromRow = exercise4dState.selectedSquare.row;
        const fromCol = exercise4dState.selectedSquare.col;
        const movingPiece = exercise4dState.board[fromRow][fromCol];

        if (movingPiece && movingPiece.piece === 'pawn' && movingPiece.color === 'white') {
            const validMoves = getPawnMovesForExercise4d(fromRow, fromCol);
            const isValid = validMoves.some(m => m.row === row && m.col === col);

            if (isValid) {
                const feedback = document.getElementById('exercise4d-feedback');
                const targetPiece = exercise4dState.board[row][col];

                if (targetPiece && targetPiece.color === 'black' && Math.abs(fromCol - col) === 1) {
                    exercise4dState.board[row][col] = movingPiece;
                    exercise4dState.board[fromRow][fromCol] = null;
                    exercise4dState.completed = true;

                    feedback.className = 'exercise-feedback show correct';
                    feedback.innerHTML = '<p>正確！兵吃掉了黑方的棋子！</p><p>Correct! The Pawn captured the Black piece!</p>';
                    renderExercise4dBoard();
                } else {
                    feedback.className = 'exercise-feedback show incorrect';
                    feedback.innerHTML = '<p>這不是兵的吃掉走法。兵只能向前斜線吃掉對方棋子。請重試！</p><p>That\'s not a Pawn capture. Pawns capture diagonally forward only. Try again!</p>';
                }
                exercise4dState.selectedSquare = null;
                renderExercise4dBoard();
                return;
            }
        }

        exercise4dState.selectedSquare = null;
        renderExercise4dBoard();
    }

    if (piece && piece.piece === 'pawn' && piece.color === 'white') {
        exercise4dState.selectedSquare = { row, col };
        renderExercise4dBoard();

        const board = document.getElementById('exercise4d-board');
        const squares = board.querySelectorAll('.square');
        const selectedSq = Array.from(squares).find(sq =>
            parseInt(sq.dataset.row) === row && parseInt(sq.dataset.col) === col
        );
        if (selectedSq) selectedSq.classList.add('selected');

        // Highlight valid moves (only diagonal captures)
        const validMoves = getPawnMovesForExercise4d(row, col);
        validMoves.forEach(move => {
            const moveSq = Array.from(squares).find(sq =>
                parseInt(sq.dataset.row) === move.row && parseInt(sq.dataset.col) === move.col
            );
            if (moveSq) moveSq.classList.add('valid-move');
        });
    }
}

function getPawnMovesForExercise4d(row, col) {
    const moves = [];
    // White pawn can only capture diagonally forward
    for (const dcol of [-1, 1]) {
        const newRow = row + 1;
        const newCol = col + dcol;
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const target = exercise4dState.board[newRow][newCol];
            if (target && target.color === 'black') {
                moves.push({ row: newRow, col: newCol });
            }
        }
    }
    return moves;
}

function resetExercise4d() {
    exercise4dState = {
        board: Array(8).fill(null).map(() => Array(8).fill(null)),
        pawnPos: { row: 3, col: 4 },
        targetPos: { row: 4, col: 3 },
        selectedSquare: null,
        completed: false
    };
    exercise4dState.board[3][4] = { piece: 'pawn', color: 'white' };
    exercise4dState.board[4][3] = { piece: 'pawn', color: 'black' };
    document.getElementById('exercise4d-feedback').className = 'exercise-feedback';
    initExercise4d();
}

// Exercise 4e: Queen Captures (Fixed - target is d8)
let exercise4eState = {
    board: Array(8).fill(null).map(() => Array(8).fill(null)),
    queenPos: { row: 0, col: 3 },
    targetPos: { row: 7, col: 3 },
    selectedSquare: null,
    completed: false
};
exercise4eState.board[0][3] = { piece: 'queen', color: 'white' };
exercise4eState.board[7][3] = { piece: 'pawn', color: 'black' };

function initExercise4e() {
    createChessboard('exercise4e-board');
    renderExercise4eBoard();
}

function renderExercise4eBoard() {
    const board = document.getElementById('exercise4e-board');
    const squares = board.querySelectorAll('.square');

    squares.forEach(square => {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        const piece = exercise4eState.board[row][col];

        square.textContent = '';
        square.classList.remove('selected', 'valid-move');

        if (piece) {
            square.textContent = getPieceSymbol(piece.piece, piece.color);
        }

        square.onclick = () => handleExercise4eClick(row, col);
    });
}

function handleExercise4eClick(row, col) {
    if (exercise4eState.completed) return;

    const piece = exercise4eState.board[row][col];

    if (exercise4eState.selectedSquare) {
        const fromRow = exercise4eState.selectedSquare.row;
        const fromCol = exercise4eState.selectedSquare.col;
        const movingPiece = exercise4eState.board[fromRow][fromCol];

        if (movingPiece && movingPiece.piece === 'queen' && movingPiece.color === 'white') {
            const validMoves = getQueenMovesForExercise4e(fromRow, fromCol);
            const isValid = validMoves.some(m => m.row === row && m.col === col);

            if (isValid) {
                const feedback = document.getElementById('exercise4e-feedback');
                const targetPiece = exercise4eState.board[row][col];

                if (row === exercise4eState.targetPos.row && col === exercise4eState.targetPos.col && targetPiece) {
                    exercise4eState.board[row][col] = movingPiece;
                    exercise4eState.board[fromRow][fromCol] = null;
                    exercise4eState.completed = true;

                    feedback.className = 'exercise-feedback show correct';
                    feedback.innerHTML = '<p>正確！皇后吃掉了黑方的棋子！</p><p>Correct! The Queen captured the Black piece!</p>';
                    renderExercise4eBoard();
                } else {
                    feedback.className = 'exercise-feedback show incorrect';
                    feedback.innerHTML = '<p>這不是皇后的吃掉走法。請重試！</p><p>That\'s not a Queen capture. Try again!</p>';
                }
                exercise4eState.selectedSquare = null;
                renderExercise4eBoard();
                return;
            }
        }

        exercise4eState.selectedSquare = null;
        renderExercise4eBoard();
    }

    if (piece && piece.piece === 'queen' && piece.color === 'white') {
        exercise4eState.selectedSquare = { row, col };
        renderExercise4eBoard();

        const board = document.getElementById('exercise4e-board');
        const squares = board.querySelectorAll('.square');
        const selectedSq = Array.from(squares).find(sq =>
            parseInt(sq.dataset.row) === row && parseInt(sq.dataset.col) === col
        );
        if (selectedSq) selectedSq.classList.add('selected');

        // Highlight valid moves
        const validMoves = getQueenMovesForExercise4e(row, col);
        validMoves.forEach(move => {
            const moveSq = Array.from(squares).find(sq =>
                parseInt(sq.dataset.row) === move.row && parseInt(sq.dataset.col) === move.col
            );
            if (moveSq) moveSq.classList.add('valid-move');
        });
    }
}

function getQueenMovesForExercise4e(row, col) {
    const moves = [];
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];

    for (const [drow, dcol] of directions) {
        let newRow = row + drow;
        let newCol = col + dcol;

        while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const target = exercise4eState.board[newRow][newCol];
            if (!target) {
                moves.push({ row: newRow, col: newCol });
            } else {
                if (target.color === 'black') {
                    moves.push({ row: newRow, col: newCol });
                }
                break;
            }
            newRow += drow;
            newCol += dcol;
        }
    }

    return moves;
}

function resetExercise4e() {
    exercise4eState = {
        board: Array(8).fill(null).map(() => Array(8).fill(null)),
        queenPos: { row: 0, col: 3 },
        targetPos: { row: 7, col: 3 },
        selectedSquare: null,
        completed: false
    };
    exercise4eState.board[0][3] = { piece: 'queen', color: 'white' };
    exercise4eState.board[7][3] = { piece: 'pawn', color: 'black' };
    document.getElementById('exercise4e-feedback').className = 'exercise-feedback';
    initExercise4e();
}

// Promotion Dialog
let promotionPending = null;

function showPromotionDialog(color, row, col, isExercise) {
    const dialog = document.getElementById('promotion-dialog');
    const optionsContainer = document.getElementById('promotion-options');

    promotionPending = { color, row, col, isExercise };

    const pieces = [
        { piece: 'queen', name_en: 'Queen', name_zh: '皇后', symbol: color === 'white' ? '♕' : '♛' },
        { piece: 'rook', name_en: 'Rook', name_zh: '城堡', symbol: color === 'white' ? '♖' : '♜' },
        { piece: 'bishop', name_en: 'Bishop', name_zh: '象', symbol: color === 'white' ? '♗' : '♝' },
        { piece: 'knight', name_en: 'Knight', name_zh: '馬', symbol: color === 'white' ? '♘' : '♞' }
    ];

    optionsContainer.innerHTML = '';

    pieces.forEach(p => {
        const option = document.createElement('div');
        option.className = 'promotion-option';
        option.innerHTML = `
            <div class="piece-symbol">${p.symbol}</div>
            <div class="piece-name">${p.name_zh} / ${p.name_en}</div>
        `;
        option.onclick = () => selectPromotion(p.piece);
        optionsContainer.appendChild(option);
    });

    dialog.classList.add('show');
}

function selectPromotion(pieceType) {
    const dialog = document.getElementById('promotion-dialog');
    dialog.classList.remove('show');

    if (!promotionPending) return;

    const { color, row, col, isExercise } = promotionPending;

    if (isExercise) {
        // Exercise 3b promotion
        exercise3bState.board[row][col] = { piece: pieceType, color };
        exercise3bState.completed = true;
        exercise3bState.waitingForPromotion = false;
        renderExercise3bBoard();

        const pieceName = {
            queen: '皇后 / Queen',
            rook: '城堡 / Rook',
            bishop: '象 / Bishop',
            knight: '馬 / Knight'
        }[pieceType];

        const feedback = document.getElementById('exercise3b-feedback');
        feedback.className = 'exercise-feedback show correct';
        feedback.innerHTML = `<p>太好了！你的兵已升變成${pieceName}！</p><p>Great! Your pawn has been promoted to a ${pieceName.split('/')[1].trim()}!</p>`;
    } else {
        // Game mode promotion
        gameState.board[row][col] = { piece: pieceType, color };

        // Record move
        const toSquare = String.fromCharCode(97 + col) + (row + 1);
        const moveNotation = `P${toSquare}=${getPieceLetter(pieceType)}`;
        gameState.moveHistory.push(moveNotation);
        updateMoveHistory();

        // Switch turn
        gameState.currentTurn = gameState.currentTurn === 'white' ? 'black' : 'white';
        updateTurnIndicator();

        renderGameBoard();

        const pieceName = {
            queen: '皇后 / Queen',
            rook: '城堡 / Rook',
            bishop: '象 / Bishop',
            knight: '馬 / Knight'
        }[pieceType];

        const message = document.getElementById('game-message');
        message.className = 'game-message show check';
        message.innerHTML = `<p>兵升變成${pieceName}！/ Pawn promoted to ${pieceName.split('/')[1].trim()}!</p>`;
        setTimeout(() => {
            message.className = 'game-message';
            checkGameStatus();
        }, 2000);
    }

    promotionPending = null;
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderPieces();
    initBoardNotation();
    initExercise1();
    initExercise1b();
    initExercise1c();
    initExercise1d();
    initExercise1e();
    initExercise1f();
    initExercise2();
    initExercise3a();
    initExercise3b();
    initExercise4a();
    initExercise4b();
    initExercise4c();
    initExercise4d();
    initExercise4e();
    initGame();
});