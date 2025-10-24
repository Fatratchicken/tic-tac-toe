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
    
    return {getBoard, placePiece, resetBoard};
}());

//factory function for player:
const Player = function(player_symbol){
    const getInput = () => {
        let user_input = prompt('Enter an index:');
        user_input = user_input.split(',');

        GameBoard.placePiece(user_input[0], user_input[1], player_symbol);

    };

    return {player_symbol, getInput};
};