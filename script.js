// Crossword Puzzle Data
const puzzle = {
    rows: 10,
    cols: 8,
    // Grid layout: '.' = black cell, letters = answer cells
    grid: [
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        ['N', 'A', 'K', 'S', 'U', 'D', 'O', 'D'],
        ['.', '.', 'A', 'C', '.', 'R', '.', '.'],
        ['.', '.', 'M', 'O', '.', 'I', '.', '.'],
        ['.', '.', 'L', 'O', '.', 'S', '.', '.'],
        ['.', '.', 'I', 'P', '.', 'H', '.', '.'],
        ['.', '.', '.', '.', '.', 'Y', '.', '.'],
        ['M', 'I', 'T', 'H', 'A', 'A', 'S', '.'],
        ['.', '.', '.', '.', '.', 'M', '.', '.']
    ],
    // Word definitions
    words: [
        // Across
        { num: 1, answer: 'NAKSU', direction: 'across', row: 2, col: 0, clue: "Who is stuck in Bu-yeon's body?" },
        { num: 2, answer: 'DOD', direction: 'across', row: 2, col: 5, clue: "Where we've spent the most amount of nights together" },
        { num: 3, answer: 'MITHAAS', direction: 'across', row: 8, col: 0, clue: "Where we had the most incredible Dabeli" },
        // Down
        { num: 1, answer: 'KAMLI', direction: 'down', row: 2, col: 2, clue: "Prapti looks so cool dancing to this song" },
        { num: 2, answer: 'SCOOP', direction: 'down', row: 2, col: 3, clue: "A _____ of banana ice cream from Bent Spoon" },
        { num: 3, answer: 'DRISHYAM', direction: 'down', row: 2, col: 5, clue: "If only we could've watched this movie alone after lawnparties..." }
    ],
    // Cell numbers (which cells get clue numbers)
    cellNumbers: {
        '2,0': 1,
        '2,2': 1,
        '2,3': 2,
        '2,5': { across: 2, down: 3 },
        '8,0': 3
    }
};

// State management
let selectedCell = null;
let currentDirection = 'across';

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
                // Black cell
                td.classList.add('black');
            } else {
                // White cell with input
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.dataset.answer = cellValue;
                td.appendChild(input);

                // Add cell number if exists
                const cellKey = `${row},${col}`;
                if (puzzle.cellNumbers[cellKey]) {
                    const cellNum = puzzle.cellNumbers[cellKey];
                    const numSpan = document.createElement('span');
                    numSpan.className = 'cell-number';

                    if (typeof cellNum === 'object') {
                        // Multiple numbers (both across and down start here)
                        numSpan.textContent = cellNum.across || cellNum.down;
                    } else {
                        numSpan.textContent = cellNum;
                    }

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
    const cells = document.querySelectorAll('.cell:not(.black) input');

    cells.forEach(input => {
        // Click to select cell
        input.addEventListener('click', (e) => {
            selectCell(e.target.parentElement);
        });

        // Input handling
        input.addEventListener('input', (e) => {
            handleInput(e);
        });

        // Keyboard navigation
        input.addEventListener('keydown', (e) => {
            handleKeydown(e);
        });
    });

    // Modal close button
    document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('success-modal').classList.remove('show');
    });
}

// Select a cell
function selectCell(cell) {
    // Remove previous selection
    document.querySelectorAll('.cell.selected').forEach(c => {
        c.classList.remove('selected');
    });

    // If clicking the same cell, toggle direction
    if (selectedCell === cell) {
        currentDirection = currentDirection === 'across' ? 'down' : 'across';
    }

    selectedCell = cell;
    cell.classList.add('selected');
    cell.querySelector('input').focus();
}

// Handle input
function handleInput(e) {
    const input = e.target;
    const value = input.value.toUpperCase();

    // Only allow letters
    if (value && !/^[A-Z]$/.test(value)) {
        input.value = '';
        return;
    }

    input.value = value;

    // Check if correct
    if (value === input.dataset.answer) {
        input.parentElement.classList.add('correct');
    } else {
        input.parentElement.classList.remove('correct');
    }

    // Move to next cell
    if (value) {
        moveToNextCell();
    }

    // Check if puzzle is complete
    checkCompletion();
}

// Handle keyboard navigation
function handleKeydown(e) {
    const row = parseInt(selectedCell.dataset.row);
    const col = parseInt(selectedCell.dataset.col);

    switch (e.key) {
        case 'ArrowRight':
            e.preventDefault();
            moveCell(row, col + 1);
            currentDirection = 'across';
            break;
        case 'ArrowLeft':
            e.preventDefault();
            moveCell(row, col - 1);
            currentDirection = 'across';
            break;
        case 'ArrowDown':
            e.preventDefault();
            moveCell(row + 1, col);
            currentDirection = 'down';
            break;
        case 'ArrowUp':
            e.preventDefault();
            moveCell(row - 1, col);
            currentDirection = 'down';
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
            break;
    }
}

// Move to a specific cell
function moveCell(row, col) {
    if (row < 0 || row >= puzzle.rows || col < 0 || col >= puzzle.cols) return;

    const targetCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);

    if (targetCell && !targetCell.classList.contains('black')) {
        selectCell(targetCell);
    } else {
        // Skip black cells
        if (currentDirection === 'across') {
            moveCell(row, col + 1);
        } else {
            moveCell(row + 1, col);
        }
    }
}

// Move to next cell based on current direction
function moveToNextCell() {
    if (!selectedCell) return;

    const row = parseInt(selectedCell.dataset.row);
    const col = parseInt(selectedCell.dataset.col);

    if (currentDirection === 'across') {
        moveCell(row, col + 1);
    } else {
        moveCell(row + 1, col);
    }
}

// Move to previous cell based on current direction
function moveToPreviousCell() {
    if (!selectedCell) return;

    const row = parseInt(selectedCell.dataset.row);
    const col = parseInt(selectedCell.dataset.col);

    if (currentDirection === 'across') {
        moveCell(row, col - 1);
    } else {
        moveCell(row - 1, col);
    }
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
