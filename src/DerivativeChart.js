var CircularArray = require('./lib/CircularArray');

function DerivativeChart(containerElement, color) {
    this._chartOffsetX = 30;
    this._chartOffsetY = 20;

    this._scale = 1;
    this._wrap = document.createElement('div');
    this._wrap.style.position = 'relative';
    this._grid = document.createElement('canvas');
    this._grid.style.position = 'absolute';
    this._chart = document.createElement('canvas');
    this._chart.style.position = 'absolute';


    this._wrap.appendChild(this._grid);
    this._wrap.appendChild(this._chart);
    containerElement.appendChild(this._wrap);

    var rect = containerElement.getBoundingClientRect();
    this.setSize(rect.width, rect.height);

    this._points = new CircularArray(rect.width);

    this._ctx =  this._chart.getContext('2d');
    this._ctx.strokeStyle = color;

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

DerivativeChart.prototype._drawGrid = function() {
    this._ctxGrid.clearRect(0,0,this._grid.width,this._grid.height);
    var rowNum = 4;
    var colNum = 7;
    var rowHeight = this._chart.height / rowNum;
    var colWidth = this._chart.width / colNum;

    this._ctxGrid.textAlign = "left";
    this._ctxGrid.textBaseline = "top";
    for (var i = 0; i < rowNum + 1; i++) {
        this._ctxGrid.fillText((((1 - (i / rowNum)) * 200 - 100) / this._scale).toFixed(1) + '%', this._chart.width + 1, i * rowHeight);
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

DerivativeChart.prototype._calculateScale = function() {
  var maxValue = 0;
  for (var i = 1; i < this._points.getLength(); ++i){
    var value = Math.abs(this._points.getAt(i) - this._points.getAt(i-1));
    if (value > maxValue) maxValue = value;
  }
  this._scale =  this._chart.height / 2 / maxValue;
};

DerivativeChart.prototype.draw = function() {
    this._calculateScale();
    this._drawGrid();
    this._ctx.clearRect(0,0,this._chart.width,this._chart.height);
    this._ctx.beginPath();
    this._ctx.moveTo(this._chart.width - this._points.getLength(), this._chart.height/2 - (this._points.getAt(0) - this._points.getAt(1)) * this._scale);
    for (var i = 1; i < this._points.getLength(); i++) {
        this._ctx.lineTo(this._chart.width - this._points.getLength() + i, this._chart.height/2 - (this._points.getAt(i) - this._points.getAt(i-1)) * this._scale);
    }
    this._ctx.stroke();
};

DerivativeChart.prototype.addRecord = function(record) {
    this._points.push(record * this._chart.height/2);
};

DerivativeChart.prototype.clear = function () {
  this._points.clear();
};

module.exports = DerivativeChart;
