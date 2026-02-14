// Crossword Puzzle Data
// Grid: 13 rows x 14 columns
// '.' = black cell, letters = answer cells
const puzzle = {
    rows: 13,
    cols: 14,
    grid: [
        ['.', '.', '.', '.', '.', '.', '.', 'M', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', 'K', 'A', 'M', 'L', 'I', '.', '.', '.', '.', '.', 'F'],
        ['.', '.', '.', '.', '.', '.', '.', 'T', '.', '.', 'A', 'B', 'H', 'I'],
        ['S', '.', '.', '.', '.', '.', '.', 'H', '.', '.', 'Z', '.', '.', 'R'],
        ['C', 'A', 'N', 'C', 'U', 'N', '.', 'A', '.', '.', 'U', '.', '.', 'E'],
        ['O', '.', 'A', '.', '.', 'O', '.', 'A', '.', '.', 'L', '.', '.', '.'],
        ['O', '.', 'K', '.', 'D', 'R', 'I', 'S', 'H', 'Y', 'A', 'M', '.', '.'],
        ['P', '.', 'S', '.', '.', 'T', '.', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', 'U', '.', '.', 'H', 'O', 'O', 'D', 'I', 'E', '.', '.', '.'],
        ['.', '.', '.', '.', '.', 'E', '.', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', 'R', '.', '.', '.', 'D', '.', '.', '.', '.'],
        ['.', '.', '.', 'T', 'A', 'N', 'J', 'I', 'R', 'O', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.', '.', 'D', '.', '.', '.', '.']
    ],
    words: [
        // Across
        { num: 2,  answer: 'KAMLI',    direction: 'across', row: 1,  col: 3,  clue: "Prapti looks so cool dancing to this song" },
        { num: 4,  answer: 'ABHI',     direction: 'across', row: 2,  col: 10, clue: "Who believed that you carried me on your shoulders during lawnparties?" },
        { num: 6,  answer: 'CANCUN',   direction: 'across', row: 4,  col: 0,  clue: "Where morning painted the sky just for us" },
        { num: 9,  answer: 'DRISHYAM', direction: 'across', row: 6,  col: 4,  clue: "The film we longed to watch alone, if only lawnparties had let us be on our own..." },
        { num: 10, answer: 'HOODIE',   direction: 'across', row: 8,  col: 5,  clue: "In {6 Across} you borrowed my _____, but stole my heart" },
        { num: 12, answer: 'TANJIRO',  direction: 'across', row: 11, col: 3,  clue: "Whose earring travels with me everywhere?" },
        // Down
        { num: 1,  answer: 'MITHAAS',  direction: 'down', row: 0,  col: 7,  clue: "Where a single dabeli stole our hearts" },
        { num: 3,  answer: 'FIRE',     direction: 'down', row: 1,  col: 13, clue: "{4 Down}'s favorite Taco Bell sauce" },
        { num: 4,  answer: 'AZULA',    direction: 'down', row: 2,  col: 10, clue: "Who was brave enough to confess first?" },
        { num: 5,  answer: 'SCOOP',    direction: 'down', row: 3,  col: 0,  clue: "A _____ of banana ice cream from Bent Spoon, shared on a Palmer Square afternoon" },
        { num: 7,  answer: 'NAKSU',    direction: 'down', row: 4,  col: 2,  clue: "A soul entwined in Bu-yeon's form" },
        { num: 8,  answer: 'NORTHERN', direction: 'down', row: 4,  col: 5,  clue: "October wrapped us in wonder beneath the _____ lights" },
        { num: 11, answer: 'DOD',      direction: 'down', row: 10, col: 9,  clue: "The place that's held us through the most midnights" }
    ],
    cellNumbers: {
        '0,7': 1,
        '1,3': 2,
        '1,13': 3,
        '2,10': 4,
        '3,0': 5,
        '4,0': 6,
        '4,2': 7,
        '4,5': 8,
        '6,4': 9,
        '8,5': 10,
        '10,9': 11,
        '11,3': 12
    }
};

// State management
let selectedCell = null;
let currentDirection = 'across';
let currentWord = null;

// Find which words pass through a given cell
function getWordsForCell(row, col) {
    return puzzle.words.filter(word => {
        if (word.direction === 'across') {
            return row === word.row && col >= word.col && col < word.col + word.answer.length;
        } else {
            return col === word.col && row >= word.row && row < word.row + word.answer.length;
        }
    });
}

// Get all cells belonging to a word
function getCellsForWord(word) {
    const cells = [];
    for (let i = 0; i < word.answer.length; i++) {
        const r = word.direction === 'across' ? word.row : word.row + i;
        const c = word.direction === 'across' ? word.col + i : word.col;
        const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
        if (cell) cells.push(cell);
    }
    return cells;
}

// Initialize the crossword
function init() {
    renderGrid();
    setupEventListeners();
}

// Render the crossword grid
function renderGrid() {
    const gridContainer = document.getElementById('crossword-grid');
    const table = document.createElement('table');
    table.className = 'crossword-table';

    for (let row = 0; row < puzzle.rows; row++) {
        const tr = document.createElement('tr');

        for (let col = 0; col < puzzle.cols; col++) {
            const td = document.createElement('td');
            td.className = 'cell';
            td.dataset.row = row;
            td.dataset.col = col;

            const cellValue = puzzle.grid[row][col];

            if (cellValue === '.') {
                td.classList.add('black');
            } else {
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.dataset.answer = cellValue;
                td.appendChild(input);

                const cellKey = `${row},${col}`;
                if (puzzle.cellNumbers[cellKey]) {
                    const cellNum = puzzle.cellNumbers[cellKey];
                    const numSpan = document.createElement('span');
                    numSpan.className = 'cell-number';
                    numSpan.textContent = typeof cellNum === 'object' ? (cellNum.across || cellNum.down) : cellNum;
                    td.appendChild(numSpan);
                }
            }

            tr.appendChild(td);
        }

        table.appendChild(tr);
    }

    gridContainer.appendChild(table);
}

// Setup event listeners
function setupEventListeners() {
    document.querySelectorAll('.cell:not(.black) input').forEach(input => {
        input.addEventListener('click', (e) => selectCell(e.target.parentElement));
        input.addEventListener('input', (e) => handleInput(e));
        input.addEventListener('keydown', (e) => handleKeydown(e));
    });

    document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('success-modal').classList.remove('show');
    });
}

// Highlight the current word's cells
function highlightWord() {
    document.querySelectorAll('.cell.highlighted').forEach(c => c.classList.remove('highlighted'));
    if (currentWord) {
        getCellsForWord(currentWord).forEach(c => c.classList.add('highlighted'));
    }
}

// Select a cell and auto-detect direction
function selectCell(cell) {
    document.querySelectorAll('.cell.selected').forEach(c => c.classList.remove('selected'));

    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const words = getWordsForCell(row, col);
    const acrossWord = words.find(w => w.direction === 'across');
    const downWord = words.find(w => w.direction === 'down');

    if (selectedCell === cell && acrossWord && downWord) {
        // Toggle direction when clicking same cell that has both directions
        currentDirection = currentDirection === 'across' ? 'down' : 'across';
    } else if (selectedCell !== cell) {
        // Auto-detect: if only one direction exists, use it
        if (acrossWord && !downWord) {
            currentDirection = 'across';
        } else if (downWord && !acrossWord) {
            currentDirection = 'down';
        }
        // If both exist, keep current direction
    }

    currentWord = currentDirection === 'across' ? (acrossWord || downWord) : (downWord || acrossWord);
    selectedCell = cell;
    cell.classList.add('selected');
    cell.querySelector('input').focus();
    highlightWord();
}

// Handle input
function handleInput(e) {
    const input = e.target;
    const value = input.value.toUpperCase();

    if (value && !/^[A-Z]$/.test(value)) {
        input.value = '';
        return;
    }

    input.value = value;

    if (value === input.dataset.answer) {
        input.parentElement.classList.add('correct');
    } else {
        input.parentElement.classList.remove('correct');
    }

    if (value) {
        moveToNextCell();
    }

    checkCompletion();
}

// Handle keyboard navigation
function handleKeydown(e) {
    if (!selectedCell) return;
    const row = parseInt(selectedCell.dataset.row);
    const col = parseInt(selectedCell.dataset.col);

    switch (e.key) {
        case 'ArrowRight':
            e.preventDefault();
            currentDirection = 'across';
            moveTo(row, col + 1);
            break;
        case 'ArrowLeft':
            e.preventDefault();
            currentDirection = 'across';
            moveTo(row, col - 1);
            break;
        case 'ArrowDown':
            e.preventDefault();
            currentDirection = 'down';
            moveTo(row + 1, col);
            break;
        case 'ArrowUp':
            e.preventDefault();
            currentDirection = 'down';
            moveTo(row - 1, col);
            break;
        case 'Backspace':
            if (!e.target.value) {
                e.preventDefault();
                moveToPreviousCell();
            }
            break;
        case 'Tab':
            e.preventDefault();
            currentDirection = currentDirection === 'across' ? 'down' : 'across';
            selectCell(selectedCell);
            break;
    }
}

// Move to a specific cell (only if it's a valid letter cell, no skipping)
function moveTo(row, col) {
    if (row < 0 || row >= puzzle.rows || col < 0 || col >= puzzle.cols) return;
    const targetCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (targetCell && !targetCell.classList.contains('black')) {
        selectCell(targetCell);
    }
}

// Move to next cell within the current word
function moveToNextCell() {
    if (!selectedCell || !currentWord) return;
    const row = parseInt(selectedCell.dataset.row);
    const col = parseInt(selectedCell.dataset.col);
    const nextRow = currentWord.direction === 'across' ? row : row + 1;
    const nextCol = currentWord.direction === 'across' ? col + 1 : col;
    const wordEnd = currentWord.direction === 'across'
        ? currentWord.col + currentWord.answer.length
        : currentWord.row + currentWord.answer.length;
    const pos = currentWord.direction === 'across' ? nextCol : nextRow;
    if (pos >= wordEnd) return;
    moveTo(nextRow, nextCol);
}

// Move to previous cell within the current word
function moveToPreviousCell() {
    if (!selectedCell || !currentWord) return;
    const row = parseInt(selectedCell.dataset.row);
    const col = parseInt(selectedCell.dataset.col);
    const prevRow = currentWord.direction === 'across' ? row : row - 1;
    const prevCol = currentWord.direction === 'across' ? col - 1 : col;
    const wordStart = currentWord.direction === 'across' ? currentWord.col : currentWord.row;
    const pos = currentWord.direction === 'across' ? prevCol : prevRow;
    if (pos < wordStart) return;
    moveTo(prevRow, prevCol);
}

// Check if puzzle is complete
function checkCompletion() {
    const inputs = document.querySelectorAll('.cell:not(.black) input');
    let allCorrect = true;
    let allFilled = true;

    inputs.forEach(input => {
        if (!input.value) {
            allFilled = false;
        }
        if (input.value.toUpperCase() !== input.dataset.answer) {
            allCorrect = false;
        }
    });

    if (allFilled && allCorrect) {
        celebrateSuccess();
    }
}

// Celebrate successful completion
function celebrateSuccess() {
    // Show modal
    setTimeout(() => {
        document.getElementById('success-modal').classList.add('show');
    }, 500);

    // Trigger confetti
    launchConfetti();
}

// Confetti animation
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 150;
    const colors = ['#FF6B9D', '#C73866', '#FFC2D1', '#FFE5EC', '#FF1493'];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 2,
            d: Math.random() * particleCount,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 10,
            tiltAngleIncremental: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        });
    }

    let animationFrame;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            ctx.beginPath();
            ctx.lineWidth = p.r / 2;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.r, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
            ctx.stroke();

            // Update particle
            p.tiltAngle += p.tiltAngleIncremental;
            p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
            p.x += Math.sin(p.d);
            p.tilt = Math.sin(p.tiltAngle - i / 3) * 15;

            // Reset particle if it goes off screen
            if (p.y > canvas.height) {
                particles[i] = {
                    x: Math.random() * canvas.width,
                    y: -20,
                    r: p.r,
                    d: p.d,
                    color: p.color,
                    tilt: p.tilt,
                    tiltAngleIncremental: p.tiltAngleIncremental,
                    tiltAngle: p.tiltAngle
                };
            }
        });

        animationFrame = requestAnimationFrame(draw);
    }

    draw();

    // Stop confetti after 10 seconds
    setTimeout(() => {
        cancelAnimationFrame(animationFrame);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 10000);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
