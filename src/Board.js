// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var conflict = false;
      var row = this.get(rowIndex); 

      for (var i = 0; i < row.length; i++) {
        if (row[i] === 1) {
          if (conflict) {
           return true;
          } else {
            conflict = true;
          }
        }
      }

      return false; // fixme
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var n = this.get('n');
      for (var i = 0; i < n; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var conflict = false;
      var col = [];
      var n = this.get('n');
      var i;

      for (i = 0; i < n; i++) {
        col.push(this.get(i)[colIndex]); 
      }

      // console.log("Test Column", col);
      for (i = 0; i < col.length; i++) {
        if (col[i] === 1) {
          if (conflict) {
           return true;
          } else {
            conflict = true;
          }
        }
      }

      return false; // fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var n = this.get('n');
      for (var i = 0; i < n; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var conflict = false; 
      var rowIndex = 0;
      var colIndex = majorDiagonalColumnIndexAtFirstRow;
      var n = this.get('n');

      // console.log("hasMajorDiagonalConflictAt: colIndex " + colIndex);

      // To offset starting positions (colIndex is negative) to legal board 
      // positions, increment the row, till colIndex = 0;
      if (colIndex < 0) {
        rowIndex -= colIndex;
        colIndex = 0;
      }

      while (this._isInBounds(rowIndex, colIndex)) {
        // console.log("inside while loop");
        if (this.rows()[rowIndex][colIndex] === 1) {
          if (conflict) {
            // console.log("conflict at " + rowIndex + " row and " + colIndex + " col.");
            return true;
          } else {
            conflict = true;
            // console.log("piece set at " + rowIndex + " row and " + colIndex + " col.");
          }
        } 
        rowIndex++;
        colIndex++;
      }

      return false; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var n = this.get('n');

      for (var i = -(n - 1); i < n ; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var conflict = false; 
      var rowIndex = 0;
      var colIndex = minorDiagonalColumnIndexAtFirstRow;
      var n = this.get('n');

      // console.log("hasMajorDiagonalConflictAt: colIndex " + colIndex);

      // To offset starting positions (colIndex is negative) to legal board 
      // positions, increment the row, till colIndex = 0;
      if (colIndex > n - 1) {
        rowIndex += colIndex - (n - 1);
        colIndex = n - 1;
      }

      while (this._isInBounds(rowIndex, colIndex)) {
        // console.log("inside while loop");
        if (this.rows()[rowIndex][colIndex] === 1) {
          if (conflict) {
            // console.log("conflict at " + rowIndex + " row and " + colIndex + " col.");
            return true;
          } else {
            conflict = true;
            // console.log("piece set at " + rowIndex + " row and " + colIndex + " col.");
          }
        } 
        rowIndex++;
        colIndex--;
      }

      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var n = this.get('n');

      for (var i = 0; i < 2 * (n - 1); i++) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    },

    hasAnyConflicts: function() {
      return (this.hasAnyRowConflicts() || this.hasAnyColConflicts() || 
              this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts());
    },

    copyBoard: function() {
      var n = this.get('n');
      var newBoard = new Board({n : n});

      for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
          newBoard.rows()[i][j] = this.rows()[i][j];
        }
      }
      return newBoard;   
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
