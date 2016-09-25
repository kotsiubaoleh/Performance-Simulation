function createCombinedGenerator(genParams) {
    var generators = [];
    var weights = [];
    for (var i = 0; i < genParams.length; i++) {
        generators.push(new Generator(genParams[i].from, genParams[i].to));
        weights.push(genParams[i].weight);
    }
    return new CombinedGenerator(generators, weights);
}

function CombinedGenerator(generators, weights) {
    var overallWeight = weights.reduce(function (sum, weight){ return sum + weight; });

    this.next = function() {
        var next = 0;
        for (var i = 0; i < generators.length; i++) {
            next += generators[i].next() * weights[i];
        }
        return next / overallWeight;
    }
}

function Generator(minX, maxX) {
    var x, y, dy, step;
    var ly  = Math.random();

    init();

    function init() {
        x = minX + Math.floor(Math.random() * (maxX - minX));
        y = Math.random();
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

module.exports.createCombinedGenerator = createCombinedGenerator;
