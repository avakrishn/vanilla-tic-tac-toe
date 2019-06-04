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
        // displayPlayer();
        displayBoard();
        
    }

    function handleClick(){
        const btn = this;
        const btnID = btn.getAttribute('data');
        state.board[btnID] = (state.player) ? "X" : "O";
        // changePlayer();
        state.player = !state.player;
        state.remaining--;
        btn.setAttribute("disabled", true);
        displayBoard();
    }

    function displayBoard(){
        
        const playerDiv = document.querySelector('.player');
        const n = state.size;
        const prevPlayer = (!state.player) ? "X" : "O";

        for(let i = 0; i < n*n; i++){
            const btn = document.querySelector(`.col${i}`);
            btn.innerText = state.board[i];
        }
        displayPlayer();
        if(isTie()){
            playerDiv.innerText = "Tie Game!";
        }if(checkRows()){
            playerDiv.innerText =`Player ${prevPlayer} Wins!`;
        }
        console.log(state.board);
        checkRows();
    }

    function displayPlayer(){
        const player = document.querySelector('.player');
        player.innerText = `Player: ${(state.player) ? "X" : "O"}`;
    }

    function displayResult(){

    }



    function isTie(){
        return (state.remaining === 0) 
    }

    function isWin(){
        return checkRows() || checkColumns() || checkDiagonals();
    }
    function checkRows(){
        const n = state.size;
        const prevPlayer = (!state.player) ? "X" : "O"; // need to check the last player so use bang operation to get the previous player because by this point the state.player is pointing to the next player
        for(let i = 0; i < n*n; i = i+n){
            const row = state.board.slice(i,i+n);
            // checking to see if the last player to click a button in fact won by filling up an entire row 
            const numMatches = row.reduce((total, element) => {
                return total = (element === prevPlayer) ? total + 1 : total;
            }, 0);
            // if the full row has all buttons filled (all n) and are equal to previous player symbol) then return true
            if(numMatches === n){
                // createHighlight();
                return true;
            }
            
        }
        // there are no full rows that match
        return false;
    }
    function checkColumns(){

    }
    function checkDiagonals(){

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