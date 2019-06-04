'use-strict';

window.onload = function(){
    initApp();
}

function initApp(){
    const state ={
        size : 4,
        board : [],
        player : true, // true = "X" and false = "O"
        remaining: 4*4
    }
    const app = document.querySelector('.game');
    
    createBoard(app);


    function createBoard(app){
        const n = state.size;
        // create N*N board
        // let newBoard = new Array(n).fill(new Array(n).fill(" ")); // 2d
        const newBoard = new Array(n*n).fill(' ');
        state.board = newBoard;

        const buttonDiv = document.createElement('div');
        let counter = 0;
        
        for(let rows = 0; rows < n; rows++){
            const row = document.createElement('div');
            row.classList.add(`row`, `row${rows}`)
            for(let cols = 0; cols < n; cols++){
                const btn = document.createElement('button');
                btn.classList.add(`col`, `col${counter}`);
                btn.addEventListener('click', handleClick);
                btn.setAttribute('data', counter);
                // btn.innerText = state.board[counter];
                row.append(btn);
                counter++;
            }
            app.append(row);
        }

        displayBoard();
        
    }

    function handleClick(){
        const btn = this;
        const btnID = btn.getAttribute('data');

        state.board[btnID] = (state.player) ? "X" : "O";
        state.player = !state.player; // change to next player
        state.remaining--;

        btn.setAttribute("disabled", true);
        displayBoard();
    }

    function displayBoard(){
        
        const n = state.size;
        const prevPlayer = (!state.player) ? "X" : "O";

        for(let i = 0; i < n*n; i++){
            const btn = document.querySelector(`.col${i}`);
            btn.innerText = state.board[i];
        }

        
        if(isTie()){
            displayPlayerOrResult("Tie Game!");
        }else if(isWin()){
            displayPlayerOrResult(`Player ${prevPlayer} Wins!`);
        }else{
            displayPlayerOrResult();
        }
        console.log(state.board);
    }

    function displayPlayerOrResult(result){
        const player = document.querySelector('.player');
        if(!result){
            player.innerText = `Player: ${(state.player) ? "X" : "O"}`;
        }else{
            player.innerText = result;
            const allBtns = document.querySelectorAll('.game button');
            allBtns.forEach(btn => btn.setAttribute('disabled', true));
        }
        
    }

    function isTie(){
        return (state.remaining === 0) 
    }

    function isWin(){
        return checkRows() || checkColumns() || checkDiagonals();
    }

    function checkRows(){
        const n = state.size;
        for(let i = 0; i < n*n; i = i+n){
            const row = state.board.slice(i,i+n);

            // checking to see if the previous player to click a button in fact won by filling up an entire row with the same previous player symbol (know an entire row is filled if numMatches(row) == n ) where n is the length of the row
            if(numMatches(row) === n) return true;  
        }
        // there are no full rows that match
        return false;
    }
    function checkColumns(){
        const n = state.size;
        for(let i = 0; i < n; i++){
            const column = [];
            for(let j = i; j < n*n; j=j+n){
                column.push(state.board[j])
            }
            if(numMatches(column) === n) return true;
        }
        return false;
    }

    function checkDiagonals(){

    }
    
    function numMatches(arr){

         // need to check the last player so use bang operation to get the previous player because by this point the state.player is pointing to the next player

         // return the number within the arr = row || column || diagonal that have elements that match the previous player symbol

        const prevPlayer = (!state.player) ? "X" : "O";
        return arr.reduce((total, element) => {
            return total = (element === prevPlayer) ? total + 1 : total;
        }, 0);
    }

    function createHighlight(){

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
                ["0",1,2,3,4,"5",6,7,8,9,"10",11,12,13,14,"15"] diagonal 1
                [0,1,2,"3",4,5,"6",7,8,"9",10,11,"12",13,14,15]

                [0, 1, 2, 3, 4]
                [5, 6, 7, 8, 9]
                [10,11,12,13,14]
                [15,16,17,18,19]
                [20,21,22,23,24]

                [0,6,12,18,24]
                [4,8,12,16,20]
        
        */