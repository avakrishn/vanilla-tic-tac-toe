'use-strict';

window.onload = function(){
    initApp();
}

function initApp(){
    const state ={
        size : 4,
        board : [],
        player : 'X',
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
                // btn.innerText = state.board[counter];
                row.append(btn);
                counter++;
            }
            app.append(row);
        }

        displayBoard();
        
    }

    function displayBoard(){
        const n = state.size;
        for(let i = 0; i < n*n; i++){
            const btn = document.querySelector(`.col${i}`);
            btn.innerText = state.board[i];
        }

        console.log(state.board);
        
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