/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var CircularArray = __webpack_require__(1);
	var Generator = __webpack_require__(2);
	
	var chart = document.getElementById('cpu-chart');
	var canvas = document.createElement('canvas');
	
	chart.appendChild(canvas);
	
	canvas.setAttribute('width', chart.getBoundingClientRect().width);
	canvas.setAttribute('height', chart.getBoundingClientRect().height);
	
	var ctx =  canvas.getContext('2d');
	
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 1;
	
	var arrow = document.getElementsByClassName('arrow-icon')[0];
	var arrowContainer = document.getElementsByClassName('arrow')[0];
	
	function drawChart(data) {
	    ctx.clearRect(0,0,canvas.width,canvas.height);
	    ctx.beginPath();
	    ctx.moveTo(canvas.width - data.getLength(), canvas.height - data.getAt(0));
	    for (var i = 0; i < data.getLength(); i++) {
	        ctx.lineTo(canvas.width - data.getLength() + i, canvas.height - data.getAt(i));
	    }
	    ctx.stroke();
	}
	
	var points = new CircularArray(canvas.width);
	var generator = Generator.createCombinedGenerator([
	    {from: 50, to: 200, weight: 1},
	    {from: 5, to: 30, weight: 0.2},
	    {from: 3, to: 15, weight: 0.05}]
	);
	
	
	var lastResult = 0, next = 0;
	
	function rotateArrow() {
	    var angle = 90;
	    if (lastResult > next) angle = 180;
	    else if (next > lastResult) angle = 0;
	    arrow.style.transform = 'rotate(' +  angle + 'deg)';
	
	    var background;
	    if (next > 0.7) background = 'red';
	    else if (next < 0.4) background = 'green';
	    else background = 'yellow';
	    arrowContainer.style.backgroundColor = background;
	}
	
	
	setInterval(function() {
	    next = generator.next();
	    rotateArrow();
	    points.push(next * canvas.height);
	    lastResult = next;
	},50);
	
	function onNextFrame() {
	    drawChart(points);
	    requestAnimationFrame(onNextFrame);
	}
	
	onNextFrame();
	
	window.onresize = function () {
	    canvas.setAttribute('width', chart.getBoundingClientRect().width);
	    canvas.setAttribute('height', chart.getBoundingClientRect().height);
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

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
	}
	
	module.exports = CircularArray;


/***/ },
/* 2 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map