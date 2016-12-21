var CircularArray = require('./lib/CircularArray');
var Generator = require('./Generator');
var Chart = require('./Chart');
// var GLView = require('./GLView');
// var Vector = require('./lib/math/Vector');
// var Matrix = require('./lib/math/Matrix');


var chartElement = document.getElementById('cpu-chart');
// var glViewElement = document.getElementById('gl-view');
var chart = new Chart(chartElement);
// var glView = new GLView(glViewElement);

var percentElem = document.getElementById('cpu-percent');
var percent = 0;

var arrow = document.getElementsByClassName('arrow-icon')[0];
var arrowContainer = document.getElementsByClassName('arrow')[0];

var generator = Generator.createCombinedGenerator(
    [{from: 50, to: 200, weight: 1},
    {from: 5, to: 30, weight: 0.2},
    {from: 3, to: 15, weight: 0.05}]
);

var lastResult = 0, next = 0;

function rotateArrow() {
    var ANGLE_OFFSET = 90;
    var angle = -Math.atan((next - lastResult) * 200) / Math.PI * 180;
    angle += ANGLE_OFFSET;
    arrow.style.transform = 'rotate(' +  angle + 'deg)';

    var background;
    if (next > 0.7) background = '#ff2f2f';
    else if (next < 0.4) background = '#63ff5a';
    else background = '#fffe74';
    arrowContainer.style.backgroundColor = background;
}

setInterval(function() {
    next = generator.next();
    chart.addRecord(next);
    percent = next * 100;
    rotateArrow();
    lastResult = next;
},100);

function drawPercent(){
    percentElem.innerHTML = Math.round(percent);
}

function onNextFrame() {
    chart.draw();
    // glView.draw();
    drawPercent();
    requestAnimationFrame(onNextFrame);
}

onNextFrame();

window.onresize = function () {

};