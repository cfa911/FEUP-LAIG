function getPrologRequest(requestString, port, onSuccess, onError) {

    var requestPort = port || 8081;
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

    request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
    request.onerror = onError || function(){console.log("Error waiting for response");};

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}

var empty = "empty";
var orange = "orange";
var brown = "brown";

var firstBoard = [
    [empty, empty, empty, empty],
    [empty, empty, empty, empty],
    [empty, empty, empty, empty],
    [empty, empty, empty, empty]
];



function parseToPlog(board) {

    var boardPlog = "[";

    for(var i=0; i<4; i++) {

        boardPlog = boardPlog + "[";

        for(var j=0; j<4; j++) {
            boardPlog = boardPlog + board[i][j];
            console.log(board[i][j]);
            if(j != 3)
                boardPlog = boardPlog + ",";
        }

        if(i != 3)
            boardPlog = boardPlog + "],";
    }

    boardPlog = boardPlog + "]]";

    return boardPlog;
}