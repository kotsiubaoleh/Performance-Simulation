var Vector = require('./Vector');
var ArgumentsError = require('./ArgumentsError');

function createFromTwoDimensionalArray(arr) {
  this.data = [];
  this.cols = arr.length;
  this.rows = -1;
  for (var i = 0; i < arr.length; ++i) {
    if(arr[i] instanceof Vector) {
      this.data.push(Vector.clone(arr[i]));
      if (this.rows !== -1 && arr[i].size) {
        throw new Error('Argument array has Vectors of different sizes');
      }
      this.rows = arr[i].size;
    } else if (arr[i] instanceof Array) {
      this.data.push(Vector(arr[i]));
      if (this.rows !== -1 && arr[i].length) {
        throw new Error('Argument array has arrays of different lengths');
      }
      this.rows = arr[i].length;
    } else {
      throw new Error('Incorrect arguments passed to the Matrix constructor');
    }
  }
}

function createFromOneDimensionalArray(arr, cols, rows) {
  throw new ArgumentsError('Test Error');
  this.data = [];
  this.cols = cols;
  this.rows = rows || arr.length / cols;

  if (cols*rows !== arr.length){
    throw new Error('Matrix size doesn\'t match length');
  }

  try {
    for (var i = 0; i < this.cols; ++i) {
      var col = [];
      for (var j = 0; j < this.rows; ++j) {
        col.push(arr[i * this.rows + j]);
      }
      this.data.push(Vector(col));
    }
  } catch (e) {
    throw new Error('Incorrect arguments passed to the Matrix constructor');
  }
}

function Matrix() {

  if(!(this instanceof Matrix)) {
    return new Matrix(...arguments);
  }

  if (arguments.length > 0) {
    if (arguments[0] instanceof Array) {
      if (arguments.length === 1) {
        createFromTwoDimensionalArray.apply(this, arguments);
        return;
      } else if (arguments.length > 1) {
        createFromOneDimensionalArray.apply(this, arguments);
        return;
      }
    }
    else if (typeof arguments[0] === 'number') {
      if (arguments.length === 1) {
        createSquareIdentity.apply(this, arguments);
        return;
      } else {
        createIdentity.apply(this, arguments);
        return;
      }
    }
  }
  throw new Error('Incorrect arguments passed to the Matrix constructor');
}

module.exports = Matrix;