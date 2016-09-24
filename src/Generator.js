function Generator(maxY) {
    var mainGenerator = new MainGenerator(100,maxY);
    this.next = function() {
        return mainGenerator.next();
    };
}

function MainGenerator(maxX, maxY) {
    var x, y, dy;
    var ly  = Math.random() * maxY;

    init();

    function init() {
        x = 10 + Math.floor(Math.random() * (maxX - 10));
        y = Math.floor(Math.random() * maxY);
        dy = (y - ly) / x;
        step = 0;
    };

    this.next = function() {
        ly += dy;
        step++;
        if (step >= x) init();
        return ly;
    };
}

module.exports = Generator;
