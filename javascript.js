//IIFE factory function for the gameboard:

const GameBoard = (function (){
    const board = [
        ['','',''],
        ['','',''],
        ['','','']
    ];

    const getBoard = () => board;

    const placePiece = function(index_x, index_y, player_symbol){
        if (board[index_y][index_x] !== ''){
            return 'Spot already taken!';
        }
        
        board[index_y][index_x] = player_symbol;
    }

    const resetBoard  = () => {
        for(let i = 0; i < board.length; i++){
            for (let j = 0; j < board.length; j++){
                board[i][j] = '';
            }
        }
    }

    const checkWin = function(player_symbol){
        // Check for row win:
        const row_win = board.reduce((accumulator, currentValue) => {
            if (currentValue.join('') === `${player_symbol}`.repeat(board.length)){
                return accumulator += false;
            }

            return accumulator += true;
        }, 0);

        if (row_win % 2 == 0){
            return [true, 'Row Win'];
        }

        //check for x cross win: 
        const cross_win = function() {
            let cross_length_one = 0;
            let cross_length_two = 0;

            for (let i = 0; i < board.length; i++){
                if (board[i][i] === player_symbol){
                    cross_length_one ++;
                }

                if (board[(board.length-1)- i][i] === player_symbol){
                    cross_length_two ++;
                }
            }

            if (cross_length_one === board.length || cross_length_two === board.length){
                return true;
            }

            return false;
        }

        if (cross_win()){
            return [true, 'Cross Win'];
        }

        // column win: 
        const column_win = function(){
            for (let i = 0; i < board.length; i++){
                let column_length = 0;
                
                for (let j = 0; j < board.length; j++){
                    if (board[j][i] === player_symbol){
                        column_length++;
                    }
                }

                if (column_length === board.length){
                    return true;
                }
            }

            return false;
        }

        if (column_win()){
            return [true, 'Column Win'];
        }

        // draw:
        const draw = function(){
            for(let i = 0; i < board.length; i++){
                for (let j = 0; j < board.length; j++){
                    if (board[i][j] === ''){
                        return false;
                    }
                }
            }
            
            return true;
        }

        if (draw()){
            return [true, 'Draw'];
        }

        return [false, ''];
    }
    
    return {getBoard, placePiece, resetBoard, checkWin};
}());

//factory function for creating player:
const createPlayer = function(player_symbol){
    const getInput = () => {
        let user_input = prompt(`${player_symbol} Enter an index:`);
        user_input = user_input.split(',');

        let placement = GameBoard.placePiece(user_input[0], user_input[1], player_symbol);

        if (placement !== undefined){
            alert(placement);

            getInput();
        }
    };

    const getInputDom = function(index){
        let placement = GameBoard.placePiece(index[0], index[1], player_symbol);

        if (placement != undefined){
            return placement;
        }
    };

    return {player_symbol, getInput, getInputDom};
};

//these use createPlayer (player) as their prototype:
const Player_X = (function() {
    const {player_symbol, getInput, getInputDom} = createPlayer('X');
    return {player_symbol, getInput, getInputDom};
}());

const Player_O = (function() {
    const {player_symbol, getInput, getInputDom} = createPlayer('O');
    return {player_symbol, getInput, getInputDom};
}());


const DomElements = (function(){
    const length = GameBoard.getBoard().length;
    const grid_container = document.getElementById('grid-container');

    grid_container.style.gridTemplateColumns = '1fr '.repeat(length).trim();
    grid_container.style.gridTemplateRows = '1fr '.repeat(length).trim();
    
    // create the grid
    const createGrid = function(){
        for (let i = 0; i < length; i++){
            for (let j = 0; j < length; j++){
                const new_cell = document.createElement('div');
                new_cell.classList.add('cell');
                new_cell.dataset.index = `${[i, j]}`;

                grid_container.appendChild(new_cell);
            }
        }
    }

    return {createGrid, grid_container};

}());

//IIFE function for gameplay:
const GamePlay = (function(){
    const consoleGame = function(){
        let game_over = false;

        let player_turns = [Player_X, Player_O];

        // for game draw: 
        let game_status = '';

        while(!game_over){
            current_player = player_turns[0];

            current_player.getInput();

            game_over = GameBoard.checkWin(current_player.player_symbol)[0];
            game_status = GameBoard.checkWin(current_player.player_symbol)[1];

            game_board = GameBoard.getBoard();
            
            for (let i = 0; i < game_board.length; i++){
                console.log(game_board[i]);
            }

            // swap players: 
            [player_turns[0], player_turns[1]] = [player_turns[1], player_turns[0]];
        }

        if (game_status == 'Draw'){
            console.log('Draw');
            return;
        }

        console.log(`Player ${player_turns[1].player_symbol} wins!`);
        GameBoard.resetBoard();
    }


    const domGame = function(){
        let game_over = false;
        let player_turns = [Player_X, Player_O];
        let current_player = player_turns[0];

        // for game draw: 
        let game_status = '';

        DomElements.createGrid();

        const handleClick = function(event){
            const target = event.target;

            if (target.classList.contains('cell') && !game_over){
                if (current_player.getInputDom(target.dataset.index.split(',')) === undefined){
                // dom changes: 
                    target.classList.add('clicked');
                    target.textContent = current_player.player_symbol;


                    game_over = GameBoard.checkWin(current_player.player_symbol)[0];
                    game_status = GameBoard.checkWin(current_player.player_symbol)[1];

                    [player_turns[0], player_turns[1]] = [player_turns[1], player_turns[0]];
                    current_player = player_turns[0];

                    console.log(GameBoard.getBoard());
                }
 
            }
        }
        
        DomElements.grid_container.addEventListener('click', (event) => handleClick(event));

    }

    return {consoleGame, domGame};


}());

GamePlay.domGame();

