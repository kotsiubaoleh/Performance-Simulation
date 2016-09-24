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
	
	var chart = document.getElementById('cpu');
	var canvas = document.createElement('canvas');
	
	chart.appendChild(canvas);
	
	canvas.setAttribute('width', chart.getBoundingClientRect().width);
	canvas.setAttribute('height', chart.getBoundingClientRect().height);
	
	var ctx =  canvas.getContext('2d');
	
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 2;
	
	function drawChart(data) {
	
	    ctx.clearRect(0,0,canvas.width,canvas.height);
	    ctx.beginPath();
	    ctx.moveTo(canvas.width - data.getLength(), data.getAt(0));
	    for (var i = 0; i < data.getLength(); i++) {
	        ctx.lineTo(canvas.width - data.getLength() + i, data.getAt(i));
	    }
	    ctx.stroke();
	}
	
	var points = new CircularArray(canvas.width);
	var generator = new Generator(canvas.height);
	
	setInterval(function() {
	    points.push(generator.next());
	    drawChart(points);
	},20);
	
	drawChart(points);
	
	window.onresize = function () {
	    //canvas.setAttribute('width', chart.getBoundingClientRect().width);
	    //canvas.setAttribute('height', chart.getBoundingClientRect().height);
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map