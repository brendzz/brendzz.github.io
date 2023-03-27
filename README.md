Various tic tac toe games made in react.js

1. Swap Mode - Instead of placing a piece on your turn, you may swap an opponent’s piece to your own piece permanently, however your opponent then gets 2 turns. Played on a 4x4 square grid, get 4 in a row to win.

2. Move Mode - Instead of placing a piece on your turn, you may move pieces to any adjacent square. Moving onto an opponent’s piece replaces that square with your own piece permanently. Each player has a limited supply of 6 pieces each (pieces are returned to a player’s supply if they are replaced). Played on a 4x4 square grid that is Torus-like and wraps around on itself, get 4 in a row to win.

3. Move Mode Hex - Same as standard Move Move above except played on a hexagon grid. Same adjacency rules with edges wrapping around on each other, with the exception that middle square of the board is inaccessible and adjancency does not pass through it. Four in a row to win (note this must be a straight line).

Based on the React.js tutorial: https://react.dev/learn/tutorial-tic-tac-toe

AI is a modified version of the 4x4 Tic Tac Toe AI from @Everyone on Codepen: https://codepen.io/Everyone/pen/NejNOd

Play online here: https://brendzz.github.io/
