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
	var Chart = __webpack_require__(3);
	var DerivativeChart = __webpack_require__(4);
	// var GLView = require('./GLView');
	// var Vector = require('./lib/math/Vector');
	// var Matrix = require('./lib/math/Matrix');
	
	var redThreshold = 0.7;
	var greenThreshold = 0.4;
	
	
	var fChartElement = document.getElementById('f-chart');
	// var glViewElement = document.getElementById('gl-view');
	var fChart = new Chart(fChartElement, redThreshold, greenThreshold);
	// var glView = new GLView(glViewElement);
	
	var sliderRed = document.getElementById('slider-red');
	sliderRed.value = redThreshold * 100;
	sliderRed.onchange = function (e) {
	  redThreshold = e.target.value / 100;
	  fChart.setRedThreshold(redThreshold);
	};
	
	var sliderGreen = document.getElementById('slider-green');
	sliderGreen.value = greenThreshold * 100;
	sliderGreen.onchange = function (e) {
	
	  greenThreshold = e.target.value / 100;
	  console.log(greenThreshold);
	  fChart.setGreenThreshold(greenThreshold);
	};
	
	var percentElem = document.getElementById('f-percent');
	var percent = 0;
	
	var arrow = document.getElementsByClassName('arrow-icon')[0];
	var arrowContainer = document.getElementsByClassName('arrow')[0];
	
	var vChartElement = document.getElementById('v-chart');
	var vChart = new DerivativeChart(vChartElement,25,'blue');
	
	var iChartElement = document.getElementById('i-chart');
	var iChart = new DerivativeChart(iChartElement,40,'purple');
	
	var generator = Generator.createCombinedGenerator(
	  [{from: 50, to: 200, weight: 1},
	    {from: 5, to: 30, weight: 0.2},
	    {from: 3, to: 15, weight: 0.05}]
	);
	
	var derivative =  0, lastDerivative = 0, lastResult = 0, next = 0;
	
	function rotateArrow() {
	    var ANGLE_OFFSET = 90;
	    var angle = -Math.atan((next - lastResult) * 200) / Math.PI * 180;
	    angle += ANGLE_OFFSET;
	    arrow.style.transform = 'rotate(' +  angle + 'deg)';
	
	    var background;
	    if (next > redThreshold) background = '#ff2f2f';
	    else if (next < greenThreshold) background = '#63ff5a';
	    else background = '#fffe74';
	    arrowContainer.style.backgroundColor = background;
	}
	
	setInterval(function() {
	    next = generator.next();
	    fChart.addRecord(next);
	    derivative = next - lastResult;
	    vChart.addRecord(derivative);
	    iChart.addRecord(derivative - lastDerivative);
	    percent = next * 100;
	    rotateArrow();
	    lastResult = next;
	    lastDerivative = derivative;
	},100);
	
	function drawPercent(){
	    percentElem.innerHTML = Math.round(percent);
	}
	
	function onNextFrame() {
	    fChart.draw();
	    vChart.draw();
	    iChart.draw();
	    // glView.draw();
	    drawPercent();
	    requestAnimationFrame(onNextFrame);
	}
	
	onNextFrame();
	
	window.chart = fChart;


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
	    }
	
	    this.next = function() {
	        ly += dy;
	        step++;
	        if (step >= x) init();
	        return ly;
	    };
	}
	
	module.exports.createCombinedGenerator = createCombinedGenerator;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var CircularArray = __webpack_require__(1);
	
	function Chart(containerElement, redThreshold, greenThreshold) {
	    this._chartOffsetX = 30;
	    this._chartOffsetY = 20;
	
	    this._redThreshold = redThreshold || 0.7;
	    this._greenThreshold = greenThreshold || 0.3;
	
	    this._wrap = document.createElement('div');
	    this._wrap.style.position = 'relative';
	    this._grid = document.createElement('canvas');
	    this._grid.style.position = 'absolute';
	    this._chart = document.createElement('canvas');
	    this._chart.style.position = 'absolute';
	    // this._chart.style.left = this._chartOffsetX -1 + 'px';
	    // this._chart.style.border = "1px solid #aaa";
	
	
	    this._wrap.appendChild(this._grid);
	    this._wrap.appendChild(this._chart);
	    containerElement.appendChild(this._wrap);
	
	    var rect = containerElement.getBoundingClientRect();
	    this.setSize(rect.width, rect.height);
	
	    this._points = new CircularArray(rect.width);
	
	    this._ctx =  this._chart.getContext('2d');
	    this._ctx.strokeStyle = 'black';
	    //this._ctx.fillStyle = 'tomato';
	
	    this._setGradientFill();
	    this._ctx.lineWidth = 2;
	
	    this._ctxGrid = this._grid.getContext('2d');
	    this._ctxGrid.strokeStyle = '#aaa';
	    this._ctxGrid.lineWidth = 1;
	
	
	
	    this._drawGrid();
	}
	
	Chart.prototype.setSize = function(width, height) {
	    this._wrap.width = width;
	    this._wrap.height = height;
	    this._grid.width = width;
	    this._grid.height = height;
	    this._chart.width = width - this._chartOffsetX;
	    this._chart.height = height - this._chartOffsetY;
	};
	
	Chart.prototype.setRedThreshold = function(threshold) {
	  this._redThreshold = threshold;
	  this._setGradientFill();
	};
	
	Chart.prototype.setGreenThreshold = function(threshold) {
	  this._greenThreshold = threshold;
	  this._setGradientFill();
	};
	
	Chart.prototype._setGradientFill = function () {
	    var greenColor = 'rgba(9, 237, 58, 0.8)';
	    var yellowColor = 'rgba(247, 247, 44, 0.8)';
	    var redColor = 'rgba(252, 33, 0, 0.8)';
	
	    var blur = 0.1;
	
	    var gradient = this._ctx.createLinearGradient(0, 0, 0, this._chart.height);
	
	    gradient.addColorStop(0, redColor);
	    gradient.addColorStop(Math.max(1 - this._redThreshold - blur / 2, 0), redColor);
	    gradient.addColorStop(Math.min(1 - this._redThreshold + blur / 2, 1), yellowColor);
	
	    gradient.addColorStop(Math.max(1 - this._greenThreshold - blur / 2, 0), yellowColor);
	    gradient.addColorStop(Math.min(1 - this._greenThreshold + blur / 2, 1), greenColor);
	    gradient.addColorStop(1, greenColor);
	
	    this._ctx.fillStyle = gradient;
	};
	
	Chart.prototype._drawGrid = function() {
	    var rowNum = 4;
	    var colNum = 7;
	    var rowHeight = this._chart.height / rowNum;
	    var colWidth = this._chart.width / colNum;
	
	    this._ctxGrid.textAlign = "left";
	    this._ctxGrid.textBaseline = "top";
	    for (var i = 0; i < rowNum + 1; i++) {
	        this._ctxGrid.fillText(Math.round((1 - (i / rowNum)) * 100) + '%', this._chart.width + 1, i * rowHeight);
	        var startX = 0.5,
	            startY = Math.round(i * rowHeight) + 0.5;
	        var endX = this._chart.width,
	            endY = startY;
	        this._ctxGrid.moveTo(startX, startY);
	        this._ctxGrid.lineTo(endX, endY);
	    }
	    for (i = 0; i < colNum + 1; i++) {
	        startX = Math.round(i * colWidth) + 0.5;
	        startY = 0.5;
	        endX = startX;
	        endY = this._chart.height + 0.5;
	        this._ctxGrid.moveTo(startX, startY);
	        this._ctxGrid.lineTo(endX, endY);
	    }
	    this._ctxGrid.stroke();
	};
	
	Chart.prototype.draw = function() {
	    this._ctx.clearRect(0,0,this._chart.width,this._chart.height);
	    this._ctx.beginPath();
	    // this._ctx.moveTo(this._chart.width - this._points.getLength(), this._chart.height - this._points.getAt(0));
	    this._ctx.moveTo(this._chart.width - this._points.getLength(), this._chart.height);
	    for (var i = 0; i < this._points.getLength(); i++) {
	        this._ctx.lineTo(this._chart.width - this._points.getLength() + i, this._chart.height - this._points.getAt(i));
	    }
	    this._ctx.lineTo(this._chart.width, this._chart.height);
	    this._ctx.closePath();
	    this._ctx.fill();
	};
	
	Chart.prototype.addRecord = function(record) {
	    this._points.push(record * this._chart.height);
	};
	
	module.exports = Chart;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var CircularArray = __webpack_require__(1);
	
	function DerivativeChart(containerElement, scale, color) {
	    this._chartOffsetX = 30;
	    this._chartOffsetY = 20;
	
	
	  // this._redThreshold = redThreshold || 0.7;
	  // this._greenThreshold = greenThreshold || 0.3;
	
	  this._scale = scale;
	    this._wrap = document.createElement('div');
	    this._wrap.style.position = 'relative';
	    this._grid = document.createElement('canvas');
	    this._grid.style.position = 'absolute';
	    this._chart = document.createElement('canvas');
	    this._chart.style.position = 'absolute';
	    // this._chart.style.left = this._chartOffsetX -1 + 'px';
	    // this._chart.style.border = "1px solid #aaa";
	
	
	    this._wrap.appendChild(this._grid);
	    this._wrap.appendChild(this._chart);
	    containerElement.appendChild(this._wrap);
	
	    var rect = containerElement.getBoundingClientRect();
	    this.setSize(rect.width, rect.height);
	
	    this._points = new CircularArray(rect.width);
	
	    this._ctx =  this._chart.getContext('2d');
	    this._ctx.strokeStyle = color;
	    //this._ctx.fillStyle = 'tomato';
	
	    //this._setGradientFill();
	    this._ctx.lineWidth = 1.5;
	
	    this._ctxGrid = this._grid.getContext('2d');
	    this._ctxGrid.strokeStyle = '#aaa';
	    this._ctxGrid.lineWidth = 1;
	
	
	
	    this._drawGrid();
	}
	
	DerivativeChart.prototype.setSize = function(width, height) {
	    this._wrap.width = width;
	    this._wrap.height = height;
	    this._grid.width = width;
	    this._grid.height = height;
	    this._chart.width = width - this._chartOffsetX;
	    this._chart.height = height - this._chartOffsetY;
	};
	
	// DerivativeChart.prototype.setRedThreshold = function(threshold) {
	//   this._redThreshold = threshold;
	//   this._setGradientFill();
	// };
	//
	// DerivativeChart.prototype.setGreenThreshold = function(threshold) {
	//   this._greenThreshold = threshold;
	//   this._setGradientFill();
	// };
	//
	// DerivativeChart.prototype._setGradientFill = function () {
	//     var greenColor = 'rgba(9, 237, 58, 0.8)';
	//     var yellowColor = 'rgba(247, 247, 44, 0.8)';
	//     var redColor = 'rgba(252, 33, 0, 0.8)';
	//
	//     var blur = 0.1;
	//
	//     var gradient = this._ctx.createLinearGradient(0, 0, 0, this._chart.height);
	//
	//     gradient.addColorStop(0, redColor);
	//     gradient.addColorStop(Math.max(1 - this._redThreshold - blur / 2, 0), redColor);
	//     gradient.addColorStop(Math.min(1 - this._redThreshold + blur / 2, 1), yellowColor);
	//
	//     gradient.addColorStop(Math.max(1 - this._greenThreshold - blur / 2, 0), yellowColor);
	//     gradient.addColorStop(Math.min(1 - this._greenThreshold + blur / 2, 1), greenColor);
	//     gradient.addColorStop(1, greenColor);
	//
	//     this._ctx.fillStyle = gradient;
	// };
	
	DerivativeChart.prototype._drawGrid = function() {
	    var rowNum = 4;
	    var colNum = 7;
	    var rowHeight = this._chart.height / rowNum;
	    var colWidth = this._chart.width / colNum;
	
	    this._ctxGrid.textAlign = "left";
	    this._ctxGrid.textBaseline = "top";
	    for (var i = 0; i < rowNum + 1; i++) {
	        this._ctxGrid.fillText(Math.round((1 - (i / rowNum)) * 200 - 100) / this._scale + '%', this._chart.width + 1, i * rowHeight);
	        var startX = 0.5,
	            startY = Math.round(i * rowHeight) + 0.5;
	        var endX = this._chart.width,
	            endY = startY;
	        this._ctxGrid.moveTo(startX, startY);
	        this._ctxGrid.lineTo(endX, endY);
	    }
	    for (i = 0; i < colNum + 1; i++) {
	        startX = Math.round(i * colWidth) + 0.5;
	        startY = 0.5;
	        endX = startX;
	        endY = this._chart.height + 0.5;
	        this._ctxGrid.moveTo(startX, startY);
	        this._ctxGrid.lineTo(endX, endY);
	    }
	    this._ctxGrid.stroke();
	};
	
	DerivativeChart.prototype.draw = function() {
	    this._ctx.clearRect(0,0,this._chart.width,this._chart.height);
	    this._ctx.beginPath();
	    this._ctx.moveTo(this._chart.width - this._points.getLength(), this._chart.height - this._points.getAt(0));
	    // this._ctx.moveTo(this._chart.width - this._points.getLength(), this._chart.height);
	    for (var i = 0; i < this._points.getLength(); i++) {
	        this._ctx.lineTo(this._chart.width - this._points.getLength() + i, this._chart.height - this._points.getAt(i));
	    }
	    // this._ctx.lineTo(this._chart.width, this._chart.height);
	    this._ctx.stroke();
	};
	
	DerivativeChart.prototype.addRecord = function(record) {
	    this._points.push(record * this._scale * this._chart.height/2 + this._chart.height/2);
	};
	
	module.exports = DerivativeChart;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map