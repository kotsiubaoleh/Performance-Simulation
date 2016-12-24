var CircularArray = require('./lib/CircularArray');

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
