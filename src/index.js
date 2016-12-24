var CircularArray = require('./lib/CircularArray');
var Generator = require('./Generator');
var Chart = require('./Chart');
var DerivativeChart = require('./DerivativeChart');
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
