function getPrologRequest(requestString, port, onSuccess, onError) {

    var requestPort = port || 8081;
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, false);

    request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
    request.onerror = onError || function(){console.log("Error waiting for response");};

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
    return request.responseText;
}

var empty = "empty";
var orange = "orange";
var brown = "brown";
// temos de perguntar aos players as peças em linha ou coluna pra ganhar

var firstBoard = [
    [empty, empty, empty, empty],
    [empty, empty, empty, empty],
    [empty, empty, empty, empty],
    [empty, empty, empty, empty]
];


var ArrBoards = new Array();
var ArrLastMoves = new Array();
ArrBoards.push(firstBoard);
ArrLastMoves.push([1,2,1]);

// player 1 -> brown
// player 2 -> orange

function generateAndSaveBoard(customId, playerNum) {

    var linha = Math.trunc(customId/10);
    var coluna = customId % 10;
    var board = ArrBoards[ArrBoards.length - 1];

    if(playerNum == 1) {
        board[linha-1][coluna-1] = brown;
    }
    else
        board[linha-1][coluna-1] = orange;

    ArrBoards.push(board);

    return board;
}

// nesta funçao tens sempre que mandar a jogada anterior e o board anterior e ele da te os valid moves
// existe um array de boards e de ultimas jogadas, formato [linha,coluna,direcao]
function requestValidMoves(linha, coluna, moveDir, board) {

    var validMoves = getPrologRequest("player_move(" + parseToPlog(board) + "," + linha.toString() + "," + coluna.toString() + "," + moveDir.toString() + ")",
        8081, null, null);
    console.log(validMoves);
    var validMovesConverted = JSON.parse(validMoves);
    // http://localhost:8081/cpu_move([[empty,empty,empty,orange],[empty,empty,empty,empty],[empty,empty,empty,empty],[empty,empty,empty,orange]],1,4,2)

    return validMovesConverted;
}

// recebe a jogada q o jogador quer fazer e retorna true or false se for possivel ou nao
// este é o teu customId formato 12, numero do jogador e a direcao
// % MoveDirection = horizontal -> 1 vertical -> 2
// :customId: 12 (1 é linha, 2 é a coluna)
function checkValidMove(customId, playerNum, moveDir) {
    
    var lastBoard = ArrBoards[ArrBoards.length - 1];
    var lastMove = ArrLastMoves[ArrLastMoves.length -1];

    var validMoves = requestValidMoves(lastMove[0], lastMove[1], lastMove[2], lastBoard);
    console.log(validMoves);

    var linha = Math.trunc(customId/10);
    var coluna = customId % 10;
    var lc = [linha, coluna];
    console.log(lc);

    console.log(ArrBoards);
    
    lc = JSON.stringify(lc);
    validMoves = JSON.stringify(validMoves);
    var isIncluded = validMoves.indexOf(lc);
    if(isIncluded != -1) {
        ArrLastMoves.push([linha,coluna,moveDir]);
        generateAndSaveBoard(customId, playerNum);
        return true;
    }
    
    return false;
}

function gameOver(board) {

    var winner = getPrologRequest("game_over(" + parseToPlog(board) + "," + currentGameStatus.valueN.toString() + ")",
        8081, null, null);
    console.log(winner);
    var winnerConverted = JSON.parse(winner);
    // http://localhost:8081/cpu_move([[empty,empty,empty,orange],[empty,empty,empty,empty],[empty,empty,empty,empty],[empty,empty,empty,orange]],1,4,2)

    // retorna none -> 0, brown -> 1, orange -> 2
    return winnerConverted;

}

// simples parse para o request
function parseToPlog(board) {

    var boardPlog = "[";

    for(var i=0; i<4; i++) {

        boardPlog = boardPlog + "[";

        for(var j=0; j<4; j++) {
            boardPlog = boardPlog + board[i][j];
            if(j != 3)
                boardPlog = boardPlog + ",";
        }

        if(i != 3)
            boardPlog = boardPlog + "],";
    }

    boardPlog = boardPlog + "]]";

    return boardPlog;
}