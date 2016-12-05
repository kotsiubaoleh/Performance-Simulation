function createFromArray(arr) {
  this.size = arr.length;
  this.data = [];
  for (var i = 0; i < arr.length; ++i) {
    this.data.push(arr[i]);
  }
}

function createInitialized(size, initialValue) {
  this.size = size;
  this.data = [];
  for (var i = 0; i < this.size; ++i) {
    this.data.push(initialValue);
  }
}

function createNotInitialized(size) {
  createInitialized.call(this, size, 0);
}

function Vector() {
  if(!(this instanceof Vector)) {
    return new Vector(arguments);
  }

  if (arguments.length > 0) {
    if(arguments[0] instanceof Array){
      createFromArray.apply(this, arguments);
      return;
    }
    else if (typeof arguments[0] === 'number') {
        if (arguments.length > 1) {
          createInitialized.apply(this, arguments);
          return;
        } else {
          createNotInitialized.apply(this, arguments);
          return;
      }
    }
  }
  throw new Error('Incorrect arguments passed to the Vector constructor');
}

Vector.prototype.toString = function() {
  var res = ['\n'];
  for (var i = 0; i < this.size; ++i) {
    res.push('[');
    res.push(this.data[i]);
    res.push(']\n');
  }
  return res.join('');
};

Vector.prototype.add = function(vecB) {
  if (!(vecB instanceof Vector)) throw new Error('Argument is not instance of a Vector');
  if (this.size !== vecB.size) throw new Error('Vector sizes don\'t match');
  for (var i = 0; i < this.size; ++i) {
    this.data[i] += vecB.data[i];
  }
  return this;
};

Vector.prototype.sub = function(vecB) {
  if (!(vecB instanceof Vector)) throw new Error('Argument is not instance of a Vector');
  if (this.size !== vecB.size) throw new Error('Vector sizes don\'t match');
  for (var i = 0; i < this.size; ++i) {
    this.data[i] -= vecB.data[i];
  }
  return this;
};

Vector.prototype.mul = function (scalar) {
  for (var i = 0; i < this.size; ++i) {
    this.data[i] *= scalar;
  }
  return this;
};

Vector.prototype.getSqrLength = function() {
  sqrSum = 0;
  for (var i = 0; i < this.size; ++i) {
    sqrSum += this.data[i] * this.data[i];
  }
  return sqrSum;
};

Vector.prototype.getLength = function() {
  return Math.sqrt(this.getSqrLength());
};

Vector.prototype.toArray = function() {
  var arr = [];
  for (var i = 0; i < this.size; ++i) {
    arr.push(this.data[i]);
  }
  return arr;
};

Vector.dot = function(vecA, vecB) {
  if (vecA.size !== vecB.size) throw new Error('Vector sizes don\'t match');
  var product = 0;
  for(var i = 0; i < vecA.size; ++i) {
    product += vecA.data[i] * vecB.data[i];
  }
  return product;
};

Vector.clone = function(vec) {
  return new Vector(vec.data);
};

module.exports = Vector;
