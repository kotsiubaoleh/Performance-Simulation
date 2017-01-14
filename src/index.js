var CircularArray = require('./lib/CircularArray');
var Generator = require('./Generator');
var Chart = require('./Chart');
var DerivativeChart = require('./DerivativeChart');
var IntegralChart = require('./IntegralChart');
var Menu = require('./Menu');

Menu.init(function (selectedItem) {
  vChart.clear();
  iChart.clear();
  FChart.clear();
  VChart.clear();
  switch (selectedItem) {
    case 'cpu':
      generator = Generator.createCombinedGenerator(
        [{from: 50, to: 200, weight: 1},
          {from: 5, to: 30, weight: 0.2},
          {from: 3, to: 15, weight: 0.05}]
      );
      break;
    case 'ram':
      generator = Generator.createCombinedGenerator(
        [{from: 50, to: 150, weight: 1, rep: true},
          {from: 10, to: 100, weight: 0.15, rep: true}]
      );
      break;
    case 'disk':
      generator = Generator.createCombinedGenerator(
        [{from: 3, to: 15, weight: 0.05},
        {from: 20, to: 100, weight: 1, rep: true}]
      );
      break;
  }
});

  var redThreshold = 0.7;
  var greenThreshold = 0.4;

  var sliderRed = document.getElementById('slider-red');
  sliderRed.value = redThreshold * 100;
  sliderRed.onchange = function (e) {
  redThreshold = e.target.value / 100;
  vChart.setRedThreshold(redThreshold);
};

var sliderGreen = document.getElementById('slider-green');
sliderGreen.value = greenThreshold * 100;
sliderGreen.onchange = function (e) {

  greenThreshold = e.target.value / 100;
  console.log(greenThreshold);
  vChart.setGreenThreshold(greenThreshold);
};

var percentElem = document.getElementById('f-percent');
var percent = 0;

var arrow = document.getElementsByClassName('arrow-icon')[0];
var arrowContainer = document.getElementsByClassName('arrow')[0];

var vChartElement = document.getElementById('v-chart');
var vChart = new Chart(vChartElement, redThreshold, greenThreshold);

var iChartElement = document.getElementById('i-chart');
var iChart = new DerivativeChart(iChartElement,'blue');

var FChartElement = document.getElementById('if-chart');
var FChart = new IntegralChart(FChartElement,'purple');

var VChartElement = document.getElementById('iv-chart');
var VChart = new IntegralChart(VChartElement,'red');

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

var last = 0;
var intervalId = setInterval(function() {
  next = generator.next();
  vChart.addRecord(next);
  iChart.addRecord(next);
  FChart.addRecord(next);
  VChart.addRecord(Math.abs(last-next));
  last = next;
  percent = next * 100;
  rotateArrow();
  lastResult = next;
  lastDerivative = derivative;
},200);

function drawPercent(){
    percentElem.innerHTML = Math.round(percent);
}

function onNextFrame() {
    vChart.draw();
    iChart.draw();
    FChart.draw();
    VChart.draw();
    drawPercent();
    requestAnimationFrame(onNextFrame);
}

onNextFrame();
