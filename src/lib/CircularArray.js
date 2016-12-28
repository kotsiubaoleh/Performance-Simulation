function CircularArray(length) {
    var array = [];
    var maxLength = Math.floor(length);
    var head = 0;

    this.push = function(value) {
        if (array.length < maxLength) {
            array.push(value);
        } else {
            array[head++] = value;
            head %= maxLength;
        }
    };

    this.getAt = function (index) {
        return array[(index + head) % maxLength];
    };

    this.getLength = function () {
        return array.length;
    };

    this.clear = function () {
        array = [];
        head = 0;
    };
}

module.exports = CircularArray;
