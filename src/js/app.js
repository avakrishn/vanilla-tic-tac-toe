'use-strict';

window.onload = function(){
    chooseBoardSize();
}

function chooseBoardSize(){
    
    const slider = document.querySelector('input');
    slider.addEventListener('change', updateValue);

    const boardValue = document.querySelector('.boardValue');
    boardValue.innerText = slider.value;

    const reset = document.querySelector('.reset');
    reset.addEventListener('click', resetGame);

    function updateValue(){
        boardValue.innerText = this.value;
        initGame(parseInt(this.value));
    }

    function resetGame(){
        const chooseText = document.querySelector('.chooseText');

        slider.disabled = false;
        chooseText.innerText = "Choose Your Board Size";
        initGame(parseInt(slider.value));

    }

}

function initGame(boardSize){

    const state ={
        size : boardSize,
        board : [],
        player : true, // true = "X" and false = "O"
        remaining: boardSize*boardSize,
        lastButton: [],
    }
   
    const game = document.querySelector('.game');
    const undo = document.querySelector('.undo');
    game.innerHTML="";
    createBoard(game);

    undo.addEventListener('click', undoLastMove);

    function createBoard(game){
        const n = state.size;
        // create N*N board
        // let newBoard = new Array(n).fill(new Array(n).fill(" ")); // 2d
        const newBoard = new Array(n*n).fill(' ');
        state.board = newBoard;

        let counter = 0;
        
        for(let rows = 0; rows < n; rows++){
            const row = document.createElement('div');
            row.classList.add(`row`, `row${rows}`)
            for(let cols = 0; cols < n; cols++){
                const btn = document.createElement('button');
                btn.classList.add(`col`, `btn${counter}`);
                btn.addEventListener('click', handleClick);
                btn.setAttribute('data', counter);
                // btn.innerText = state.board[counter];
                row.append(btn);
                counter++;
            }
            game.append(row);
        }

        displayBoard();
        
    }

    function handleClick(){
        // undo.disabled = false;

        if(state.remaining === (state.size * state.size)){
            const slider = document.querySelector('input');
            const chooseText = document.querySelector('.chooseText');
            
            slider.disabled = true;
            chooseText.innerText = "Reset Game To Change Board";
        }

        const btn = this;
        const btnID = btn.getAttribute('data');

        state.board[btnID] = (state.player) ? "X" : "O";
        state.player = !state.player; // change to next player
        state.remaining--;
        state.lastButton.push(btnID);

        btn.disabled = true;
        
        displayBoard();
    }

    function displayBoard(){
        
        const n = state.size;
        const prevPlayer = (!state.player) ? "X" : "O";

        for(let i = 0; i < n*n; i++){
            const btn = document.querySelector(`.btn${i}`);
            btn.innerText = state.board[i];
        }

        
        if(isTie()){
            displayPlayerOrResult("Tie Game!");
        }else if(isWin()){
            displayPlayerOrResult(`Player ${prevPlayer} Wins!`);
        }else{
            displayPlayerOrResult();
        }
    }

    function displayPlayerOrResult(result){
        const player = document.querySelector('.player');
        const undo = document.querySelector('.undo');
        if(!result){
            player.innerText = `Player: ${(state.player) ? "X" : "O"}`;
            if(state.remaining === state.size * state.size){
                undo.disabled = true;
            }else{
                undo.disabled = false;
            }
        }else{
            player.innerText = result;
            const allBtns = document.querySelectorAll('.game button');
            allBtns.forEach(btn => btn.disabled = true);
            undo.disabled = true;
            undo.removeEventListener('click', undoLastMove);
        }
        
    }

    function isTie(){
        return (state.remaining === 0) 
    }

    function isWin(){
        
        const rows = checkRows(),
            cols = checkColumns(),
            diagonals = checkDiagonals();
            // need to execute all three checks to see if multiple of them are true inorder to correctly highlight all buttons that satisfy a win

        return rows || cols || diagonals;
    }

    function checkRows(){
        
        const n = state.size;
        
        for(let i = 0; i < n*n; i = i+n){
            // const row = state.board.slice(i,i+n);
            const rowIndices = [];
            for(let index = i; index < i+n; index++){
                rowIndices.push(index);
            } 

            // checking to see if the previous player to click a button in fact won by filling up an entire row with the same previous player symbol (know an entire row is filled if numMatches(row) == n ) where n is the length of the row
            if(numMatches(rowIndices) === n) {
                markButtons(rowIndices);
                return true; 
            } 
        }
        // there are no full rows that match
        return false;
    }

    function checkColumns(){
        const n = state.size;
        for(let i = 0; i < n; i++){
            const columnIndices = [];
            for(let j = i; j < n*n; j=j+n){
                columnIndices.push(j);
            }
            if(numMatches(columnIndices) === n){
                markButtons(columnIndices);
                return true;
            } 
        }
        return false;
    }

    function checkDiagonals(){
        const n = state.size;
        let d1 = 0, 
            d2 = n-1, 
            diagonal1Indices = [], 
            diagonal2Indices =[],
            count = 0;

        while(d1 < n*n){
            diagonal1Indices.push(d1);
            d1 += (n+1);
        }
        while(d2 < n*n && count <n){
            diagonal2Indices.push(d2);
            count++;
            d2 += (n-1);
        }

        const diagonal1Matches = numMatches(diagonal1Indices);
        const diagonal2Matches = numMatches(diagonal2Indices);
        if(diagonal1Matches === n){
            markButtons(diagonal1Indices);
        } 
        
        if(diagonal2Matches=== n){
            markButtons(diagonal2Indices);
        } 

        if(diagonal1Matches === n || diagonal2Matches === n){
            return true;
        }

        return false;
    }
    
    function numMatches(arr){

         // need to check the last player so use bang operation to get the previous player because by this point the state.player is pointing to the next player

         // return the number within the arr = row || column || diagonal that have elements that match the previous player symbol

        const prevPlayer = (!state.player) ? "X" : "O";
        return arr.reduce((total, element) => {
            return total = (state.board[element] === prevPlayer) ? total + 1 : total;
        }, 0);
    }

    function undoLastMove(){

        if(state.remaining === (state.size * state.size)) return;
    
        const btnID = state.lastButton.pop();
        const btn = document.querySelector(`.btn${btnID}`);
        btn.disabled = false;
        state.player = !state.player;
        state.board[btnID] = " ";
        state.remaining++;
        displayBoard();
    
    }

    function markButtons(indicesArr){
        indicesArr.forEach(index => {
            const btn = document.querySelector(`.btn${index}`);
            btn.classList.add('hl');
        })
    }
}


/*
                wins:
                each row
                each col
                two diagonals
                    [00][11][22][33] -- add both row and col
                    [03][1,2][2,1][3,0] -- add row subtract col

                [-,-,-,-]
                [-,-,-,-]
                [-,-,-,-]
                [-,-,-,-]

                [0,1,2,3]
                [4,5,6,7]
                [8,9,10,11]
                [12,13,14,15]

                ["0,1,2,3," "4,5,6,7," "8,9,10,11" ,"12,13,14,15"] rows

                ["0",1,2,3,"4",5,6,7,"8",9,10,11,"12",13,14,15] cols

                ["0",1,2,3,4,"5",6,7,8,9,"10",11,12,13,14,"15"] diagonal 1 - start at 0 then keep adding n+1 to it till out of bounds to get first diagonal indices

                [0,1,2,"3",4,5,"6",7,8,"9",10,11,"12",13,14,15] diagonal 2 - start at n-1 and add n-1 each time till out of bounds to get diagonal 2

                [0, 1, 2, 3, 4]
                [5, 6, 7, 8, 9]
                [10,11,12,13,14]
                [15,16,17,18,19]
                [20,21,22,23,24]

                [0,6,12,18,24]
                [4,8,12,16,20]
        
        */