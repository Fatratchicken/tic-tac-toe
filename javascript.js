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
            return true;
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
            return true;
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

        let placement = GameBoard.placePiece(user_input[0], user_input[1], player_symbol);

        if (placement !== undefined){
            alert(placement);

            getInput();
        }
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

//IIFE factory function for gameplay:
const GamePlay = (function(){
    let game_over = false;

    let player_turns = [Player_x, Player_O];

    while(!game_over){
        current_player = player_turns[0];

        current_player.getInput(current_player.player_symbol);

        game_over = GameBoard.checkWin(current_player.player_symbol);
    
        // swap players: 
        player_turns = [player_turns.pop(), player_turns.shift()];
    }

    console.log(`Player ${player_turns[1].player_symbol} wins!`);

}());