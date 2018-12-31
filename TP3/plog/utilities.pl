letter_to_number(Letter, Number) :-
  atom_codes(Letter, N),
  N = [Value | _],
  Number is Value - 96.

% Gets element from list by index
getElementFromList(I, L, E) :- getElementFromList(I, L, _, E).
getElementFromList(0, _, Acc, Acc).
getElementFromList(Index, List, Acc, Element) :-
  Count is Index - 1,
  List = [H|T],
  getElementFromList(Count, T, H, Element).

/*

  getMoveCell(+Color, +Direction, -Cell).

  Get Cell with the desired Direction.

  Parameters:
    Color: color of the Cell
    Direction: direction of the Cell
    Cell: the cell with the desired direction

*/
getMoveCell(brown, 1, brown_h).
getMoveCell(brown, 2, brown_v).
getMoveCell(brown, 3, brown_d1).
getMoveCell(brown, 4, brown_d2).

getMoveCell(orange, 1, orange_h).
getMoveCell(orange, 2, orange_v).
getMoveCell(orange, 3, orange_d1).
getMoveCell(orange, 4, orange_d2).


/*

  removeCellDirection(+Cell, -NewCell).

  Remove Cell's direction.

  Parameters:
    Color: color of the Cell
    Direction: direction of the Cell
    Cell: the cell with the desired direction

*/
removeCellDirection(empty, empty).
removeCellDirection(brown, brown).
removeCellDirection(orange, orange).

removeCellDirection(brown_h, brown).
removeCellDirection(brown_v, brown).
removeCellDirection(brown_d1, brown).
removeCellDirection(brown_d2, brown).

removeCellDirection(orange_h, orange).
removeCellDirection(orange_v, orange).
removeCellDirection(orange_d1, orange).
removeCellDirection(orange_d2, orange).
