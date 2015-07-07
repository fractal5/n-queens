/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findNRooksSolution = function(n) {
  var solutionArray = []; //fixme
  var newBoard = new Board({n:n});
  var columnArray;

  //  loop though n
  //    create an empty array with all zeros
  //    set n'th index to one
  //    push this array to solution array
  //  return solution

  // Loop thorugh all the rows
  // for (var i = 0; i < n; i++) {
  //   columnArray = [];

  //   // loop through all the columns
  //   for (var j = 0; j < n; j++) {

  //     // if at diagonal set to 1 else 0;
  //     if (i === j) {
  //       columnArray[j] = 1;  
  //     } else {
  //       columnArray[j] = 0;
  //     }
  //   }
  //   solution.push(columnArray);
  // }
  solveBoard(0, newBoard, function(board) {return board.hasAnyRooksConflicts();}, solutionArray);

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solutionArray[0]));
  return solutionArray[0];
};



// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0; //fixme
  var newBoard = new Board({n:n});

  // for (var i = n; i > 1; i--) {
  //   solutionCount *= i;
  // }

  // Solution count = n! 
  solutionCount = solveBoard(0, newBoard, function(board){return board.hasAnyRooksConflicts(); }, []);

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

window.solveBoard = function(row, board, conflictFn ,solutions) {
  var solution = 0;
  var n = board.get('n');

  var recurseBoard = function(row, board) {
    
    // for the columns in the given row
    for (var col = 0; col < n; col++) {
      // Try the next possible position
      board.togglePiece(row, col);

      // if the position is a legal non conflicting one
      if (!conflictFn(board)) {
        //console.log("Found Legal Move for ", n, " Queens : ", row, " , ", col);
        // and if we're on the last row, we found a valid solution
        if (row === (n - 1)) {
          //debugger;
          // we need to provide a new copy of the board to push to solution
          //var currSolution = board.rows().slice(0);
          //console.log("currSolution added: ", currSolution);

          // Make a deep copy of the board solution
          var rowsCopy = JSON.parse(JSON.stringify(board.rows()));
          solutions.push(rowsCopy);
          //solutions.push(currSolution)
          // break;
          solution++;
        // otherwise we must increment which row we are on, make a copy of our current board, and recurse
        } else {
          //console.log("Row : ", row);
          var newRow = row + 1;
          // recurse 
          var newBoard = board.copyBoard(); 
          //console.log("NewBoard: ", newBoard.rows());
          // recurseBoard(newRow, newBoard);   
          // if (solution.length > 0) {
          //   break;
          // }
          recurseBoard(newRow, newBoard);
        }
        // We reach the end of this solution branch so we need to reset the previous move
        board.togglePiece(row, col);
      // if the position is not a legal one, remove the piece
      } else {
        board.togglePiece(row, col);
      }
    }
  }
  recurseBoard(row, board);
  return solution;

}


// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  // var solution = [];
  var solutionArray = [];
  var testBoard = new Board({n:n});

  // var recurseBoard = function(row, board) {

  //   // for the columns in the given row
  //   for (var col = 0; col < n; col++) {
  //     // Try the next possible position
  //     board.togglePiece(row, col);

  //     // if the position is a legal non conflicting one
  //     if (!board.hasAnyConflicts()) {
  //       //console.log("Found Legal Move for ", n, " Queens : ", row, " , ", col);
  //       // and if we're on the last row, we found a valid solution
  //       if (row === (n - 1)) {
  //         // debugger;
  //         // solution.push(board.rows());
  //         // break;
  //         return board.rows();
  //       // otherwise we must increment which row we are on, make a copy of our current board, and recurse
  //       } else {
  //         //console.log("Row : ", row);
  //         var newRow = row + 1;
  //         // recurse 
  //         var newBoard = board.copyBoard(); 
  //         //console.log("NewBoard: ", newBoard.rows());
  //         // recurseBoard(newRow, newBoard);   
  //         // if (solution.length > 0) {
  //         //   break;
  //         // }
  //         var result = recurseBoard(newRow, newBoard);
  //         if (result !== undefined) {
  //           return result;
  //         }
  //       }
  //       // We reach the end of this solution branch so we need to reset the previous move
  //       board.togglePiece(row, col);
  //     // if the position is not a legal one, remove the piece
  //     } else {
  //       board.togglePiece(row, col);
  //     }
  //   }

  // }

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
  // solution = recurseBoard(0, testBoard);
  // console.log("Calculated Solution : ", solution);
  // if (solution === undefined) {
  //   solution = [];
  // }
  // return solution;
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0; //fixme
  var TestBoard = new Board({n: n});
  var row = 0;
  // var col;

  // loop through row
    // toggle next pos on row
    // if legal 
    //  if row is last row 
    //     return we found a solution;
    //  else 
    //      increment row;
    //      recurse
    // else then untoggle

  // var recurseBoard = function(row, board) {
  //   //console.log(board.rows());

  //   // for the columns in the given row
  //   for (var col = 0; col < n; col++) {
  //     // Try the next possible position
  //     board.togglePiece(row, col);

  //     // if the position is a legal non conflicting one
  //     if (!board.hasAnyConflicts()) {
  //       //console.log("Found Legal Move for ", n, " Queens : ", row, " , ", col);
  //       // and if we're on the last row, we found a valid solution
  //       if (row === (n - 1)) {
  //         solutionCount++;
  //       // otherwise we must increment which row we are on, make a copy of our current board, and recurse
  //       } else {
  //         //console.log("Row : ", row);
  //         var newRow = row + 1;
  //         // recurse 
  //         var newBoard = board.copyBoard(); 
  //         //console.log("NewBoard: ", newBoard.rows());
  //         recurseBoard(newRow, newBoard);   
  //       }
  //       // We reach the end of this solution branch so we need to reset the previous move
  //       board.togglePiece(row, col);
  //     // if the position is not a legal one, remove the piece
  //     } else {
  //       board.togglePiece(row, col);
  //     }
  //   }

  // }

  // We can indeed put 0 queens onto a non existent board 
  if (n === 0) {
    solutionCount = 1;
  // otherwise do the ususal test
  } else {
    solutionCount = solveBoard(0, TestBoard, function (board) {return board.hasAnyQueensConflicts(); }, []);
  }

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};




