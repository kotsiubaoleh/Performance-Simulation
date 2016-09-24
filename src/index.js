var CircularArray = require('./CircularArray');
var Generator = require('./Generator');

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