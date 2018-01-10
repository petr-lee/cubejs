(function() {
  var BL, BR, Cnk, Cube, DB, DBL, DF, DFR, DL, DLF, DR, DRB, FL, FR, Include, N_FLIP, N_FRtoBR, N_PARITY, N_SLICE1, N_SLICE2, N_TWIST, N_UBtoDF, N_URFtoDLF, N_URtoDF, N_URtoUL, UB, UBR, UF, UFL, UL, ULB, UR, URF, allMoves1, allMoves2, computeMoveTable, computePruningTable, factorial, key, max, mergeURtoDF, moveTableParams, nextMoves1, nextMoves2, permutationIndex, pruning, pruningTableParams, ref, ref1, rotateLeft, rotateRight, value,
    slice1 = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Cube = this.Cube || require('./cube');

  ref = [0, 1, 2, 3, 4, 5, 6, 7], URF = ref[0], UFL = ref[1], ULB = ref[2], UBR = ref[3], DFR = ref[4], DLF = ref[5], DBL = ref[6], DRB = ref[7];

  ref1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], UR = ref1[0], UF = ref1[1], UL = ref1[2], UB = ref1[3], DR = ref1[4], DF = ref1[5], DL = ref1[6], DB = ref1[7], FR = ref1[8], FL = ref1[9], BL = ref1[10], BR = ref1[11];

  Cnk = function(n, k) {
    var i, j, s;
    if (n < k) {
      return 0;
    }
    if (k > n / 2) {
      k = n - k;
    }
    s = 1;
    i = n;
    j = 1;
    while (i !== n - k) {
      s *= i;
      s /= j;
      i--;
      j++;
    }
    return s;
  };

  factorial = function(n) {
    var f, i, o, ref2;
    f = 1;
    for (i = o = 2, ref2 = n; 2 <= ref2 ? o <= ref2 : o >= ref2; i = 2 <= ref2 ? ++o : --o) {
      f *= i;
    }
    return f;
  };

  max = function(a, b) {
    if (a > b) {
      return a;
    } else {
      return b;
    }
  };

  rotateLeft = function(array, l, r) {
    var i, o, ref2, ref3, tmp;
    tmp = array[l];
    for (i = o = ref2 = l, ref3 = r - 1; ref2 <= ref3 ? o <= ref3 : o >= ref3; i = ref2 <= ref3 ? ++o : --o) {
      array[i] = array[i + 1];
    }
    return array[r] = tmp;
  };

  rotateRight = function(array, l, r) {
    var i, o, ref2, ref3, tmp;
    tmp = array[r];
    for (i = o = ref2 = r, ref3 = l + 1; ref2 <= ref3 ? o <= ref3 : o >= ref3; i = ref2 <= ref3 ? ++o : --o) {
      array[i] = array[i - 1];
    }
    return array[l] = tmp;
  };

  permutationIndex = function(context, start, end, fromEnd) {
    var i, maxAll, maxB, maxOur, our, permName;
    if (fromEnd == null) {
      fromEnd = false;
    }
    maxOur = end - start;
    maxB = factorial(maxOur + 1);
    if (context === 'corners') {
      maxAll = 7;
      permName = 'cp';
    } else {
      maxAll = 11;
      permName = 'ep';
    }
    our = (function() {
      var o, ref2, results;
      results = [];
      for (i = o = 0, ref2 = maxOur; 0 <= ref2 ? o <= ref2 : o >= ref2; i = 0 <= ref2 ? ++o : --o) {
        results.push(0);
      }
      return results;
    })();
    return function(index) {
      var a, b, c, i1, j, k, o, p, perm, q, ref10, ref11, ref12, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, t, u, w, x, y, z;
      if (index != null) {
        for (i = o = 0, ref2 = maxOur; 0 <= ref2 ? o <= ref2 : o >= ref2; i = 0 <= ref2 ? ++o : --o) {
          our[i] = i + start;
        }
        b = index % maxB;
        a = index / maxB | 0;
        perm = this[permName];
        for (i = p = 0, ref3 = maxAll; 0 <= ref3 ? p <= ref3 : p >= ref3; i = 0 <= ref3 ? ++p : --p) {
          perm[i] = -1;
        }
        for (j = q = 1, ref4 = maxOur; 1 <= ref4 ? q <= ref4 : q >= ref4; j = 1 <= ref4 ? ++q : --q) {
          k = b % (j + 1);
          b = b / (j + 1) | 0;
          while (k > 0) {
            rotateRight(our, 0, j);
            k--;
          }
        }
        x = maxOur;
        if (fromEnd) {
          for (j = t = 0, ref5 = maxAll; 0 <= ref5 ? t <= ref5 : t >= ref5; j = 0 <= ref5 ? ++t : --t) {
            c = Cnk(maxAll - j, x + 1);
            if (a - c >= 0) {
              perm[j] = our[maxOur - x];
              a -= c;
              x--;
            }
          }
        } else {
          for (j = u = ref6 = maxAll; ref6 <= 0 ? u <= 0 : u >= 0; j = ref6 <= 0 ? ++u : --u) {
            c = Cnk(j, x + 1);
            if (a - c >= 0) {
              perm[j] = our[x];
              a -= c;
              x--;
            }
          }
        }
        return this;
      } else {
        perm = this[permName];
        for (i = w = 0, ref7 = maxOur; 0 <= ref7 ? w <= ref7 : w >= ref7; i = 0 <= ref7 ? ++w : --w) {
          our[i] = -1;
        }
        a = b = x = 0;
        if (fromEnd) {
          for (j = y = ref8 = maxAll; ref8 <= 0 ? y <= 0 : y >= 0; j = ref8 <= 0 ? ++y : --y) {
            if ((start <= (ref9 = perm[j]) && ref9 <= end)) {
              a += Cnk(maxAll - j, x + 1);
              our[maxOur - x] = perm[j];
              x++;
            }
          }
        } else {
          for (j = z = 0, ref10 = maxAll; 0 <= ref10 ? z <= ref10 : z >= ref10; j = 0 <= ref10 ? ++z : --z) {
            if ((start <= (ref11 = perm[j]) && ref11 <= end)) {
              a += Cnk(j, x + 1);
              our[x] = perm[j];
              x++;
            }
          }
        }
        for (j = i1 = ref12 = maxOur; ref12 <= 0 ? i1 <= 0 : i1 >= 0; j = ref12 <= 0 ? ++i1 : --i1) {
          k = 0;
          while (our[j] !== start + j) {
            rotateLeft(our, 0, j);
            k++;
            if (k > 100000) {
              return -1;
            }
          }
          b = (j + 1) * b + k;
        }
        return a * maxB + b;
      }
    };
  };

  Include = {
    twist: function(twist) {
      var i, o, ori, p, parity, v;
      if (twist != null) {
        parity = 0;
        for (i = o = 6; o >= 0; i = --o) {
          ori = twist % 3;
          twist = (twist / 3) | 0;
          this.co[i] = ori;
          parity += ori;
        }
        this.co[7] = (3 - parity % 3) % 3;
        return this;
      } else {
        v = 0;
        for (i = p = 0; p <= 6; i = ++p) {
          v = 3 * v + this.co[i];
        }
        return v;
      }
    },
    flip: function(flip) {
      var i, o, ori, p, parity, v;
      if (flip != null) {
        parity = 0;
        for (i = o = 10; o >= 0; i = --o) {
          ori = flip % 2;
          flip = flip / 2 | 0;
          this.eo[i] = ori;
          parity += ori;
        }
        this.eo[11] = (2 - parity % 2) % 2;
        return this;
      } else {
        v = 0;
        for (i = p = 0; p <= 10; i = ++p) {
          v = 2 * v + this.eo[i];
        }
        return v;
      }
    },
    cornerParity: function() {
      var i, j, o, p, ref2, ref3, ref4, ref5, s;
      s = 0;
      for (i = o = ref2 = DRB, ref3 = URF + 1; ref2 <= ref3 ? o <= ref3 : o >= ref3; i = ref2 <= ref3 ? ++o : --o) {
        for (j = p = ref4 = i - 1, ref5 = URF; ref4 <= ref5 ? p <= ref5 : p >= ref5; j = ref4 <= ref5 ? ++p : --p) {
          if (this.cp[j] > this.cp[i]) {
            s++;
          }
        }
      }
      return s % 2;
    },
    edgeParity: function() {
      var i, j, o, p, ref2, ref3, ref4, ref5, s;
      s = 0;
      for (i = o = ref2 = BR, ref3 = UR + 1; ref2 <= ref3 ? o <= ref3 : o >= ref3; i = ref2 <= ref3 ? ++o : --o) {
        for (j = p = ref4 = i - 1, ref5 = UR; ref4 <= ref5 ? p <= ref5 : p >= ref5; j = ref4 <= ref5 ? ++p : --p) {
          if (this.ep[j] > this.ep[i]) {
            s++;
          }
        }
      }
      return s % 2;
    },
    URFtoDLF: permutationIndex('corners', URF, DLF),
    URtoUL: permutationIndex('edges', UR, UL),
    UBtoDF: permutationIndex('edges', UB, DF),
    URtoDF: permutationIndex('edges', UR, DF),
    FRtoBR: permutationIndex('edges', FR, BR, true)
  };

  for (key in Include) {
    value = Include[key];
    Cube.prototype[key] = value;
  }

  computeMoveTable = function(context, coord, size) {
    var apply, cube, i, inner, j, k, move, o, p, q, ref2, results;
    apply = context === 'corners' ? 'cornerMultiply' : 'edgeMultiply';
    cube = new Cube;
    results = [];
    for (i = o = 0, ref2 = size - 1; 0 <= ref2 ? o <= ref2 : o >= ref2; i = 0 <= ref2 ? ++o : --o) {
      cube[coord](i);
      inner = [];
      for (j = p = 0; p <= 5; j = ++p) {
        move = Cube.moves[j];
        for (k = q = 0; q <= 2; k = ++q) {
          cube[apply](move);
          inner.push(cube[coord]());
        }
        cube[apply](move);
      }
      results.push(inner);
    }
    return results;
  };

  mergeURtoDF = (function() {
    var a, b;
    a = new Cube;
    b = new Cube;
    return function(URtoUL, UBtoDF) {
      var i, o;
      a.URtoUL(URtoUL);
      b.UBtoDF(UBtoDF);
      for (i = o = 0; o <= 7; i = ++o) {
        if (a.ep[i] !== -1) {
          if (b.ep[i] !== -1) {
            return -1;
          } else {
            b.ep[i] = a.ep[i];
          }
        }
      }
      return b.URtoDF();
    };
  })();

  N_TWIST = 2187;

  N_FLIP = 2048;

  N_PARITY = 2;

  N_FRtoBR = 11880;

  N_SLICE1 = 495;

  N_SLICE2 = 24;

  N_URFtoDLF = 20160;

  N_URtoDF = 20160;

  N_URtoUL = 1320;

  N_UBtoDF = 1320;

  Cube.moveTables = {
    parity: [[1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1], [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]],
    twist: null,
    flip: null,
    FRtoBR: null,
    URFtoDLF: null,
    URtoDF: null,
    URtoUL: null,
    UBtoDF: null,
    mergeURtoDF: null
  };

  moveTableParams = {
    twist: ['corners', N_TWIST],
    flip: ['edges', N_FLIP],
    FRtoBR: ['edges', N_FRtoBR],
    URFtoDLF: ['corners', N_URFtoDLF],
    URtoDF: ['edges', N_URtoDF],
    URtoUL: ['edges', N_URtoUL],
    UBtoDF: ['edges', N_UBtoDF],
    mergeURtoDF: []
  };

  Cube.computeMoveTables = function() {
    var len, name, o, ref2, scope, size, tableName, tables;
    tables = 1 <= arguments.length ? slice1.call(arguments, 0) : [];
    if (tables.length === 0) {
      tables = (function() {
        var results;
        results = [];
        for (name in moveTableParams) {
          results.push(name);
        }
        return results;
      })();
    }
    for (o = 0, len = tables.length; o < len; o++) {
      tableName = tables[o];
      if (this.moveTables[tableName] !== null) {
        continue;
      }
      if (tableName === 'mergeURtoDF') {
        this.moveTables.mergeURtoDF = (function() {
          var UBtoDF, URtoUL, p, results;
          results = [];
          for (URtoUL = p = 0; p <= 335; URtoUL = ++p) {
            results.push((function() {
              var q, results1;
              results1 = [];
              for (UBtoDF = q = 0; q <= 335; UBtoDF = ++q) {
                results1.push(mergeURtoDF(URtoUL, UBtoDF));
              }
              return results1;
            })());
          }
          return results;
        })();
      } else {
        ref2 = moveTableParams[tableName], scope = ref2[0], size = ref2[1];
        this.moveTables[tableName] = computeMoveTable(scope, tableName, size);
      }
    }
    return this;
  };

  allMoves1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

  nextMoves1 = (function() {
    var face, lastFace, next, o, p, power, q, results;
    results = [];
    for (lastFace = o = 0; o <= 5; lastFace = ++o) {
      next = [];
      for (face = p = 0; p <= 5; face = ++p) {
        if (face !== lastFace && face !== lastFace - 3) {
          for (power = q = 0; q <= 2; power = ++q) {
            next.push(face * 3 + power);
          }
        }
      }
      results.push(next);
    }
    return results;
  })();

  allMoves2 = [0, 1, 2, 4, 7, 9, 10, 11, 13, 16];

  nextMoves2 = (function() {
    var face, lastFace, len, next, o, p, power, powers, q, results;
    results = [];
    for (lastFace = o = 0; o <= 5; lastFace = ++o) {
      next = [];
      for (face = p = 0; p <= 5; face = ++p) {
        if (!(face !== lastFace && face !== lastFace - 3)) {
          continue;
        }
        powers = face === 0 || face === 3 ? [0, 1, 2] : [1];
        for (q = 0, len = powers.length; q < len; q++) {
          power = powers[q];
          next.push(face * 3 + power);
        }
      }
      results.push(next);
    }
    return results;
  })();

  pruning = function(table, index, value) {
    var pos, shift, slot;
    pos = index % 8;
    slot = index >> 3;
    shift = pos << 2;
    if (value != null) {
      table[slot] &= ~(0xF << shift);
      table[slot] |= value << shift;
      return value;
    } else {
      return (table[slot] & (0xF << shift)) >>> shift;
    }
  };

  computePruningTable = function(phase, size, currentCoords, nextIndex) {
    var current, depth, done, index, len, move, moves, next, o, p, ref2, table, x;
    table = (function() {
      var o, ref2, results;
      results = [];
      for (x = o = 0, ref2 = Math.ceil(size / 8) - 1; 0 <= ref2 ? o <= ref2 : o >= ref2; x = 0 <= ref2 ? ++o : --o) {
        results.push(0xFFFFFFFF);
      }
      return results;
    })();
    if (phase === 1) {
      moves = allMoves1;
    } else {
      moves = allMoves2;
    }
    depth = 0;
    pruning(table, 0, depth);
    done = 1;
    while (done !== size) {
      for (index = o = 0, ref2 = size - 1; 0 <= ref2 ? o <= ref2 : o >= ref2; index = 0 <= ref2 ? ++o : --o) {
        if (!(pruning(table, index) === depth)) {
          continue;
        }
        current = currentCoords(index);
        for (p = 0, len = moves.length; p < len; p++) {
          move = moves[p];
          next = nextIndex(current, move);
          if (pruning(table, next) === 0xF) {
            pruning(table, next, depth + 1);
            done++;
          }
        }
      }
      depth++;
    }
    return table;
  };

  Cube.pruningTables = {
    sliceTwist: null,
    sliceFlip: null,
    sliceURFtoDLFParity: null,
    sliceURtoDFParity: null
  };

  pruningTableParams = {
    sliceTwist: [
      1, N_SLICE1 * N_TWIST, function(index) {
        return [index % N_SLICE1, index / N_SLICE1 | 0];
      }, function(current, move) {
        var newSlice, newTwist, slice, twist;
        slice = current[0], twist = current[1];
        newSlice = Cube.moveTables.FRtoBR[slice * 24][move] / 24 | 0;
        newTwist = Cube.moveTables.twist[twist][move];
        return newTwist * N_SLICE1 + newSlice;
      }
    ],
    sliceFlip: [
      1, N_SLICE1 * N_FLIP, function(index) {
        return [index % N_SLICE1, index / N_SLICE1 | 0];
      }, function(current, move) {
        var flip, newFlip, newSlice, slice;
        slice = current[0], flip = current[1];
        newSlice = Cube.moveTables.FRtoBR[slice * 24][move] / 24 | 0;
        newFlip = Cube.moveTables.flip[flip][move];
        return newFlip * N_SLICE1 + newSlice;
      }
    ],
    sliceURFtoDLFParity: [
      2, N_SLICE2 * N_URFtoDLF * N_PARITY, function(index) {
        return [index % 2, (index / 2 | 0) % N_SLICE2, (index / 2 | 0) / N_SLICE2 | 0];
      }, function(current, move) {
        var URFtoDLF, newParity, newSlice, newURFtoDLF, parity, slice;
        parity = current[0], slice = current[1], URFtoDLF = current[2];
        newParity = Cube.moveTables.parity[parity][move];
        newSlice = Cube.moveTables.FRtoBR[slice][move];
        newURFtoDLF = Cube.moveTables.URFtoDLF[URFtoDLF][move];
        return (newURFtoDLF * N_SLICE2 + newSlice) * 2 + newParity;
      }
    ],
    sliceURtoDFParity: [
      2, N_SLICE2 * N_URtoDF * N_PARITY, function(index) {
        return [index % 2, (index / 2 | 0) % N_SLICE2, (index / 2 | 0) / N_SLICE2 | 0];
      }, function(current, move) {
        var URtoDF, newParity, newSlice, newURtoDF, parity, slice;
        parity = current[0], slice = current[1], URtoDF = current[2];
        newParity = Cube.moveTables.parity[parity][move];
        newSlice = Cube.moveTables.FRtoBR[slice][move];
        newURtoDF = Cube.moveTables.URtoDF[URtoDF][move];
        return (newURtoDF * N_SLICE2 + newSlice) * 2 + newParity;
      }
    ]
  };

  Cube.computePruningTables = function() {
    var len, name, o, params, tableName, tables;
    tables = 1 <= arguments.length ? slice1.call(arguments, 0) : [];
    if (tables.length === 0) {
      tables = (function() {
        var results;
        results = [];
        for (name in pruningTableParams) {
          results.push(name);
        }
        return results;
      })();
    }
    for (o = 0, len = tables.length; o < len; o++) {
      tableName = tables[o];
      if (this.pruningTables[tableName] !== null) {
        continue;
      }
      params = pruningTableParams[tableName];
      this.pruningTables[tableName] = computePruningTable.apply(null, params);
    }
    return this;
  };

  Cube.initSolver = function() {
    Cube.computeMoveTables();
    return Cube.computePruningTables();
  };

  Cube.prototype.solve = function(maxDepth) {
    var State, freeStates, moveNames, phase1, phase1search, phase2, phase2search, solution, state, x;
    if (maxDepth == null) {
      maxDepth = 22;
    }
    moveNames = (function() {
      var face, faceName, o, p, power, powerName, result;
      faceName = ['U', 'R', 'F', 'D', 'L', 'B'];
      powerName = ['', '2', "'"];
      result = [];
      for (face = o = 0; o <= 5; face = ++o) {
        for (power = p = 0; p <= 2; power = ++p) {
          result.push(faceName[face] + powerName[power]);
        }
      }
      return result;
    })();
    State = (function() {
      function State(cube) {
        this.parent = null;
        this.lastMove = null;
        this.depth = 0;
        if (cube) {
          this.init(cube);
        }
      }

      State.prototype.init = function(cube) {
        this.flip = cube.flip();
        this.twist = cube.twist();
        this.slice = cube.FRtoBR() / N_SLICE2 | 0;
        if (this.slice === -1) {
          return false;
        }
        this.parity = cube.cornerParity();
        this.URFtoDLF = cube.URFtoDLF();
        if (this.URFtoDLF === -1) {
          return false;
        }
        this.FRtoBR = cube.FRtoBR();
        if (this.FRtoBR === -1) {
          return false;
        }
        this.URtoUL = cube.URtoUL();
        if (this.URtoUL === -1) {
          return false;
        }
        this.UBtoDF = cube.UBtoDF();
        if (this.UBtoDF === -1) {
          return false;
        }
        return this;
      };

      State.prototype.solution = function() {
        if (this.parent) {
          return this.parent.solution() + moveNames[this.lastMove] + ' ';
        } else {
          return '';
        }
      };

      State.prototype.move = function(table, index, move) {
        if (index === -1) {
          return false;
        }
        return Cube.moveTables[table][index][move];
      };

      State.prototype.pruning = function(table, index) {
        return pruning(Cube.pruningTables[table], index);
      };

      State.prototype.moves1 = function() {
        if (this.lastMove !== null) {
          return nextMoves1[this.lastMove / 3 | 0];
        } else {
          return allMoves1;
        }
      };

      State.prototype.minDist1 = function() {
        var d1, d2;
        d1 = this.pruning('sliceFlip', N_SLICE1 * this.flip + this.slice);
        d2 = this.pruning('sliceTwist', N_SLICE1 * this.twist + this.slice);
        return max(d1, d2);
      };

      State.prototype.next1 = function(move) {
        var next;
        next = freeStates.pop();
        next.parent = this;
        next.lastMove = move;
        next.depth = this.depth + 1;
        next.flip = this.move('flip', this.flip, move);
        next.twist = this.move('twist', this.twist, move);
        next.slice = this.move('FRtoBR', this.slice * 24, move) / 24 | 0;
        return next;
      };

      State.prototype.moves2 = function() {
        if (this.lastMove !== null) {
          return nextMoves2[this.lastMove / 3 | 0];
        } else {
          return allMoves2;
        }
      };

      State.prototype.minDist2 = function() {
        var d1, d2, index1, index2;
        index1 = (N_SLICE2 * this.URtoDF + this.FRtoBR) * N_PARITY + this.parity;
        d1 = this.pruning('sliceURtoDFParity', index1);
        index2 = (N_SLICE2 * this.URFtoDLF + this.FRtoBR) * N_PARITY + this.parity;
        d2 = this.pruning('sliceURFtoDLFParity', index2);
        return max(d1, d2);
      };

      State.prototype.init2 = function(top) {
        if (top == null) {
          top = true;
        }
        if (this.parent === null) {
          return true;
        }
        this.parent.init2(false);
        this.URFtoDLF = this.move('URFtoDLF', this.parent.URFtoDLF, this.lastMove);
        if (this.URFtoDLF === false) {
          return false;
        }
        this.FRtoBR = this.move('FRtoBR', this.parent.FRtoBR, this.lastMove);
        if (this.FRtoBR === false) {
          return false;
        }
        this.parity = this.move('parity', this.parent.parity, this.lastMove);
        if (this.parity === false) {
          return false;
        }
        this.URtoUL = this.move('URtoUL', this.parent.URtoUL, this.lastMove);
        if (this.URtoUL === false) {
          return false;
        }
        this.UBtoDF = this.move('UBtoDF', this.parent.UBtoDF, this.lastMove);
        if (this.UBtoDF === false) {
          return false;
        }
        if (top) {
          this.URtoDF = this.move('mergeURtoDF', this.URtoUL, this.UBtoDF);
        }
        return true;
      };

      State.prototype.next2 = function(move) {
        var next;
        next = freeStates.pop();
        next.parent = this;
        next.lastMove = move;
        next.depth = this.depth + 1;
        next.URFtoDLF = this.move('URFtoDLF', this.URFtoDLF, move);
        next.FRtoBR = this.move('FRtoBR', this.FRtoBR, move);
        next.parity = this.move('parity', this.parity, move);
        next.URtoDF = this.move('URtoDF', this.URtoDF, move);
        return next;
      };

      return State;

    })();
    solution = null;
    phase1search = function(state, t0) {
      var depth, o, ref2, results;
      depth = 0;
      results = [];
      for (depth = o = 1, ref2 = maxDepth; 1 <= ref2 ? o <= ref2 : o >= ref2; depth = 1 <= ref2 ? ++o : --o) {
        phase1(state, depth, t0);
        if (solution !== null) {
          break;
        }
        results.push(depth++);
      }
      return results;
    };
    phase1 = function(state, depth, t0) {
      var len, move, next, o, ref2, ref3, results;
      if (depth === 0) {
        if (state.minDist1() === 0) {
          if (state.lastMove === null || (ref2 = state.lastMove, indexOf.call(allMoves2, ref2) < 0)) {
            return phase2search(state, t0);
          }
        }
      } else if (depth > 0) {
        if (state.minDist1() <= depth) {
          ref3 = state.moves1();
          results = [];
          for (o = 0, len = ref3.length; o < len; o++) {
            move = ref3[o];
            next = state.next1(move);
            phase1(next, depth - 1);
            freeStates.push(next);
            if (solution !== null) {
              break;
            } else {
              results.push(void 0);
            }
          }
          return results;
        }
      }
    };
    phase2search = function(state, t0) {
      var depth, m, o, ref2, results;
      m = state.init2();
      if (m === false) {
        solution = 'invalid ';
        return;
      }
      results = [];
      for (depth = o = 1, ref2 = maxDepth - state.depth; 1 <= ref2 ? o <= ref2 : o >= ref2; depth = 1 <= ref2 ? ++o : --o) {
        phase2(state, depth, t0);
        if (solution !== null) {
          break;
        }
        results.push(depth++);
      }
      return results;
    };
    phase2 = function(state, depth) {
      var len, move, next, o, ref2, results;
      if (depth === 0) {
        if (state.minDist2() === 0) {
          return solution = state.solution();
        }
      } else if (depth > 0) {
        if (state.minDist2() <= depth) {
          ref2 = state.moves2();
          results = [];
          for (o = 0, len = ref2.length; o < len; o++) {
            move = ref2[o];
            next = state.next2(move);
            phase2(next, depth - 1);
            freeStates.push(next);
            if (solution !== null) {
              break;
            } else {
              results.push(void 0);
            }
          }
          return results;
        }
      }
    };
    freeStates = (function() {
      var o, ref2, results;
      results = [];
      for (x = o = 0, ref2 = maxDepth + 1; 0 <= ref2 ? o <= ref2 : o >= ref2; x = 0 <= ref2 ? ++o : --o) {
        results.push(new State);
      }
      return results;
    })();
    state = freeStates.pop().init(this);
    if (state === false) {
      solution = 'invalid ';
      return solution;
    }
    phase1search(state, t0);
    freeStates.push(state);
    if (solution.length > 0) {
      solution = solution.substring(0, solution.length - 1);
    }
    return solution;
  };

  Cube.scramble = function() {
    return Cube.inverse(Cube.random().solve());
  };

}).call(this);
