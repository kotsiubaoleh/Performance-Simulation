var Vector = require('./Vec');

function createFromTwoDimensionalArray(arr) {
  this.cols = arr.length;
  this.data = [];
  for (var i = 0; i < arr.length; ++i) {
    if(arr[i] instanceof Vector) {
      this.data.push(Vector.clone(arr[i]));
    } else if (arr[i] instanceof Array) {
      this.data.push(arr[i]);
    } else {
      throw new Error('Incorrect arguments passed to the Vector constructor');
    }
  }
}

function Matrix() {
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
        createIdentity.apply(this, arguments)
        return;
      }
    }
  }
  throw new Error('Incorrect arguments passed to the Matrix constructor');
}