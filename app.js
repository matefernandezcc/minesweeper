document.addEventListener('DOMContentLoaded', function() {

    // Selectors
    const grid = document.querySelector('.grid')
    const flagsLeft = document.querySelector('#flags-left')
    const result = document.querySelector('#result')

    // Global values
    const width = 10
    let bombAmount = 20
    let cells = []
    let isGameOver = false
    let flags = 0

    // Function to create the Board
    function createBoard() {
        flagsLeft.innerHTML = bombAmount // Set flags-left span to bombAmount

        // Shuffle Game Array
        const bombArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width*width - bombAmount).fill('valid')
        const gameArray = emptyArray.concat(bombArray) // Game Array with bombs and valid cells
        const shuffledArray = gameArray.sort( () => Math.random() - 0.5 ) // Random sort Game Array

        for(let i = 0; i < width*width; i++){
            const cell = document.createElement('div')
            cell.id = i // id for each cell
            cell.classList.add(shuffledArray[i]) // Add random class for each cell
            grid.appendChild(cell)
            cells.push(cell) // Save each cell in the cells array

            // Click Handler
                // Normal Click
                cell.addEventListener('click', function() {
                   click(cell) 
                })
                
                // Ctrl and left click (for flags)
                cell.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    addFlag(cell);
                });
        }

        // Add numbers (minesweeper numbers logic)
        for(let i = 0; i < cells.length; i++){
            let total = 0
            const isLeftEdge = (i % width === 0) // If remainder 0 is on the left
            const isRightEdge = (i % width === width - 1) // If remainder 9 is on the right

            // Check valid cell neighbourhood for bombs
            if(cells[i].classList.contains('valid')) {

                // |   | |   | | x |
                // |   | | i | |   |
                // | x | |   | |   |
                // in this example the value under the cell i should be 2, because theres 2 bombs around

                // Left cell
                if(i > 0 && !isLeftEdge && cells[i - 1].classList.contains('bomb')) total++ 

                // Top right cell
                if(i > 9 && !isRightEdge && cells[i + 1 - width].classList.contains('bomb')) total++

                // Top Cell
                if(i > 10 && cells[i - width].classList.contains('bomb')) total++

                // Top left cell
                if(i > 11 && !isLeftEdge && cells[i - 1 - width].classList.contains('bomb')) total++

                // Right cell
                if(i < 99 && !isRightEdge && cells[i + 1].classList.contains('bomb')) total++

                // Bottom left cell
                if(i < 90 && !isLeftEdge && cells[i - 1 + width].classList.contains('bomb')) total++

                // Bottom right cell
                if(i < 88 && !isRightEdge && cells[i + 1 + width].classList.contains('bomb')) total++

                // Bottom cell
                if(i < 89 && cells[i + width].classList.contains('bomb')) total++

                cells[i].setAttribute('data', total) // Set the value to the cell
            }
        }

    }
    createBoard()

    // Add flag with right click
    function addFlag(cell){
        if(isGameOver) return
        if(!cell.classList.contains('checked') && (flags < bombAmount)) {
            if(!cell.classList.contains('flag')) {
                cell.classList.add('flag')
                flags++
                cell.innerHTML = '🚩'
                flagsLeft.innerHTML = bombAmount - flags
                checkForWin()

            } else {
                cell.classList.remove('flag')
                flags--
                cell.innerHTML = ''
                flagsLeft = bombAmount - flags
            }
        }
    }

    function click(cell){
        if (isGameOver || cell.classList.contains('checked') || cell.classList.contains('flag')) return

        console.log(cell)

        // Click Logic
        if(cell.classList.contains('bomb')) {
            gameOver()
        } else {
            let total = cell.getAttribute('data')
            if (total != 0) {
                cell.classList.add('checked')
                // Data value
                if (total == 1) cell.classList.add('one')
                if (total == 2) cell.classList.add('two')
                if (total == 3) cell.classList.add('three')
                if (total == 4) cell.classList.add('four')
                cell.innerHTML = total
                return
            }
            checkCell(cell)
        }
        cell.classList.add('checked')
    }

    // Check neighbouring cells once cell is clicked
    function checkCell(cell){
        const currentId = cell.id
        const isLeftEdge = (cell.id % width === 0)
        const isRightEdge = (cell.id % width === width - 1)

        setTimeout(function () {
            // Left
            if (currentId > 0 && !isLeftEdge) { 
                const newId = parseInt(currentId) - 1
                const newCell = document.getElementById(newId)
                click(newCell)
            }
            // Top-right
            if (currentId > 9 && !isRightEdge) {
                const newId = parseInt(currentId) + 1 - width
                const newCell = document.getElementById(newId)
                click(newCell)
            }
            // Top
            if (currentId > 10) {
                const newId = parseInt(currentId) - width
                const newCell = document.getElementById(newId)
                click(newCell)
            }
            // Top-left
            if (currentId > 11 && !isLeftEdge) {
                const newId = parseInt(currentId) - 1 - width
                const newCell = document.getElementById(newId)
                click(newCell)
            }
            // Right
            if (currentId < 98 && !isRightEdge) {
                const newId = parseInt(currentId) + 1
                const newCell = document.getElementById(newId)
                click(newCell)
            }
            // Bottom-left
            if (currentId < 90 && !isLeftEdge) {
                const newId = currenparseInt(currentId) - 1 + width
                const newCell = document.getElementById(newId)
                click(newCell)
            }
            // Bottom-right
            if (currentId < 88 && !isRightEdge) {
                const newId = parseInt(currentId) + 1 + width
                const newCell = document.getElementById(newId)
                click(newCell)
            }
            // Bottom
            if (currentId < 89) {
                const newId = parseInt(currentId) + width
                const newCell = document.getElementById(newId)
                click(newCell)
            }
        });
    }

    function checkForWin() {
        let matches = 0
        for(let i = 0; i < cells.length; i++){
            if(cells[i].classList.contains('flag') && cells[i].classList.contains('bomb')) {
                matches++
            }
            if(matches === bombAmount) {
                result.innerHTML = 'YOU WIN!'
                isGameOver = true
            }
        }
    }

    function gameOver(){
        result.innerHTML = 'BOOM! Game Over'
        isGameOver = true

        // Show all bombs
        cells.forEach(function(cell) {
            if(cell.classList.contains('bomb')) {
                cell.innerHTML = '💣'
                cell.classList.remove('bomb')
                cell.classList.add('checked')
            }
        })
    }
})