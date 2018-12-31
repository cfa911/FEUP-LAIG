/*

  convert_to_letters(MoveList, FinalList):

  Converts a Movelist from format:

    [[1,1], [1,2]]

  Into a FinalList with format:

    [[1,a],[1,b]]

  Used to display a list of valid moves to the user
  in a format to assist in inputing his next move.

*/
convert_to_letters(M, F) :- convert_to_letters(M, [], F).
convert_to_letters([], Acc, Acc).
convert_to_letters(MoveList, Acc, FinalList) :-
  length(MoveList, Count),
  %N1 is Count - 1,
  MoveList = [[H1|H2]|T],
  LNumber is H2 + 96,
  atom_codes(Letter, [LNumber]),
  convert_to_letters(T, [[H1,Letter]|Acc], FinalList).

/*
  pieRule: Sets the next player and the turn number to be coincident
  to Player 2's reply of the Pie Rule (Possibility of swapping pieces with the other player).

  If Player 2 decided 'YES' to the Pie Rule:
    Sets the NextPlayer to be Player 1 and the NextPlayNumber to be 3.

  If Player 2 decided 'NO' to the Pie Rule:
    Sets te NextPlayer to be Player 2 and the NextPlayNumber to continue as 2.
*/
pieRule(1, NextPlayer, NextPlayNumber) :- NextPlayer is 1, NextPlayNumber is 3.
pieRule(2, NextPlayer, NextPlayNumber) :- NextPlayer is -1, NextPlayNumber is 2.

% Ends game if user won or no more valid moves.
check_game_ended(0, []) :-
  write('Woah, we don\'t have a winner!'), nl,
  write('I guess we\'re all winners today.'), nl, nl,
  write('See you next time!'), nl, nl,
  halt.
check_game_ended(0, _).
check_game_ended(1, _) :-
  write('Congratulations player browny!'),
  halt.
check_game_ended(2, _) :-
  write('Congratulations player orangy!'),
  halt.

/*

  loop_common: Runs stuff common to each game loop iteration.

  Displays the board, displays the current game's stats, asks for the next move,
  validates the move inserted and calls the next loop iteration if successfull.

*/
loop_common(N, Board, Color, NextBoard, Player, PlayNumber, NextPlayer, NextPlayNumber, CurrValid, NextValid, WNum) :-
  display_game(Board),
  game_over(Board, Winner, WNum),
  check_game_ended(Winner, CurrValid),
  displayStats(Player, PlayNumber),
  askNextMove(MoveNumber, MoveLetter, MoveDirection),
  letter_to_number(MoveLetter, MoveLetterConverted),

  % check if valid

  (
    member([MoveNumber, MoveLetterConverted], CurrValid) ->
    % compile next valid
    valid_moves(Board, MoveNumber, MoveLetterConverted, MoveDirection, L),
    remove_last_move(MoveNumber, MoveLetterConverted, L, NextValid),

    getMoveCell(Color, MoveDirection, MoveCell),
    move(N, NextBoard, MoveLetterConverted, MoveNumber, MoveCell, Board),
    NextPlayer is Player * (-1),
    NextPlayNumber is PlayNumber + 1,
    write('\e[H\e[2J')
  ;
    % This only happens in the first iteration
    CurrValid = -1 ->
    % compile next valid
    valid_moves(Board, MoveNumber, MoveLetterConverted, MoveDirection, L),
    remove_last_move(MoveNumber, MoveLetterConverted, L, NextValid),

    getMoveCell(Color, MoveDirection, MoveCell),
    move(N, NextBoard, MoveLetterConverted, MoveNumber, MoveCell, Board),
    NextPlayer is Player * (-1),
    NextPlayNumber is PlayNumber + 1,
    write('\e[H\e[2J')

  ;
    write('\e[H\e[2J'),
    displayNotValidMove(CurrValid),
    loop_common(N, Board, Color, NextBoard, Player, PlayNumber, NextPlayer, NextPlayNumber, CurrValid, NextValid, WNum)
  ).

% Generates a random valid move
choose_move(ValidMoves, MoveNumber, MoveLetter, MoveDirection) :-
  length(ValidMoves, Size),
  USize is Size + 1,
  random(1, USize, Seed),
  getElementFromList(Seed, ValidMoves, [MoveNumber, MoveLetter]),
  random(1, 3, MoveDirection).

% Plays the turn of the cpu
loop_common_cpu(N, Board, Color, NextBoard, Player, PlayNumber, NextPlayer, NextPlayNumber, CurrValid, NextValid, WNum) :-
  display_game(Board),
  game_over(Board, Winner, WNum),
  check_game_ended(Winner, CurrValid),
  choose_move(CurrValid, MoveNumber, MoveLetterConverted, MoveDirection),
  valid_moves(Board, MoveNumber, MoveLetterConverted, MoveDirection, L),
  remove_last_move(MoveNumber, MoveLetterConverted, L, NextValid),
  getMoveCell(Color, MoveDirection, MoveCell),
  move(N, NextBoard, MoveLetterConverted, MoveNumber, MoveCell, Board),
  NextPlayer is Player * (-1),
  NextPlayNumber is PlayNumber + 1,
  write('\e[H\e[2J').

% Normal loops, for Player vs Player
loop(N, WNum, Board, orange, Player, 2, CurrValid) :- % Hardcoded "pie rule"
  write('\e[H\e[2J'),
  display_game(Board),
  askPieRule(NextPlayer, NextPlayNumber),
  loop(N, WNum, Board, orange, NextPlayer, NextPlayNumber, CurrValid).
loop(N, WNum, Board, orange, Player, PlayNumber, CurrValid) :-
  loop_common(N, Board, orange, NextBoard, Player, PlayNumber, NextPlayer, NextPlayNumber, CurrValid, NextValid, WNum),
  loop(N, WNum, NextBoard, brown, NextPlayer, NextPlayNumber, NextValid).
loop(N, WNum, Board, brown, Player, PlayNumber, CurrValid) :-
  loop_common(N, Board, brown, NextBoard, Player, PlayNumber, NextPlayer, NextPlayNumber, CurrValid, NextValid, WNum),
  loop(N, WNum, NextBoard, orange, NextPlayer, NextPlayNumber, NextValid).

% Loops for Player vs CPU
loop_p_cpu(N, WNum, Board, orange, Player, PlayNumber, CurrValid) :-
  loop_common_cpu(N, Board, orange, NextBoard, Player, PlayNumber, NextPlayer, NextPlayNumber, CurrValid, NextValid, WNum),
  loop_p_cpu(N, WNum, NextBoard, brown, NextPlayer, NextPlayNumber, NextValid).
loop_p_cpu(N, WNum, Board, brown, Player, PlayNumber, CurrValid) :-
  loop_common(N, Board, brown, NextBoard, Player, PlayNumber, NextPlayer, NextPlayNumber, CurrValid, NextValid, WNum),
  loop_p_cpu(N, WNum, NextBoard, orange, NextPlayer, NextPlayNumber, NextValid).

% Loops for CPU vs CPU
loop_cpu_cpu(N, WNum, Board, orange, Player, PlayNumber, CurrValid) :-
  loop_common_cpu(N, Board, orange, NextBoard, Player, PlayNumber, NextPlayer, NextPlayNumber, CurrValid, NextValid, WNum),
  loop_cpu_cpu(N, WNum, NextBoard, brown, NextPlayer, NextPlayNumber, NextValid).
loop_cpu_cpu(N, WNum, Board, brown, Player, PlayNumber, CurrValid) :-
  loop_common_cpu(N, Board, brown, NextBoard, Player, PlayNumber, NextPlayer, NextPlayNumber, CurrValid, NextValid, WNum),
  loop_cpu_cpu(N, WNum, NextBoard, orange, NextPlayer, NextPlayNumber, NextValid).

% Starts game for Player vs Player
runGameOfType(1, WNum, N, Board) :-
  write('\e[H\e[2J'),
  loop(N, WNum, Board, brown, 1, 1, -1).

% Starts game for Player vs CPU
runGameOfType(2, WNum, N, Board) :-
  write('\e[H\e[2J'),
  loop_p_cpu(N, WNum, Board, brown, 1, 1, -1).

% Starts game for CPU vs CPU
runGameOfType(3, WNum, N, Board) :-
  write('\e[H\e[2J'),
  N1 is N + 1,
  % Random initial 'valid moves'
  random(1, N1, MN),
  random(1, N1, MN1),
  random(1, N1, ML),
  random(1, N1, ML1),
  loop_cpu_cpu(N, WNum, Board, brown, 1, 1, [[MN,ML], [MN1,ML1], [MN, MN], [ML, ML]]).

