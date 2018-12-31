% Removes directions from all Row's cells
removeRowDirections(R, F) :- removeRowDirections(R, [], F).
removeRowDirections([], Acc, FinalRow) :- reverse(Acc, FinalRow).
removeRowDirections(Row, Acc, FinalRow) :-
  Row = [H|T],
  removeCellDirection(H, HN),
  removeRowDirections(T, [HN | Acc], FinalRow).

% Removes directions from all Board's rows
removeBoardDirections(B, F) :- removeBoardDirections(B, [], F).
removeBoardDirections([], Acc, FinalBoard) :- reverse(Acc, FinalBoard).
removeBoardDirections(Board, Acc, FinalBoard) :-
  Board = [H|T],
  removeRowDirections(H, HN),
  removeBoardDirections(T, [HN | Acc], FinalBoard).

% Checks if row has winning Num combination of El
checkRow_Won_Element(R, E, N, F) :- checkRow_Won_Element(R, E, N, 0, F).
checkRow_Won_Element(_, _, Num, Num, Final) :-
  Final is 1.
checkRow_Won_Element([], _, Num, Acc, 0).
checkRow_Won_Element(Row, El, Num, Acc, Final) :-
  Row = [H|T],
  (H = El ->
    NAcc is Acc + 1,
    checkRow_Won_Element(T, El, Num, NAcc, Final)
  ;
    NAcc is 0,
    checkRow_Won_Element(T, El, Num, NAcc, Final)
  ).

% Checks if board has winner, in horizontal rows
% Winner:
% 0 none
% 1 brown
% 2 orange
checkBoardRows([], 0, _).
checkBoardRows(Board, Winner, Num) :-
  Board = [H|T],
  checkRow_Won_Element(H, brown, Num, B),
  checkRow_Won_Element(H, orange, Num, O),
  (B = 1 ->
    Winner is 1
  ;
    O = 1 ->
      Winner is 2
    ;
      checkBoardRows(T, Winner, Num)
  ).

% Checks if board has winner, in vertical rows
% Winner:
% 0 none
% 1 brown
% 2 orange
then_checkBoardCols(0, _, 0, _, 0).
then_checkBoardCols(_, _, 1, _, 1).
then_checkBoardCols(_, _, 2, _, 2).
then_checkBoardCols(N, Board, Winner, Num, H_Winner) :-
  length(Board, BoardSize),
  getCol(Board, BoardSize, N, Col),
  checkRow_Won_Element(Col, brown, Num, B),
  checkRow_Won_Element(Col, orange, Num, O),
  (B = 1 ->
    Winner is 1
  ;
    O = 1 ->
      Winner is 2
    ;
      Count is N - 1,
      then_checkBoardCols(Count, Board, Winner, Num, H_Winner)
  ).

game_over(Board, Winner, Num) :-
  removeBoardDirections(Board, FBoard), % Remove all directions
  checkBoardRows(FBoard, HWinner, Num),
  length(FBoard, FBSize),
  then_checkBoardCols(FBSize, FBoard, Winner, Num, HWinner).

%checkRow_Won(Row).

getRow(Board, Row, 1) :-
  Board = [Row | _].

getRow(Board, Row, Number) :-
  Count is Number - 1,
  Board = [_|T],
  getRow(T, Row, Count).

getCol(_, 0, _, Acc, Acc).

getCol(Board, Number, Letter, Col) :- getCol(Board, Number, Letter, [], Col).

getCol(Board, Number, Letter, Acc, Col) :-
  Count is Number - 1,
  getRow(Board, Row, Number),
  getElementFromRow(Row, Piece, Letter),
  getCol(Board, Count, Letter, [Piece|Acc], Col).

getElementFromRow(Row, Piece, 1) :-
  Row = [Piece | _].

getElementFromRow(Row, Piece, Letter) :-
  Count is Letter - 1,
  Row = [_ | T],
  getElementFromRow(T, Piece, Count).

getPiece(Board, Piece, Letter, Number) :-
  getRow(Board, Row, Number),
  getElementFromRow(Row, Piece, Letter).

is_last_move(MoveNumber, MoveLetter, El) :-
  El = [MoveNumber, MoveLetter].

remove_last_move(MoveNumber, MoveLetter, ValidMoves, List) :-
  exclude(is_last_move(MoveNumber, MoveLetter), ValidMoves, List).

valid_moves_row_horizontal_check_empty(empty, Count, Size, MoveNumber, Letter, T, Acc, List) :-
  valid_moves_row_horizontal(Count, Size, MoveNumber, T, [[MoveNumber,Letter] | Acc], List).

valid_moves_row_horizontal_check_empty(_, Count, Size, MoveNumber, Letter, T, Acc, List) :-
  valid_moves_row_horizontal(Count, Size, MoveNumber, T, Acc, List).


valid_moves_row_horizontal(0, _, _, Row, Acc, Acc).

valid_moves_row_horizontal(N, Size, MoveNumber, Row, Acc, List) :-
  Count is N - 1,
  Letter is Size - Count,
  Row = [H|T],
  valid_moves_row_horizontal_check_empty(H, Count, Size, MoveNumber, Letter, T, Acc, List).

% Horizontal
valid_moves(Board, MoveNumber, MoveLetter, 1, ListOfMoves) :-
  length(Board, Size),
  getRow(Board, Row, MoveNumber),
  valid_moves_row_horizontal(Size, Size, MoveNumber, Row, [], ListOfMoves).



valid_moves_row_vertical_check_empty(empty, Count, Size, MoveLetter, Number, T, Acc, List) :-
  valid_moves_row_vertical(Count, Size, MoveLetter, T, [[Number, MoveLetter]|Acc], List).

valid_moves_row_vertical_check_empty(_, Count, Size, MoveLetter, Number, T, Acc, List) :-
  valid_moves_row_vertical(Count, Size, MoveLetter, T, Acc, List).


valid_moves_row_vertical(0, _, _, Col, Acc, Acc).

valid_moves_row_vertical(N, Size, MoveLetter, Col, Acc, List) :-
  Count is N - 1,
  Number is Size - Count,
  Col = [H|T],
  valid_moves_row_vertical_check_empty(H, Count, Size, MoveLetter, Number, T, Acc, List).

% Vertical
valid_moves(Board, MoveNumber, MoveLetter, 2, ListOfMoves) :-
  length(Board, Size),
  getCol(Board, Size, MoveLetter, Col),
  valid_moves_row_vertical(Size, Size, MoveLetter, Col, [], ListOfMoves).

updateBoard_generateLine(N, Acc, NewBoard, IParent, N, IParent, NewPiece, Board) :-
  N1 is N - 1,
  updateBoard_generateLine(N1, [NewPiece| Acc], NewBoard, IParent, N, _, NewPiece, Board).

updateBoard_generateLine(N, Acc, NewBoard, IParent, Letter, MV, NewPiece, Board) :-
  N > 0, !,
  N1 is N - 1,
  getPiece(Board, OldPiece, N, IParent),
  removeCellDirection(OldPiece, OldNoDirection),
  updateBoard_generateLine(N1, [OldNoDirection| Acc], NewBoard, IParent, Letter, MV, NewPiece, Board).

updateBoard_generateLine(0, Acc, Acc, _, _, _, _, _).

move(N, NewBoard, Letter, MV, NewPiece, Board) :- move(N, N, [], NewBoard, Letter, MV, NewPiece, Board).
move(N, NumLetters, Acc, NewBoard, Letter, MV, NewPiece, Board) :-
  N > 0,
  N1 is N - 1, !,
  updateBoard_generateLine(NumLetters, [], L, N, Letter, MV, NewPiece, Board),
  move(N1, NumLetters, [L | Acc], NewBoard, Letter, MV, NewPiece, Board).
move(_, _, Acc, Acc, _, _, _, _).


generateBoardLine(N, B) :- generateBoardLine(N, [], B).

generateBoardLine(N, Acc, B) :-
  N > 0, !,
  N1 is N - 1,
  generateBoardLine(N1, [empty| Acc], B).

generateBoardLine(0, Acc, Acc).

generateBoard(N, B) :- generateBoard(N, N, [], B).

generateBoard(N, LN, Acc, B) :-
  N > 0,
  N1 is N - 1, !,
  generateBoardLine(LN, L),
  generateBoard(N1, LN, [L | Acc], B).

generateBoard(_, _, Acc, Acc).
