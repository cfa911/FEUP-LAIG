includes :-
  ['utilities.pl'],['boardDisplay.pl'],['gameLogic.pl'],['boardLogic.pl'],['menu.pl'],['main.pl'],[library(lists)],[library(random)],
    write('\e[H\e[2J').

play :-
  %includes,
  menuIntro(N),
  generateBoard(N, MainBoard),
  questionWinningNum(WNum),
  questionTypeOfGame(GameChoice),
  runGameOfType(GameChoice, WNum, N, MainBoard).
