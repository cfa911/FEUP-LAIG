% Outputs the game header
menuHeader :-
  write('\n\n'),
  write('_____________________\n'),
  write('                     \n'),
  write('     COFFEE GAME     \n'),
  write('_____________________\n').

% Asks the user to insert the board size N
menuAskNumber(N) :-
  write('\n'),
  write('Please enter a board size: '),
  read(N),
  write('-------------------------------').

% Runs the initial menu
menuIntro(N):-
  menuHeader,
  menuAskNumber(N).

% Asks the user for the winning Number
questionWinningNum(WNum) :-
  nl, nl,
  write('Please enter N, the number of consecutive pieces needed to win\n'),
  read(WNum), nl,
  write('-------------------------------').


% Asks the user which type of game he wishes
questionTypeOfGame(GameChoice) :-
  nl,
  write('Please choose a type of game:'), nl, nl,
  write('\t 1. Player vs Player'), nl,
  write('\t 2. Player vs Computer'), nl,
  write('\t 3. Computer vs Computer'), nl,
  read(GameChoice), nl.

% Asks the user the direction of his move
questionDirection(Direction) :-
  nl,
  write('What is your desired direction?'), nl,
  write('\t 1. Horizontal -'), nl,
  write('\t 2. Vertical |'), nl,
  read(Direction).

% Asks for the next move
askNextMove(Number, Letter, Direction) :-
  nl,
  write('\tWhat is your next move?'),
  write('\n\n'),
  write('Number'), read(Number),
  write('Letter'), read(Letter),
  questionDirection(Direction).

% Displays who's turn it is
displayTurn(1) :-
  write('Player 1, you\'re up!'), write('\n').
displayTurn(-1) :-
  write('Player 2, you\'re up!'), write('\n').

% Displays the current play number
displayPlayNumber(PlayNumber) :-
  write('Current play number: '),
  write(PlayNumber),
  write('\n\n').

% Displays multiple stats of the game
displayStats(Player, PlayNumber) :-
  displayPlayNumber(PlayNumber),
  displayTurn(Player).

displayNotValidMove(ValidMoves) :-
  nl, nl,
  write('---------------------------------'), nl,
  write('That\'s not a valid move!'), nl,
  write('---------------------------------'), nl, nl,
  write('Valid moves are: '), nl,
  convert_to_letters(ValidMoves, VMFormatted),
  write(VMFormatted), nl, nl,
  write('Please try again!'), nl, nl,
  write('---------------------------------').


% Asks if player wishes to swap pieces
askPieRule(NextPlayer, NextPlayNumber) :-
  write('\n'),
  write('\nPIE RULE:'),
  write('\nPlayer 2, do you wish to swap pieces with Player 1 ?'),
  write('\n'),
  write('\t1. Yes'), write('\n'),
  write('\t2. No'), write('\n'),
  read(Reply),
  NextPlayNumber is 3,
  write('\e[H\e[2J'),
  pieRule(Reply, NextPlayer, NextPlayNumber).
