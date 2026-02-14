# Valentine's Day Crossword Puzzle

A beautiful, interactive crossword puzzle with Valentine's Day theming, featuring floating hearts, confetti celebrations, and responsive design.

## Features

- ✨ Beautiful Valentine's Day themed design with pink/red color palette
- 💕 Animated floating hearts in the background
- 🎉 Confetti celebration when puzzle is completed
- ⌨️ Keyboard navigation (arrow keys, Tab to switch direction)
- 📱 Mobile responsive design
- ✅ Real-time answer validation
- 🎯 Success modal on completion

## How to Use

1. Open `index.html` in a web browser
2. Click on a cell to start entering answers
3. Type letters to fill in the crossword
4. Use arrow keys to navigate between cells
5. Press Tab to switch between across/down directions
6. Complete all answers correctly to see the celebration!

## Adding More Clues

To add more words to the crossword, you'll need to modify `script.js`. Here's how:

### Step 1: Design Your Grid Layout

First, plan how your new word will fit into the existing grid. Words should intersect with at least one existing word.

For example, if you want to add a new word "LOVE" (4 letters) that intersects with an existing word:

1. Find a letter that both words share (e.g., "L" or "O" or "V" or "E")
2. Determine the row and column where the new word should start
3. Decide if it's across or down

### Step 2: Update the Grid Array

In `script.js`, find the `puzzle.grid` array and modify it to include your new word's letters.

```javascript
const puzzle = {
    rows: 10,  // Increase if needed
    cols: 8,   // Increase if needed
    grid: [
        // Each row is an array of letters
        // '.' represents a black (blocked) cell
        // Letters represent the answer cells
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        // ... add or modify rows as needed
    ],
    // ...
};
```

### Step 3: Add the Word Definition

Add your new word to the `puzzle.words` array:

```javascript
words: [
    // Existing words...
    {
        num: 4,                    // Clue number
        answer: 'LOVE',            // The answer (uppercase)
        direction: 'across',       // 'across' or 'down'
        row: 5,                    // Starting row (0-indexed)
        col: 2,                    // Starting column (0-indexed)
        clue: "What we share"      // Your clue text
    }
]
```

### Step 4: Add Cell Numbers

If your word starts at a cell that doesn't already have a number, add it to `cellNumbers`:

```javascript
cellNumbers: {
    '2,0': 1,     // Existing numbers
    '5,2': 4,     // New number (format: 'row,col': clueNumber)
    // ...
}
```

If the cell already has a number (both across and down words start there):

```javascript
'2,5': { across: 2, down: 3 },  // Both directions start at this cell
```

### Step 5: Update the HTML Clues

In `index.html`, add your new clue to the appropriate section (Across or Down):

```html
<li><span class="clue-number">4.</span> What we share</li>
```

## Example: Adding a New Word

Let's say you want to add "ROSE" (4 letters) vertically starting at row 0, column 6:

1. **Update grid** (in `script.js`):
```javascript
grid: [
    ['.', '.', '.', '.', '.', '.', 'R', '.'],
    ['.', '.', '.', '.', '.', '.', 'O', '.'],
    ['N', 'A', 'K', 'S', 'U', 'D', 'S', 'D'],
    // ... rest of grid
]
```

2. **Add word definition**:
```javascript
{
    num: 4,
    answer: 'ROSE',
    direction: 'down',
    row: 0,
    col: 6,
    clue: "Your favorite flower"
}
```

3. **Add cell number**:
```javascript
'0,6': 4,
```

4. **Add clue to HTML**:
```html
<div class="clues-column">
    <h2>Down</h2>
    <ul class="clues-list">
        <!-- existing clues -->
        <li><span class="clue-number">4.</span> Your favorite flower</li>
    </ul>
</div>
```

## Tips for Creating a Good Crossword

- **Intersections**: Try to have each word intersect with at least one other word
- **Symmetry**: Traditional crosswords have symmetrical black square patterns
- **Difficulty**: Mix easy and challenging clues to keep it interesting
- **Theme**: Keep clues personal and relevant to your relationship

## File Structure

```
cutes/
├── index.html      # Main HTML structure
├── styles.css      # Valentine's Day styling and animations
├── script.js       # Crossword logic, validation, and confetti
└── README.md       # This file
```

## GitHub Pages Deployment

To deploy this to GitHub Pages:

1. Commit all files to your repository
2. Push to GitHub
3. Go to repository Settings > Pages
4. Select "Deploy from a branch"
5. Choose "main" branch and "/" (root)
6. Click Save
7. Your site will be live at `https://[username].github.io/[repository-name]/`

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers

## Customization

Feel free to customize:
- Colors in `styles.css` (see CSS variables at the top)
- Font families (currently using Google Fonts: Pacifico & Poppins)
- Animation speeds and effects
- Grid size and layout

## Credits

Built with vanilla HTML, CSS, and JavaScript - no frameworks needed!
