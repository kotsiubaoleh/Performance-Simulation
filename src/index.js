var CircularArray = require('./CircularArray');
var Generator = require('./Generator');

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