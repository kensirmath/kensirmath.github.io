// Language translations
const textContent = {
    en: {
        app_title: "Chinese Chess Xiangqi Tutorial",
        home: "Home",
        board_setup: "Board Setup",
        general: "General",
        advisor: "Advisor",
        elephant: "Elephant",
        horse: "Horse",
        chariot: "Chariot",
        cannon: "Cannon",
        soldier: "Soldier",
        full_game: "Full Game",
        rules: "Special Rules",
        welcome: "Welcome to Xiangqi",
        start_learning: "Start Learning",
        new_game: "New Game",
        undo: "Undo",
        swap_colors: "Swap Colors",
        move_history: "Move History",
        captures: "Captures",
        red_turn: "Red's Turn",
        black_turn: "Black's Turn",
        check: "CHECK!",
        checkmate: "CHECKMATE!",
        game_over: "Game Over",
        red_wins: "Red Wins!",
        black_wins: "Black Wins!",
        practice_capture: "Practice Capture",
        correct: "Correct!",
        invalid: "Invalid Move",
        reset: "Reset"
    },
    zh_simple: {
        app_title: "中国象棋初学者教程",
        home: "主页",
        board_setup: "棋盘设置",
        general: "帅",
        advisor: "士",
        elephant: "象",
        horse: "马",
        chariot: "车",
        cannon: "炮",
        soldier: "兵",
        full_game: "完整棋局",
        rules: "特殊规则",
        welcome: "欢迎学习中国象棋",
        start_learning: "开始学习",
        new_game: "新游戏",
        undo: "悔棋",
        swap_colors: "交换棋位",
        move_history: "着法记录",
        captures: "被吃的棋子",
        red_turn: "红方轮到",
        black_turn: "黑方轮到",
        check: "将军！",
        checkmate: "将死！",
        game_over: "游戏结束",
        red_wins: "红方胜！",
        black_wins: "黑方胜！",
        practice_capture: "练习吃子",
        correct: "正确！",
        invalid: "非法着法",
        reset: "重置"
    },
    zh_trad: {
        app_title: "中國象棋初學者教程",
        home: "首頁",
        board_setup: "棋盤設置",
        general: "帥",
        advisor: "士",
        elephant: "象",
        horse: "馬",
        chariot: "車",
        cannon: "砲",
        soldier: "兵",
        full_game: "完整棋局",
        rules: "特殊規則",
        welcome: "歡迎學習中國象棋",
        start_learning: "開始學習",
        new_game: "新遊戲",
        undo: "悔棋",
        swap_colors: "交換棋位",
        move_history: "著法記錄",
        captures: "被吃的棋子",
        red_turn: "紅方輪到",
        black_turn: "黑方輪到",
        check: "將軍！",
        checkmate: "將死！",
        game_over: "遊戲結束",
        red_wins: "紅方勝！",
        black_wins: "黑方勝！",
        practice_capture: "練習吃子",
        correct: "正確！",
        invalid: "非法著法",
        reset: "重置"
    }
};

let currentLanguage = 'zh_trad';

function setLanguage(langCode) {
    let langKey;
    switch (langCode) {
        case 'en': langKey = 'en'; break;
        case 'zh-cn': langKey = 'zh_simple'; break;
        case 'zh-tw': langKey = 'zh_trad'; break;
        default: langKey = 'zh_simple';
    }
    currentLanguage = langKey;
    // Update all page text
    updatePageText();
    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang-code') === langCode);
    });
    // Log language change for debugging
    console.log('Language changed to:', langKey);
}

// Board configuration
const BOARD_WIDTH = 450;
const BOARD_HEIGHT = 500;
const MARGIN = 30;
const CELL_SIZE = 45;
const PIECE_RADIUS = 18;

// Piece types and colors
const PIECES = {
    RED_GENERAL: { name: '帅', color: 'red', type: 'general' },
    BLACK_GENERAL: { name: '将', color: 'black', type: 'general' },
    RED_ADVISOR: { name: '仕', color: 'red', type: 'advisor' },
    BLACK_ADVISOR: { name: '士', color: 'black', type: 'advisor' },
    RED_ELEPHANT: { name: '相', color: 'red', type: 'elephant' },
    BLACK_ELEPHANT: { name: '象', color: 'black', type: 'elephant' },
    RED_HORSE: { name: '马', color: 'red', type: 'horse' },
    BLACK_HORSE: { name: '马', color: 'black', type: 'horse' },
    RED_CHARIOT: { name: '车', color: 'red', type: 'chariot' },
    BLACK_CHARIOT: { name: '车', color: 'black', type: 'chariot' },
    RED_CANNON: { name: '炮', color: 'red', type: 'cannon' },
    BLACK_CANNON: { name: '砲', color: 'black', type: 'cannon' },
    RED_SOLDIER: { name: '兵', color: 'red', type: 'soldier' },
    BLACK_SOLDIER: { name: '卒', color: 'black', type: 'soldier' }
};

// Board state management
let boardStates = {};

// Full game state
let gameState = {
    pieces: [],
    currentPlayer: 'red',
    selectedPiece: null,
    validMoves: [],
    moveHistory: [],
    capturedPieces: { red: [], black: [] },
    isCheck: false,
    isCheckmate: false,
    boardFlipped: false,
    stateHistory: [] // Store complete game states for undo
};

const PIECE_VALUES = {
    general: 0,
    advisor: 2,
    elephant: 2,
    horse: 4,
    chariot: 9,
    cannon: 4.5,
    soldier: 1
};

// Initialize board state for a specific board
function initBoardState(boardId, pieces) {
    boardStates[boardId] = {
        pieces: pieces,
        selectedPiece: null,
        validMoves: []
    };
}

// Navigation
function navigateTo(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    const btn = document.querySelector(`[data-section="${sectionId}"]`);
    if (btn) btn.classList.add('active');
    gameState.currentPage = sectionId;
    console.log('Page changed to: ', sectionId);
    updatePageText();
}

document.addEventListener('DOMContentLoaded', () => {
    // Language switcher
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.getAttribute('data-lang-code'));
        });
    });
    // Sidebar navigation menu
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            navigateTo(btn.getAttribute('data-section'));
        });
    });
    // Initialize game state
    gameState.currentPage = 'home';
    gameState.currentLanguage = 'zh_simple';
    // Initialize boards
    initSetupBoard();
    initGeneralBoard();
    initGeneralCaptureBoard();
    initAdvisorBoard();
    initAdvisorCaptureBoard();
    initElephantBoard();
    initElephantCaptureBoard();
    initHorseBoard();
    initHorseCaptureBoard();
    initChariotBoard();
    initChariotCaptureBoard();
    initCannonBoard();
    initCannonCaptureBoard();
    initSoldierBoard();
    initSoldierCaptureBoard();
    initFlyingGeneralBoard();
    initFullGameBoard();
    updatePageText();
});

// Draw the Xiangqi board
function drawBoard(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = '#f5e6d3';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;

    // Horizontal lines
    for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo(MARGIN, MARGIN + i * CELL_SIZE);
        ctx.lineTo(MARGIN + 8 * CELL_SIZE, MARGIN + i * CELL_SIZE);
        ctx.stroke();
    }

    // Vertical lines
    for (let i = 0; i < 9; i++) {
        // Top half
        ctx.beginPath();
        ctx.moveTo(MARGIN + i * CELL_SIZE, MARGIN);
        ctx.lineTo(MARGIN + i * CELL_SIZE, MARGIN + 4 * CELL_SIZE);
        ctx.stroke();

        // Bottom half
        ctx.beginPath();
        ctx.moveTo(MARGIN + i * CELL_SIZE, MARGIN + 5 * CELL_SIZE);
        ctx.lineTo(MARGIN + i * CELL_SIZE, MARGIN + 9 * CELL_SIZE);
        ctx.stroke();
    }

    // Draw palace diagonals
    ctx.lineWidth = 1;

    // Top palace (Black)
    ctx.beginPath();
    ctx.moveTo(MARGIN + 3 * CELL_SIZE, MARGIN);
    ctx.lineTo(MARGIN + 5 * CELL_SIZE, MARGIN + 2 * CELL_SIZE);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(MARGIN + 5 * CELL_SIZE, MARGIN);
    ctx.lineTo(MARGIN + 3 * CELL_SIZE, MARGIN + 2 * CELL_SIZE);
    ctx.stroke();

    // Bottom palace (Red)
    ctx.beginPath();
    ctx.moveTo(MARGIN + 3 * CELL_SIZE, MARGIN + 7 * CELL_SIZE);
    ctx.lineTo(MARGIN + 5 * CELL_SIZE, MARGIN + 9 * CELL_SIZE);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(MARGIN + 5 * CELL_SIZE, MARGIN + 7 * CELL_SIZE);
    ctx.lineTo(MARGIN + 3 * CELL_SIZE, MARGIN + 9 * CELL_SIZE);
    ctx.stroke();

    // Draw river text
    ctx.fillStyle = '#6b9bd1';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('楚河', MARGIN + 2 * CELL_SIZE, MARGIN + 4.7 * CELL_SIZE);
    ctx.fillText('汉界', MARGIN + 6 * CELL_SIZE, MARGIN + 4.7 * CELL_SIZE);
}

// Draw a piece
function drawPiece(ctx, piece, x, y, isSelected = false) {
    const posX = MARGIN + x * CELL_SIZE;
    const posY = MARGIN + y * CELL_SIZE;

    // Draw piece circle
    ctx.beginPath();
    ctx.arc(posX, posY, PIECE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = piece.color === 'red' ? '#ffebee' : '#333';
    ctx.fill();
    ctx.strokeStyle = piece.color === 'red' ? '#c62828' : '#000';
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.stroke();

    // Draw piece text
    ctx.fillStyle = piece.color === 'red' ? '#c62828' : '#fff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(piece.name, posX, posY);
}

// Draw valid move indicators
function drawValidMoves(ctx, moves, captureMode = false) {
    moves.forEach(move => {
        const posX = MARGIN + move.x * CELL_SIZE;
        const posY = MARGIN + move.y * CELL_SIZE;

        if (move.isCapture) {
            // Yellow circle for capture moves (cannon)
            ctx.beginPath();
            ctx.arc(posX, posY, 8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 193, 7, 0.7)';
            ctx.fill();
            ctx.strokeStyle = '#ff8f00';
            ctx.lineWidth = 2;
            ctx.stroke();
        } else {
            // Green circle for normal moves
            ctx.beginPath();
            ctx.arc(posX, posY, 8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(76, 175, 80, 0.6)';
            ctx.fill();
            ctx.strokeStyle = '#2e7d32';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });
}

function checkQuizAnswer(element, isCorrect, quizId) {
    if (answeredQuizzes[quizId]) return;

    answeredQuizzes[quizId] = true;

    if (isCorrect) {
        element.classList.add('correct');
        element.innerHTML += ' ✓ 正确！ Correct!';
    } else {
        element.classList.add('incorrect');
        element.innerHTML += ' ✗ 错误 Incorrect';

        // Show correct answer
        setTimeout(() => {
            const options = element.parentElement.querySelectorAll('.quiz-option');
            options.forEach(opt => {
                if (opt !== element && !opt.classList.contains('incorrect')) {
                    opt.classList.add('correct');
                }
            });
        }, 500);
    }
}

// Make globally available
window.navigateTo = navigateTo;
window.resetBoard = resetBoard;
window.checkQuizAnswer = checkQuizAnswer;

// Text update for all page elements
function updatePageText() {
    // Header/title
    document.querySelectorAll('[data-lang="title"]').forEach(el => el.textContent = textContent[currentLanguage].app_title);
    // Subtitle (static for demo)
    document.querySelectorAll('[data-lang="subtitle"]').forEach(el => {
        if (currentLanguage === "en") {
            el.textContent = "Learn the Ancient Game of Strategy";
        } else {
            el.textContent = currentLanguage === "zh_simple" ? "学习古老的策略游戏" : "學習古老的策略遊戲";
        }
    });
    // Sidebar navigation
    const navMap = [
        "home",
        "board_setup",
        "general",
        "advisor",
        "elephant",
        "horse",
        "chariot",
        "cannon",
        "soldier",
        "rules",
        "full_game"
    ];
    navMap.forEach(key => {
        document.querySelectorAll(`[data-nav="${key}"]`).forEach(el => {
            el.textContent = textContent[currentLanguage][key];
        });
    });
    // Full-game section labels/buttons
    document.querySelectorAll('[data-lang="fullgame-title"]').forEach(el => el.textContent = textContent[currentLanguage].full_game + ' Practice');
    document.querySelectorAll('[data-lang="btn-newgame"]').forEach(el => el.textContent = textContent[currentLanguage].new_game);
    document.querySelectorAll('[data-lang="btn-undo"]').forEach(el => el.textContent = textContent[currentLanguage].undo);
    document.querySelectorAll('[data-lang="btn-swap"]').forEach(el => el.textContent = textContent[currentLanguage].swap_colors);
    document.querySelectorAll('[data-lang="current-turn"]').forEach(el => {
        const turn = gameState.currentPlayer === 'red' ? textContent[currentLanguage].red_turn : textContent[currentLanguage].black_turn;
        el.textContent = turn;
    });
    document.querySelectorAll('[data-lang="move-history"]').forEach(el => el.textContent = textContent[currentLanguage].move_history);
    document.querySelectorAll('[data-lang="captured-pieces"]').forEach(el => el.textContent = textContent[currentLanguage].captures);
    document.querySelectorAll('[data-lang="material-count"]').forEach(el => el.textContent = 'Material');
}

// Get piece at position
function getPieceAt(pieces, x, y) {
    return pieces.find(p => p.x === x && p.y === y);
}

// Check if position is in palace
function isInPalace(x, y, color) {
    const inPalaceX = x >= 3 && x <= 5;
    if (color === 'red') {
        return inPalaceX && y >= 7 && y <= 9;
    } else {
        return inPalaceX && y >= 0 && y <= 2;
    }
}

// Get valid moves for General
function getGeneralMoves(piece, pieces) {
    const moves = [];
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    directions.forEach(([dx, dy]) => {
        const newX = piece.x + dx;
        const newY = piece.y + dy;

        if (newX >= 0 && newX < 9 && newY >= 0 && newY < 10 &&
            isInPalace(newX, newY, piece.color)) {
            const targetPiece = getPieceAt(pieces, newX, newY);
            if (!targetPiece || targetPiece.color !== piece.color) {
                // Check flying general rule
                if (!wouldViolateFlyingGeneral(pieces, piece, newX, newY)) {
                    moves.push({ x: newX, y: newY });
                }
            }
        }
    });

    return moves;
}

// Check if move would violate flying general rule
function wouldViolateFlyingGeneral(pieces, movingPiece, newX, newY) {
    // Create temporary pieces array with the move applied
    const tempPieces = pieces.filter(p => !(p.x === movingPiece.x && p.y === movingPiece.y));
    tempPieces.push({ ...movingPiece, x: newX, y: newY });

    // Find both generals
    const redGeneral = tempPieces.find(p => p.type === 'general' && p.color === 'red');
    const blackGeneral = tempPieces.find(p => p.type === 'general' && p.color === 'black');

    if (!redGeneral || !blackGeneral) return false;

    // Check if they're on the same file
    if (redGeneral.x !== blackGeneral.x) return false;

    // Check if there are any pieces between them
    const minY = Math.min(redGeneral.y, blackGeneral.y);
    const maxY = Math.max(redGeneral.y, blackGeneral.y);

    for (let y = minY + 1; y < maxY; y++) {
        if (getPieceAt(tempPieces, redGeneral.x, y)) {
            return false; // There's a piece between, so it's OK
        }
    }

    return true; // No pieces between, violates flying general rule
}

// Get valid moves for Advisor
function getAdvisorMoves(piece, pieces) {
    const moves = [];
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

    directions.forEach(([dx, dy]) => {
        const newX = piece.x + dx;
        const newY = piece.y + dy;

        if (newX >= 0 && newX < 9 && newY >= 0 && newY < 10 &&
            isInPalace(newX, newY, piece.color)) {
            const targetPiece = getPieceAt(pieces, newX, newY);
            if (!targetPiece || targetPiece.color !== piece.color) {
                moves.push({ x: newX, y: newY });
            }
        }
    });

    return moves;
}

// Get valid moves for Elephant
function getElephantMoves(piece, pieces) {
    const moves = [];
    const directions = [[2, 2], [2, -2], [-2, 2], [-2, -2]];

    directions.forEach(([dx, dy]) => {
        const newX = piece.x + dx;
        const newY = piece.y + dy;
        const blockX = piece.x + dx / 2;
        const blockY = piece.y + dy / 2;

        // Check if move is within bounds
        if (newX >= 0 && newX < 9 && newY >= 0 && newY < 10) {
            // Check if elephant crosses river
            const crossesRiver = (piece.color === 'red' && newY < 5) ||
                (piece.color === 'black' && newY > 4);

            if (!crossesRiver) {
                // Check if blocked
                const blockingPiece = getPieceAt(pieces, blockX, blockY);
                if (!blockingPiece) {
                    const targetPiece = getPieceAt(pieces, newX, newY);
                    if (!targetPiece || targetPiece.color !== piece.color) {
                        moves.push({ x: newX, y: newY });
                    }
                }
            }
        }
    });

    return moves;
}

// Get valid moves for Horse
function getHorseMoves(piece, pieces) {
    const moves = [];
    const horseMoves = [
        { dx: 1, dy: 2, blockX: 0, blockY: 1 },
        { dx: 1, dy: -2, blockX: 0, blockY: -1 },
        { dx: -1, dy: 2, blockX: 0, blockY: 1 },
        { dx: -1, dy: -2, blockX: 0, blockY: -1 },
        { dx: 2, dy: 1, blockX: 1, blockY: 0 },
        { dx: 2, dy: -1, blockX: 1, blockY: 0 },
        { dx: -2, dy: 1, blockX: -1, blockY: 0 },
        { dx: -2, dy: -1, blockX: -1, blockY: 0 }
    ];

    horseMoves.forEach(move => {
        const newX = piece.x + move.dx;
        const newY = piece.y + move.dy;
        const blockX = piece.x + move.blockX;
        const blockY = piece.y + move.blockY;

        if (newX >= 0 && newX < 9 && newY >= 0 && newY < 10) {
            // Check if horse leg is blocked
            const blockingPiece = getPieceAt(pieces, blockX, blockY);
            if (!blockingPiece) {
                const targetPiece = getPieceAt(pieces, newX, newY);
                if (!targetPiece || targetPiece.color !== piece.color) {
                    moves.push({ x: newX, y: newY });
                }
            }
        }
    });

    return moves;
}

// Get valid moves for Chariot
function getChariotMoves(piece, pieces) {
    const moves = [];
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    directions.forEach(([dx, dy]) => {
        let distance = 1;
        while (true) {
            const newX = piece.x + dx * distance;
            const newY = piece.y + dy * distance;

            if (newX < 0 || newX >= 9 || newY < 0 || newY >= 10) break;

            const targetPiece = getPieceAt(pieces, newX, newY);
            if (targetPiece) {
                if (targetPiece.color !== piece.color) {
                    moves.push({ x: newX, y: newY });
                }
                break;
            }

            moves.push({ x: newX, y: newY });
            distance++;
        }
    });

    return moves;
}

// Get valid moves for Cannon
function getCannonMoves(piece, pieces) {
    const moves = [];
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    directions.forEach(([dx, dy]) => {
        let distance = 1;
        let jumpedOver = false;

        while (true) {
            const newX = piece.x + dx * distance;
            const newY = piece.y + dy * distance;

            if (newX < 0 || newX >= 9 || newY < 0 || newY >= 10) break;

            const targetPiece = getPieceAt(pieces, newX, newY);

            if (!jumpedOver) {
                // Before jumping: normal movement
                if (targetPiece) {
                    jumpedOver = true;
                } else {
                    moves.push({ x: newX, y: newY, isCapture: false });
                }
            } else {
                // After jumping: can only capture
                if (targetPiece) {
                    if (targetPiece.color !== piece.color) {
                        moves.push({ x: newX, y: newY, isCapture: true });
                    }
                    break;
                }
            }

            distance++;
        }
    });

    return moves;
}

// Get valid moves for Soldier
function getSoldierMoves(piece, pieces) {
    const moves = [];
    const hasCorossedRiver = (piece.color === 'red' && piece.y < 5) ||
        (piece.color === 'black' && piece.y > 4);

    // Forward direction
    const forwardY = piece.color === 'red' ? piece.y - 1 : piece.y + 1;
    if (forwardY >= 0 && forwardY < 10) {
        const targetPiece = getPieceAt(pieces, piece.x, forwardY);
        if (!targetPiece || targetPiece.color !== piece.color) {
            moves.push({ x: piece.x, y: forwardY });
        }
    }

    // Sideways movement after crossing river
    if (hasCorossedRiver) {
        [[1, 0], [-1, 0]].forEach(([dx, dy]) => {
            const newX = piece.x + dx;
            const newY = piece.y + dy;

            if (newX >= 0 && newX < 9) {
                const targetPiece = getPieceAt(pieces, newX, newY);
                if (!targetPiece || targetPiece.color !== piece.color) {
                    moves.push({ x: newX, y: newY });
                }
            }
        });
    }

    return moves;
}

// Get valid moves based on piece type
function getValidMoves(piece, pieces) {
    switch (piece.type) {
        case 'general': return getGeneralMoves(piece, pieces);
        case 'advisor': return getAdvisorMoves(piece, pieces);
        case 'elephant': return getElephantMoves(piece, pieces);
        case 'horse': return getHorseMoves(piece, pieces);
        case 'chariot': return getChariotMoves(piece, pieces);
        case 'cannon': return getCannonMoves(piece, pieces);
        case 'soldier': return getSoldierMoves(piece, pieces);
        default: return [];
    }
}

// Setup board with all pieces
function initSetupBoard() {
    const canvas = document.getElementById('setupBoard');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const pieces = [
        // Black pieces
        { ...PIECES.BLACK_CHARIOT, x: 0, y: 0 },
        { ...PIECES.BLACK_HORSE, x: 1, y: 0 },
        { ...PIECES.BLACK_ELEPHANT, x: 2, y: 0 },
        { ...PIECES.BLACK_ADVISOR, x: 3, y: 0 },
        { ...PIECES.BLACK_GENERAL, x: 4, y: 0 },
        { ...PIECES.BLACK_ADVISOR, x: 5, y: 0 },
        { ...PIECES.BLACK_ELEPHANT, x: 6, y: 0 },
        { ...PIECES.BLACK_HORSE, x: 7, y: 0 },
        { ...PIECES.BLACK_CHARIOT, x: 8, y: 0 },
        { ...PIECES.BLACK_CANNON, x: 1, y: 2 },
        { ...PIECES.BLACK_CANNON, x: 7, y: 2 },
        { ...PIECES.BLACK_SOLDIER, x: 0, y: 3 },
        { ...PIECES.BLACK_SOLDIER, x: 2, y: 3 },
        { ...PIECES.BLACK_SOLDIER, x: 4, y: 3 },
        { ...PIECES.BLACK_SOLDIER, x: 6, y: 3 },
        { ...PIECES.BLACK_SOLDIER, x: 8, y: 3 },

        // Red pieces
        { ...PIECES.RED_SOLDIER, x: 0, y: 6 },
        { ...PIECES.RED_SOLDIER, x: 2, y: 6 },
        { ...PIECES.RED_SOLDIER, x: 4, y: 6 },
        { ...PIECES.RED_SOLDIER, x: 6, y: 6 },
        { ...PIECES.RED_SOLDIER, x: 8, y: 6 },
        { ...PIECES.RED_CANNON, x: 1, y: 7 },
        { ...PIECES.RED_CANNON, x: 7, y: 7 },
        { ...PIECES.RED_CHARIOT, x: 0, y: 9 },
        { ...PIECES.RED_HORSE, x: 1, y: 9 },
        { ...PIECES.RED_ELEPHANT, x: 2, y: 9 },
        { ...PIECES.RED_ADVISOR, x: 3, y: 9 },
        { ...PIECES.RED_GENERAL, x: 4, y: 9 },
        { ...PIECES.RED_ADVISOR, x: 5, y: 9 },
        { ...PIECES.RED_ELEPHANT, x: 6, y: 9 },
        { ...PIECES.RED_HORSE, x: 7, y: 9 },
        { ...PIECES.RED_CHARIOT, x: 8, y: 9 }
    ];

    drawBoard(canvas, ctx);
    pieces.forEach(piece => drawPiece(ctx, piece, piece.x, piece.y));
}

// Initialize General board
function initGeneralBoard() {
    const canvas = document.getElementById('generalBoard');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const pieces = [{ ...PIECES.RED_GENERAL, x: 4, y: 8 }];

    initBoardState('general', pieces);
    renderBoard(canvas, ctx, 'general');
    setupBoardInteraction(canvas, 'general', 'generalFeedback');
}

// Initialize Advisor board (corrected position - shifted right)
function initAdvisorBoard() {
    const canvas = document.getElementById('advisorBoard');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const pieces = [{ ...PIECES.RED_ADVISOR, x: 3, y: 9 }]; // Corrected: shifted left to x:3

    initBoardState('advisor', pieces);
    renderBoard(canvas, ctx, 'advisor');
    setupBoardInteraction(canvas, 'advisor', 'advisorFeedback');
}

// Initialize Advisor Capture Practice Board
function initAdvisorCaptureBoard() {
    const canvas = document.getElementById('advisorCaptureBoard');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const pieces = [
        { ...PIECES.RED_ADVISOR, x: 3, y: 9 },
        { ...PIECES.BLACK_SOLDIER, x: 5, y: 7 } // Target to capture
    ];

    initBoardState('advisorCapture', pieces);
    renderBoard(canvas, ctx, 'advisorCapture');
    setupBoardInteraction(canvas, 'advisorCapture', 'advisorCaptureFeedback', (moved, captured) => {
        if (captured && captured.type === 'soldier' && captured.color === 'black') {
            return { success: true, message: '太棒了！正确使用士吃子！ Excellent! Correct advisor capture!' };
        }
        return null;
    });
}

// Initialize General Capture Practice Board
function initGeneralCaptureBoard() {
    const canvas = document.getElementById('generalCaptureBoard');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const pieces = [
        { ...PIECES.RED_GENERAL, x: 4, y: 8 },
        { ...PIECES.BLACK_CHARIOT, x: 4, y: 3 } // Threat on same file
    ];

    initBoardState('generalCapture', pieces);
    renderBoard(canvas, ctx, 'generalCapture');
    setupBoardInteraction(canvas, 'generalCapture', 'generalCaptureFeedback', (moved, captured) => {
        if (moved && (moved.x !== 4)) {
            return { success: true, message: '好！将帅躲开了威胁！ Good! General avoided the threat!' };
        } else {
            return { message: '将帅仍受到威胁！ General is still in threat!' };
        }
    });
}

// Initialize Chariot Capture Practice Board
function initChariotCaptureBoard() {
    const canvas = document.getElementById('chariotCaptureBoard');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const pieces = [
        { ...PIECES.RED_CHARIOT, x: 2, y: 5 },
        { ...PIECES.BLACK_HORSE, x: 7, y: 5 } // Target on same rank
    ];

    initBoardState('chariotCapture', pieces);
    renderBoard(canvas, ctx, 'chariotCapture');
    setupBoardInteraction(canvas, 'chariotCapture', 'chariotCaptureFeedback', (moved, captured) => {
        if (captured && captured.type === 'horse' && captured.color === 'black') {
            return { success: true, message: '太棒了！正确使用车吃子！ Excellent! Correct chariot capture!' };
        }
        return null;
    });
}

// Initialize Horse Capture Practice Board
function initHorseCaptureBoard() {
    const canvas = document.getElementById('horseCaptureBoard');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const pieces = [
        { ...PIECES.RED_HORSE, x: 4, y: 5 },
        { ...PIECES.BLACK_SOLDIER, x: 5, y: 3 } // Target in L-shape
    ];

    initBoardState('horseCapture', pieces);
    renderBoard(canvas, ctx, 'horseCapture');
    setupBoardInteraction(canvas, 'horseCapture', 'horseCaptureFeedback', (moved, captured) => {
        if (captured && captured.type === 'soldier' && captured.color === 'black') {
            return { success: true, message: '太棒了！正确使用马吃子！ Excellent! Correct horse capture!' };
        }
        return null;
    });
}

// Initialize Elephant Capture Practice Board
function initElephantCaptureBoard() {
    const canvas = document.getElementById('elephantCaptureBoard');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const pieces = [
        { ...PIECES.RED_ELEPHANT, x: 4, y: 7 },
        { ...PIECES.BLACK_SOLDIER, x: 6, y: 5 } // Target diagonal
    ];

    initBoardState('elephantCapture', pieces);
    renderBoard(canvas, ctx, 'elephantCapture');
    setupBoardInteraction(canvas, 'elephantCapture', 'elephantCaptureFeedback', (moved, captured) => {
        if (captured && captured.type === 'soldier' && captured.color === 'black') {
            return { success: true, message: '太棒了！正确使用象吃子！ Excellent! Correct elephant capture!' };
        }
        return null;
    });
}

// Initialize Cannon Capture Practice Board
function initCannonCaptureBoard() {
    const canvas = document.getElementById('cannonCaptureBoard');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const pieces = [
        { ...PIECES.RED_CANNON, x: 2, y: 7 },
        { ...PIECES.RED_SOLDIER, x: 2, y: 6 }, // Mount
        { ...PIECES.BLACK_ELEPHANT, x: 2, y: 4 } // Target
    ];

    initBoardState('cannonCapture', pieces);
    renderBoard(canvas, ctx, 'cannonCapture');
    setupBoardInteraction(canvas, 'cannonCapture', 'cannonCaptureFeedback', (moved, captured) => {
        if (captured && captured.type === 'elephant' && captured.color === 'black') {
            return { success: true, message: '太棒了！正确使用炮吃子！ Excellent! Correct cannon capture!' };
        }
        return null;
    });
}

// Initialize Soldier Capture Practice Board
function initSoldierCaptureBoard() {
    const canvas = document.getElementById('soldierCaptureBoard');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const pieces = [
        { ...PIECES.RED_SOLDIER, x: 4, y: 6 },
        { ...PIECES.BLACK_SOLDIER, x: 5, y: 4 } // Target after crossing river
    ];

    initBoardState('soldierCapture', pieces);
    renderBoard(canvas, ctx, 'soldierCapture');
    setupBoardInteraction(canvas, 'soldierCapture', 'soldierCaptureFeedback', (moved, captured) => {
        if (captured && captured.type === 'soldier' && captured.color === 'black') {
            return { success: true, message: '太棒了！正确使用兵吃子！ Excellent! Correct soldier capture!' };
        }
        return null;
    });
}

// Initialize Elephant board
function initElephantBoard() {
    const canvas = document.getElementById('elephantBoard');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const pieces = [
        { ...PIECES.RED_ELEPHANT, x: 4, y: 7 },
        { ...PIECES.BLACK_SOLDIER, x: 5, y: 6 } // Blocking piece
    ];

    initBoardState('elephant', pieces);
    renderBoard(canvas, ctx, 'elephant');
    setupBoardInteraction(canvas, 'elephant', 'elephantFeedback');
}

// Initialize Horse board
function initHorseBoard() {
    const canvas = document.getElementById('horseBoard');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const pieces = [
        { ...PIECES.RED_HORSE, x: 4, y: 5 },
        { ...PIECES.BLACK_SOLDIER, x: 4, y: 4 } // Blocking piece
    ];

    initBoardState('horse', pieces);
    renderBoard(canvas, ctx, 'horse');
    setupBoardInteraction(canvas, 'horse', 'horseFeedback');
}

// Initialize Chariot board
function initChariotBoard() {
    const canvas = document.getElementById('chariotBoard');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const pieces = [
        { ...PIECES.RED_CHARIOT, x: 4, y: 5 },
        { ...PIECES.BLACK_SOLDIER, x: 4, y: 2 },
        { ...PIECES.BLACK_SOLDIER, x: 7, y: 5 }
    ];

    initBoardState('chariot', pieces);
    renderBoard(canvas, ctx, 'chariot');
    setupBoardInteraction(canvas, 'chariot', 'chariotFeedback');
}

// Initialize Cannon board
function initCannonBoard() {
    const canvas = document.getElementById('cannonBoard');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const pieces = [
        { ...PIECES.RED_CANNON, x: 2, y: 5 },
        { ...PIECES.RED_SOLDIER, x: 5, y: 5 }, // Mount
        { ...PIECES.BLACK_HORSE, x: 7, y: 5 }, // Target
        { ...PIECES.BLACK_SOLDIER, x: 2, y: 2 }
    ];

    initBoardState('cannon', pieces);
    renderBoard(canvas, ctx, 'cannon');
    setupBoardInteraction(canvas, 'cannon', 'cannonFeedback');
}

// Initialize Soldier board
function initSoldierBoard() {
    const canvas = document.getElementById('soldierBoard');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const pieces = [
        { ...PIECES.RED_SOLDIER, x: 4, y: 6 }
    ];

    initBoardState('soldier', pieces);
    renderBoard(canvas, ctx, 'soldier');
    setupBoardInteraction(canvas, 'soldier', 'soldierFeedback');
}

// Initialize Flying General board
function initFlyingGeneralBoard() {
    const canvas = document.getElementById('flyingGeneralBoard');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const pieces = [
        { ...PIECES.RED_GENERAL, x: 5, y: 8 },
        { ...PIECES.BLACK_GENERAL, x: 4, y: 1 },
        //        { ...PIECES.RED_SOLDIER, x: 4, y: 5 } // Piece between generals
    ];

    initBoardState('flyingGeneral', pieces);
    renderBoard(canvas, ctx, 'flyingGeneral');
    setupBoardInteraction(canvas, 'flyingGeneral', 'flyingGeneralFeedback');
}



// Render board
function renderBoard(canvas, ctx, boardId) {
    const state = boardStates[boardId];
    if (!state) return;

    drawBoard(canvas, ctx);

    // Draw valid moves first
    if (state.validMoves.length > 0) {
        drawValidMoves(ctx, state.validMoves);
    }

    // Draw pieces
    state.pieces.forEach(piece => {
        const isSelected = state.selectedPiece &&
            piece.x === state.selectedPiece.x &&
            piece.y === state.selectedPiece.y;
        drawPiece(ctx, piece, piece.x, piece.y, isSelected);
    });
}

// Setup board interaction
function setupBoardInteraction(canvas, boardId, feedbackId, successCallback = null) {
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Convert to board coordinates
        const boardX = Math.round((clickX - MARGIN) / CELL_SIZE);
        const boardY = Math.round((clickY - MARGIN) / CELL_SIZE);

        if (boardX < 0 || boardX >= 9 || boardY < 0 || boardY >= 10) return;

        const state = boardStates[boardId];
        const ctx = canvas.getContext('2d');
        const feedback = document.getElementById(feedbackId);

        // Check if clicked on valid move
        const validMove = state.validMoves.find(m => m.x === boardX && m.y === boardY);
        if (validMove && state.selectedPiece) {
            // Move the piece
            const capturedPiece = getPieceAt(state.pieces, boardX, boardY);
            state.pieces = state.pieces.filter(p => !(p.x === boardX && p.y === boardY));

            const movedPiece = state.pieces.find(p =>
                p.x === state.selectedPiece.x && p.y === state.selectedPiece.y
            );
            if (movedPiece) {
                movedPiece.x = boardX;
                movedPiece.y = boardY;
            }

            state.selectedPiece = null;
            state.validMoves = [];

            renderBoard(canvas, ctx, boardId);

            // Check for success condition
            if (successCallback) {
                const result = successCallback(movedPiece, capturedPiece);
                if (result) {
                    feedback.className = result.success ? 'board-feedback success' : 'board-feedback error';
                    feedback.textContent = result.message;
                    return;
                }
            }

            feedback.className = 'board-feedback success';
            feedback.textContent = '移动成功！ Move successful!';
            return;
        }

        // Check if clicked on a piece
        const clickedPiece = getPieceAt(state.pieces, boardX, boardY);
        if (clickedPiece && clickedPiece.color === 'red') {
            state.selectedPiece = clickedPiece;
            state.validMoves = getValidMoves(clickedPiece, state.pieces);
            renderBoard(canvas, ctx, boardId);

            feedback.className = 'board-feedback info';
            if (state.validMoves.length > 0) {
                feedback.textContent = `可移动到 ${state.validMoves.length} 个位置 | ${state.validMoves.length} valid moves available`;
            } else {
                feedback.textContent = '此棋子无法移动 | This piece cannot move';
            }
        } else {
            state.selectedPiece = null;
            state.validMoves = [];
            renderBoard(canvas, ctx, boardId);
            feedback.className = 'board-feedback info';
            feedback.textContent = '点击红方棋子查看移动 | Click a red piece to see moves';
        }
    });
}

// Reset board
function resetBoard(boardId) {
    switch (boardId) {
        case 'general': initGeneralBoard(); break;
        case 'generalCapture': initGeneralCaptureBoard(); break;
        case 'advisor': initAdvisorBoard(); break;
        case 'advisorCapture': initAdvisorCaptureBoard(); break;
        case 'elephant': initElephantBoard(); break;
        case 'elephantCapture': initElephantCaptureBoard(); break;
        case 'horse': initHorseBoard(); break;
        case 'horseCapture': initHorseCaptureBoard(); break;
        case 'chariot': initChariotBoard(); break;
        case 'chariotCapture': initChariotCaptureBoard(); break;
        case 'cannon': initCannonBoard(); break;
        case 'cannonCapture': initCannonCaptureBoard(); break;
        case 'soldier': initSoldierBoard(); break;
        case 'soldierCapture': initSoldierCaptureBoard(); break;
        case 'flyingGeneral': initFlyingGeneralBoard(); break;
    }
}

// Full Game Board Functions
function initFullGameBoard() {
    const canvas = document.getElementById('fullGameBoard');
    if (!canvas) return;

    newGame();
}

function newGame() {
    gameState.stateHistory = []; // Clear history
    gameState.pieces = [
        // Black pieces
        { ...PIECES.BLACK_CHARIOT, x: 0, y: 0 },
        { ...PIECES.BLACK_HORSE, x: 1, y: 0 },
        { ...PIECES.BLACK_ELEPHANT, x: 2, y: 0 },
        { ...PIECES.BLACK_ADVISOR, x: 3, y: 0 },
        { ...PIECES.BLACK_GENERAL, x: 4, y: 0 },
        { ...PIECES.BLACK_ADVISOR, x: 5, y: 0 },
        { ...PIECES.BLACK_ELEPHANT, x: 6, y: 0 },
        { ...PIECES.BLACK_HORSE, x: 7, y: 0 },
        { ...PIECES.BLACK_CHARIOT, x: 8, y: 0 },
        { ...PIECES.BLACK_CANNON, x: 1, y: 2 },
        { ...PIECES.BLACK_CANNON, x: 7, y: 2 },
        { ...PIECES.BLACK_SOLDIER, x: 0, y: 3 },
        { ...PIECES.BLACK_SOLDIER, x: 2, y: 3 },
        { ...PIECES.BLACK_SOLDIER, x: 4, y: 3 },
        { ...PIECES.BLACK_SOLDIER, x: 6, y: 3 },
        { ...PIECES.BLACK_SOLDIER, x: 8, y: 3 },

        // Red pieces
        { ...PIECES.RED_SOLDIER, x: 0, y: 6 },
        { ...PIECES.RED_SOLDIER, x: 2, y: 6 },
        { ...PIECES.RED_SOLDIER, x: 4, y: 6 },
        { ...PIECES.RED_SOLDIER, x: 6, y: 6 },
        { ...PIECES.RED_SOLDIER, x: 8, y: 6 },
        { ...PIECES.RED_CANNON, x: 1, y: 7 },
        { ...PIECES.RED_CANNON, x: 7, y: 7 },
        { ...PIECES.RED_CHARIOT, x: 0, y: 9 },
        { ...PIECES.RED_HORSE, x: 1, y: 9 },
        { ...PIECES.RED_ELEPHANT, x: 2, y: 9 },
        { ...PIECES.RED_ADVISOR, x: 3, y: 9 },
        { ...PIECES.RED_GENERAL, x: 4, y: 9 },
        { ...PIECES.RED_ADVISOR, x: 5, y: 9 },
        { ...PIECES.RED_ELEPHANT, x: 6, y: 9 },
        { ...PIECES.RED_HORSE, x: 7, y: 9 },
        { ...PIECES.RED_CHARIOT, x: 8, y: 9 }
    ];

    gameState.currentPlayer = 'red';
    gameState.selectedPiece = null;
    gameState.validMoves = [];
    gameState.moveHistory = [];
    gameState.capturedPieces = { red: [], black: [] };
    gameState.isCheck = false;
    gameState.isCheckmate = false;

    updateGameDisplay();
    renderFullGameBoard();
}

function renderFullGameBoard() {
    const canvas = document.getElementById('fullGameBoard');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    drawBoard(canvas, ctx);

    // Transform valid moves if board is flipped
    if (gameState.validMoves.length > 0) {
        const displayMoves = gameState.boardFlipped
            ? gameState.validMoves.map(m => ({
                x: 8 - m.x,
                y: 9 - m.y,
                isCapture: m.isCapture
            }))
            : gameState.validMoves;
        drawValidMoves(ctx, displayMoves);
    }

    gameState.pieces.forEach(piece => {
        let displayX = piece.x;
        let displayY = piece.y;

        if (gameState.boardFlipped) {
            displayX = 8 - piece.x;
            displayY = 9 - piece.y;
        }

        const isSelected = gameState.selectedPiece &&
            piece.x === gameState.selectedPiece.x &&
            piece.y === gameState.selectedPiece.y;

        drawPiece(ctx, piece, displayX, displayY, isSelected);

        // Highlight if in check
        if (gameState.isCheck && piece.type === 'general' && piece.color === gameState.currentPlayer) {
            const posX = MARGIN + displayX * CELL_SIZE;
            const posY = MARGIN + displayY * CELL_SIZE;
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(posX, posY, PIECE_RADIUS + 4, 0, Math.PI * 2);
            ctx.stroke();
        }
    });
}

function updateGameDisplay() {
    const turnEl = document.getElementById('currentTurn');
    if (turnEl) {
        const turnText = gameState.currentPlayer === 'red' ? textContent[currentLanguage].red_turn : textContent[currentLanguage].black_turn;
        turnEl.textContent = turnText;
        turnEl.style.color = gameState.currentPlayer === 'red' ? 'var(--color-error)' : 'var(--color-text)';
    }

    const statusEl = document.getElementById('gameStatus');
    if (statusEl) {



        //自加開始20251124.2300
        function generalsFacing() {
            const rg = redGeneral;   // {x, y}
            const bg = blackGeneral; // {x, y}

            // 不在同一路，直接不是飛公情況
            if (rg.x !== bg.x) return false;

            const file = rg.x;
            const yStart = Math.min(rg.y, bg.y) + 1;
            const yEnd = Math.max(rg.y, bg.y) - 1;

            // 檢查中間是否有棋子
            for (let y = yStart; y <= yEnd; y++) {
                if (board[y][file] != null) {
                    return false; // 有子擋住，就不是飛公
                }
            }
            return true; // 同一路且中間無子 → 兩將相望
        }
        //自加結束20251124.2300
        // || generalsFacing()

        if (gameState.isCheckmate) {
            statusEl.className = 'board-feedback error';
            const winner = gameState.currentPlayer === 'red' ? textContent[currentLanguage].black_wins : textContent[currentLanguage].red_wins;
            statusEl.textContent = `${textContent[currentLanguage].checkmate} ${winner}`;
        } else if (gameState.isCheck) {
            statusEl.className = 'board-feedback check-warning';
            statusEl.textContent = textContent[currentLanguage].check;
        } else {
            statusEl.className = 'board-feedback info';
            const turnText = gameState.currentPlayer === 'red' ? textContent[currentLanguage].red_turn : textContent[currentLanguage].black_turn;
            statusEl.textContent = turnText;
        }
    }

    updateMoveHistory();
    updateCapturedPieces();
    updateMaterialCount();
}

function updateMoveHistory() {
    const historyEl = document.getElementById('moveHistory');
    if (!historyEl) return;

    historyEl.innerHTML = '';
    gameState.moveHistory.forEach((move, index) => {
        const entry = document.createElement('div');
        entry.className = 'move-entry';
        if (index === gameState.moveHistory.length - 1) {
            entry.classList.add('highlight');
        }
        entry.innerHTML = `<span>${index + 1}.</span> <span>${move}</span>`;
        historyEl.appendChild(entry);
    });

    historyEl.scrollTop = historyEl.scrollHeight;
}

function updateCapturedPieces() {
    const redEl = document.getElementById('capturedRed');
    const blackEl = document.getElementById('capturedBlack');

    if (redEl) {
        redEl.innerHTML = gameState.capturedPieces.red.map(p =>
            `<span class="captured-piece">${p.name}</span>`
        ).join('');
    }

    if (blackEl) {
        blackEl.innerHTML = gameState.capturedPieces.black.map(p =>
            `<span class="captured-piece">${p.name}</span>`
        ).join('');
    }
}

function updateMaterialCount() {
    const countEl = document.getElementById('materialCount');
    if (!countEl) return;

    const redValue = gameState.capturedPieces.black.reduce((sum, p) => sum + (PIECE_VALUES[p.type] || 0), 0);
    const blackValue = gameState.capturedPieces.red.reduce((sum, p) => sum + (PIECE_VALUES[p.type] || 0), 0);
    const diff = redValue - blackValue;

    countEl.textContent = diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
    countEl.style.color = diff > 0 ? 'var(--color-success)' : diff < 0 ? 'var(--color-error)' : 'var(--color-text)';
}

function undoMove() {
    if (gameState.stateHistory.length === 0) return;

    // Restore previous state
    const previousState = gameState.stateHistory.pop();
    gameState.pieces = JSON.parse(JSON.stringify(previousState.pieces));
    gameState.currentPlayer = previousState.currentPlayer;
    gameState.capturedPieces = JSON.parse(JSON.stringify(previousState.capturedPieces));
    gameState.moveHistory = [...previousState.moveHistory];
    gameState.isCheck = previousState.isCheck;
    gameState.isCheckmate = previousState.isCheckmate;

    gameState.selectedPiece = null;
    gameState.validMoves = [];

    updateGameDisplay();
    renderFullGameBoard();
}

function swapColors() {
    gameState.boardFlipped = !gameState.boardFlipped;
    renderFullGameBoard();
}

function setupFullGameInteraction() {
    const canvas = document.getElementById('fullGameBoard');
    if (!canvas) return;

    canvas.addEventListener('click', (e) => {
        if (gameState.isCheckmate) return;

        const rect = canvas.getBoundingClientRect();
        let clickX = Math.round((e.clientX - rect.left - MARGIN) / CELL_SIZE);
        let clickY = Math.round((e.clientY - rect.top - MARGIN) / CELL_SIZE);

        if (gameState.boardFlipped) {
            clickX = 8 - clickX;
            clickY = 9 - clickY;
        }

        if (clickX < 0 || clickX >= 9 || clickY < 0 || clickY >= 10) return;

        const validMove = gameState.validMoves.find(m => m.x === clickX && m.y === clickY);
        if (validMove && gameState.selectedPiece) {
            makeMove(gameState.selectedPiece, clickX, clickY);
            return;
        }

        const clickedPiece = getPieceAt(gameState.pieces, clickX, clickY);
        if (clickedPiece && clickedPiece.color === gameState.currentPlayer) {
            gameState.selectedPiece = clickedPiece;
            gameState.validMoves = getValidMovesForGame(clickedPiece);
            renderFullGameBoard();
        } else {
            gameState.selectedPiece = null;
            gameState.validMoves = [];
            renderFullGameBoard();
        }
    });
}

function getValidMovesForGame(piece) {
    const moves = getValidMoves(piece, gameState.pieces);
    // Filter out moves that would leave the general in check
    return moves.filter(move => !wouldBeInCheck(piece, move.x, move.y));
}

function wouldBeInCheck(movingPiece, newX, newY) {
    const tempPieces = gameState.pieces.filter(p => !(p.x === newX && p.y === newY));
    const movedPieceIndex = tempPieces.findIndex(p => p.x === movingPiece.x && p.y === movingPiece.y);
    if (movedPieceIndex >= 0) {
        tempPieces[movedPieceIndex] = { ...tempPieces[movedPieceIndex], x: newX, y: newY };
    }

    return isInCheck(gameState.currentPlayer, tempPieces);
}

function isInCheck(color, pieces) {
    const general = pieces.find(p => p.type === 'general' && p.color === color);
    if (!general) return false;

    const enemyPieces = pieces.filter(p => p.color !== color);

    for (let enemy of enemyPieces) {
        const moves = getValidMoves(enemy, pieces);
        if (moves.some(m => m.x === general.x && m.y === general.y)) {
            return true;
        }
    }

    return false;
}

function makeMove(piece, newX, newY) {
    // Save current state before making move
    gameState.stateHistory.push({
        pieces: JSON.parse(JSON.stringify(gameState.pieces)),
        currentPlayer: gameState.currentPlayer,
        capturedPieces: JSON.parse(JSON.stringify(gameState.capturedPieces)),
        moveHistory: [...gameState.moveHistory],
        isCheck: gameState.isCheck,
        isCheckmate: gameState.isCheckmate
    });

    const capturedPiece = getPieceAt(gameState.pieces, newX, newY);

    if (capturedPiece) {
        const captureList = capturedPiece.color === 'red' ? 'red' : 'black';
        gameState.capturedPieces[captureList].push(capturedPiece);
        gameState.pieces = gameState.pieces.filter(p => !(p.x === newX && p.y === newY));
    }

    const movedPiece = gameState.pieces.find(p => p.x === piece.x && p.y === piece.y);
    if (movedPiece) {
        const moveNotation = `${movedPiece.color === 'red' ? '红' : '黑'}${movedPiece.name} ${piece.x},${piece.y}→${newX},${newY}`;
        gameState.moveHistory.push(moveNotation);

        movedPiece.x = newX;
        movedPiece.y = newY;
    }

    gameState.selectedPiece = null;
    gameState.validMoves = [];
    gameState.currentPlayer = gameState.currentPlayer === 'red' ? 'black' : 'red';

    gameState.isCheck = isInCheck(gameState.currentPlayer, gameState.pieces);
    gameState.isCheckmate = gameState.isCheck && !hasValidMoves(gameState.currentPlayer);

    updateGameDisplay();
    renderFullGameBoard();
}

function hasValidMoves(color) {
    const pieces = gameState.pieces.filter(p => p.color === color);
    for (let piece of pieces) {
        const moves = getValidMovesForGame(piece);
        if (moves.length > 0) return true;
    }
    return false;
}

// Setup full game interaction after board is initialized
setTimeout(() => {
    setupFullGameInteraction();
}, 100);

// Make functions globally available
window.newGame = newGame;
window.undoMove = undoMove;
window.swapColors = swapColors;

// Quiz answer checking
let answeredQuizzes = {};

function checkQuizAnswer(element, isCorrect, quizId) {
    if (answeredQuizzes[quizId]) return;

    answeredQuizzes[quizId] = true;

    if (isCorrect) {
        element.classList.add('correct');
        element.innerHTML += ' ✓ 正确！ Correct!';
    } else {
        element.classList.add('incorrect');
        element.innerHTML += ' ✗ 错误 Incorrect';

        // Show correct answer
        setTimeout(() => {
            const options = element.parentElement.querySelectorAll('.quiz-option');
            options.forEach(opt => {
                if (opt !== element && !opt.classList.contains('incorrect')) {
                    opt.classList.add('correct');
                }
            });
        }, 500);
    }
}








