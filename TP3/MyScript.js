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

var firstBoard = [
    [empty, orange, empty, empty],
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
    board = ArrBoards[ArrBoards.length - 1];

    if(playerNum == 1) {
        board[linha-1][coluna-1] = brown;
    }
    else
        board[linha-1][coluna-1] = orange;

    ArrBoards.push(board);

    return board;
}

function requestValidMoves(linha, coluna, moveDir, board) {

    var validMoves = getPrologRequest("player_move(" + parseToPlog(board) + "," + linha.toString() + "," + coluna.toString() + "," + moveDir.toString() + ")",
        8081, null, null);
    console.log(validMoves);
    var validMovesConverted = JSON.parse(validMoves);
    // http://localhost:8081/cpu_move([[empty,empty,empty,orange],[empty,empty,empty,empty],[empty,empty,empty,empty],[empty,empty,empty,orange]],1,4,2)

    return validMovesConverted;
}

function checkValidMove(customId, playerNum, moveDir) {

    var lastBoard = ArrBoards[ArrBoards.length - 1];
    var lastMove = ArrLastMoves[ArrLastMoves.length -1];

    var validMoves = requestValidMoves(lastMove[0], lastMove[1], lastMove[2], lastBoard);
    console.log(validMoves);

    var linha = Math.trunc(customId/10);
    var coluna = customId % 10;
    var lc = [linha, coluna];
    console.log(lc);

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