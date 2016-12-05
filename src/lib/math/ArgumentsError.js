function ArgumentsError(message) {
  this.name = 'Arguments Error';
  this.message = message || 'Incorrect arguments passed';
}

ArgumentsError.prototype = Object.create(Error.prototype);
ArgumentsError.prototype.constructor = ArgumentsError;

module.exports = ArgumentsError;