// File for Web Workers

//importScripts('src/solvers.js');

bitSolveBoard = function(ld, cols, rd, callback, n) {
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

// Each worker should set up the zeroth row for bitwise N-Queens
// solution count setting position i
onmessage = function(event) {
  var n = event.data.n;
  var i = event.data.i;
  var ld;
  var rd;
  var solutionCount = 0;

  // Set up cols, ld, rd
  var bit = 1;
  for (var index = 0; index < i; index++) {
    bit = bit<<1;
  }
  ld = bit << 1;
  rd = bit >> 1;

  bitSolveBoard(ld, bit, rd, function() {
    solutionCount++;
  }, n);

  postMessage(solutionCount);
}

