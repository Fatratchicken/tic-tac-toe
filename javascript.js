//IIFE factory function for the gameboard:

const GameBoard = (function (){
    const board = [
        ['','',''],
        ['','',''],
        ['','','']
    ];

    const getBoard = () => board;

    const placePiece = function(index_x, index_y, player_symbol){
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
            return true;
        }

        return false;
    }
    
    return {getBoard, placePiece, resetBoard, checkWin};
}());


//factory function for creating player:
const createPlayer = function(player_symbol){
    const getInput = () => {
        let user_input = prompt(`${player_symbol} Enter an index:`);
        user_input = user_input.split(',');

        GameBoard.placePiece(user_input[0], user_input[1], player_symbol);

    };

    return {player_symbol, getInput};
};

//these use createPlayer (player) as their prototype:
const Player_x = (function() {
    const {player_symbol, getInput} = createPlayer('X');
    return {player_symbol, getInput};
}());

const Player_O = (function() {
    const {player_symbol, getInput} = createPlayer('O');
    return {player_symbol, getInput};
}());