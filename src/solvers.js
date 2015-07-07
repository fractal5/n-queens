/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting

// Returns the number of solutions for a given board starting at row with a given conflict test case ie Queens or Rooks
// Also accumulates solutions to solutions Array
window.bitSolveBoard = function(ld, cols, rd, callback, n) {
  var ALL = 1;
  for (var i = 1; i < n; i++) {
    ALL = 2* ALL + 1;
  }
  if (cols === ALL) {
    return callback();
  }

  var poss = ~(ld | cols | rd) & ALL;
  while ( poss ) {
    var bit = poss & -poss;
    poss -= bit;
    bitSolveBoard((ld|bit)<<1, cols|bit, (rd|bit)>>1, callback ,n);
  }


}

window.solveBoard = function(row, board, conflictFn, solutions) {

  var solution = 0;
  var n = board.get('n');

  var recurseBoard = function(row, board, isMiddleCol ) {
    
    // for the columns in the given row
    for (var col = 0; col < n; col++) {
      // Try the next possible position
      board.togglePiece(row, col);

      // if the position is a legal non conflicting one
      if (!conflictFn(board)) {
        // and if we're on the last row, we found a valid solution
        if (row === (n - 1)) {
          // we need to provide a new copy of the board to push to solution

          // Only store the first solution
          if (solutions.length === 0) {
            // Make a deep copy of the board solution
            var rowsCopy = JSON.parse(JSON.stringify(board.rows()));
            solutions.push(rowsCopy);   
          }

          // increment the number of found solutions
          if (isMiddleCol) {
            // Only count solutions once due to symmetry
            solution++;
          } else {
            solution += 2;
          }

        // otherwise we must increment which row we are on and recurse
        } else {
          recurseBoard(row + 1, board, isMiddleCol);
        }
      } 
      // We've returned from the previous solution branch so we need to reset the previous move
      board.togglePiece(row, col);
    }
  }

  // To solve for the fully symmetric 1x1 solution
  if (n === 1) {
    solutions.push([[1]]);
    solution++;
  } else {

    // we wish to optimize and only check half of the board and simply flip for the reflected solution
    // we first calculate the half way column
    var lastCol = Math.ceil(n / 2) - 1;
    for (var index = 0; index <= lastCol; index++) {

      // toggle piece on index column on zero-th row
      // we don't need to perform a conflict check since all positions are legal
      board.togglePiece(0, index);

      // If we are on the middle column of a odd board 
      var isMiddleCol = ((index === lastCol) && (n % 2));
      recurseBoard(1, board, isMiddleCol);

      // untoggle last legal move to reset board
      board.togglePiece(0, index);
    }
  }

  return solution;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other
window.findNRooksSolution = function(n) {

  var solutionArray = []; 
  var testBoard = new Board({n:n});
  
  solveBoard(0, testBoard, function(board) {return board.hasAnyRooksConflicts();}, solutionArray);

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solutionArray[0]));
  return solutionArray[0];
};



// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {

  var solutionCount = 0;
  var testBoard = new Board({n:n});

  solutionCount = solveBoard(0, testBoard, function(board){return board.hasAnyRooksConflicts(); }, []);

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};



// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {

  var solutionArray = [];
  var testBoard = new Board({n:n});

  if (n === 0) {
    console.log('Single solution for ' + n + ' queens:', JSON.stringify([]));
    return [];
  }
  else {
    solveBoard(0, testBoard, function(board) { return board.hasAnyQueensConflicts();}, solutionArray);
    if (solutionArray.length === 0) {
      var emptyBoard = new Board({n:n});
      console.log('Single solution for ' + n + ' queens:', JSON.stringify(emptyBoard.rows()));
      return emptyBoard.rows();
    }
    else {
      console.log('Single solution for ' + n + ' queens:', JSON.stringify(solutionArray[0]));
      return solutionArray[0];
    }
  }

};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0; //fixme
  var testBoard = new Board({n: n});

  // We can indeed put 0 queens onto a non existent board 
  if (n === 0) {
    solutionCount = 1;
  // otherwise do the ususal test
  } else {
    //solutionCount = solveBoard(0, testBoard, function (board) {return board.hasAnyQueensConflicts(); }, []);
    bitSolveBoard(0, 0, 0, function(){
      solutionCount++;
    }, n);
  }


  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};




