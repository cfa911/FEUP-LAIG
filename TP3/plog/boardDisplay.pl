/*
* displayBoard.pl: Module to display board.
*/

/*
print_numbers_to_ascii(AsciiList)

  Converts characters from an ascii list and outputs it.

  Parameters:
    AsciiList: a list containing ascii characters

*/
print_numbers_to_ascii(AsciiList) :-
  atom_codes(Result, AsciiList), write(Result).

print_underscore :- write('_').

print_left_separator :- write('|     ').

display_BarraUnderscore :- write('|_____').

forloop_writeLetters(High, High) :- !.
forloop_writeLetters(Low, High) :-
  print_numbers_to_ascii([Low]), write('     '),
  Inc is Low + 1,
  forloop_writeLetters(Inc, High).

writeBoard_Square_TopRow(N) :-
  write('   '),
  End is 97 + N,
  forloop_writeLetters(97, End),
  write('\n').

forloop_writeUnderscore(High, High) :- !.
forloop_writeUnderscore(Low, High) :-
  print_underscore,
  Inc is Low + 1,
  forloop_writeUnderscore(Inc, High).

forloop_writeUnderscoreAdditional(High, High) :- !.
forloop_writeUnderscoreAdditional(Low, High) :-
  print_underscore,
  Inc is Low + 1,
  forloop_writeUnderscore(Inc, High).

writeBoard_Square_InitialRow(N) :-
  End1 is N * 5 + 1,
  forloop_writeUnderscore(0, End1),
  End2 is N - 2,
  forloop_writeUnderscoreAdditional(0, End2),
  write('\n').

forloop_writeSplit(High, High) :- write('\n').
forloop_writeSplit(Low, High) :-
  print_left_separator,
  Inc is Low + 1,
  forloop_writeSplit(Inc, High).

writeBoard_Square_MedianRow(N) :-
  End is N + 1,
  forloop_writeSplit(0, End).

forloop_writeSplitAdditional(High, High) :- write('|\n').
forloop_writeSplitAdditional(Low, High) :-
  display_BarraUnderscore,
  Inc is Low + 1,
  forloop_writeSplitAdditional(Inc, High).

writeBoard_Square_InterRow(N) :-
  End is N,
  forloop_writeSplitAdditional(0, End).

pieceRow_auxiliary(Arr) :-
  length(Arr, Len),
  ( Len > 0 ->
    Arr = [E1 | E2],
    writeCell(E1), write(' | '),
    pieceRow_auxiliary(E2); write('\n')).

writeBoard_Square_PieceRow(Arr) :-
  write('| '),
  pieceRow_auxiliary(Arr).

/*
writeCell(Piece): Outputs the desired Piece.

  Parameters:
    Piece: the type of the piece to be displayed

*/
writeCell(empty) :- write('   '), !.
writeCell(brown) :- write('[ ]'), !.
writeCell(brown_v) :- write('[|]'), !.
writeCell(brown_h) :- write('[-]'), !.
writeCell(brown_d1) :- write('[\\]'), !.
writeCell(brown_d2) :- write('[/]'), !.
writeCell(orange) :- write('( )'), !.
writeCell(orange_v) :- write('(|)'), !.
writeCell(orange_h) :- write('(-)'), !.
writeCell(orange_d1) :- write('(\\)'), !.
writeCell(orange_d2) :- write('(/)'), !.

% You can try a 4x4 with:
%
% writeBoard_Square(4, [[empty, orange, empty, empty], [empty, empty, empty, empty], [empty, brown, empty, empty], [empty, empty, empty, orange]]).
%
%
%
% In the same way, you can try a 5x5 with:
%
% writeBoard_Square(5, [[empty, orange, empty, empty, orange], [empty, empty, empty, empty, empty], [empty, brown, empty, empty, empty], [empty, empty, empty, orange, empty], [empty, empty, empty, orange, empty]]).

writeBoard_number(N, [E1 | E2]) :-
  length(E1, Len),
  Inc is N + 1,
    write('   '), writeBoard_Square_MedianRow(Len),
    write(' '), write(N), write(' '), writeBoard_Square_PieceRow(E1),
    write('   '), writeBoard_Square_InterRow(Len),
    writeBoard_number(Inc, E2), !.

writeBoard_number(_, []) :- write('\n').

display_game(Board) :-
  length(Board, N),
  write('\n   '), writeBoard_Square_TopRow(N),
  write('    '), writeBoard_Square_InitialRow(N),
  writeBoard_number(1, Board).


