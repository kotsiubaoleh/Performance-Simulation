var selectedItem;

var CLASS_SELECTED = 'menu-item-active';
var DEFAULT_SELECTED = 'cpu';

var buttonIds = ['cpu', 'ram', 'disk'];
var buttons = [];

function hasClass(classNames, name) {
  var classArr = classNames.split(' ');
  return (classArr.indexOf(name) !== -1);
}

function toggleClass(classNames, name) {
  var classArr = classNames.split(' ');
  var classIndex = classArr.indexOf(name);
  if (classIndex !== -1) {
    classArr.splice(classIndex, 1);
  } else {
    classArr.push(name);
  }
  return classArr.join(' ');
}

function addClass(classNames, name) {
  var classArr = classNames.split(' ');
  var classIndex = classArr.indexOf(name);
  if (classIndex !== -1) return classNames;
  classArr.push(name);
  return classArr.join(' ');
}

function removeClass(classNames, name) {
  var classArr = classNames.split(' ');
  var classIndex = classArr.indexOf(name);
  if (classIndex === -1) return classNames;
  classArr.splice(classIndex, 1);
  return classArr.join(' ');
}

function selectItem(item) {
    buttons.forEach(function (button) {
      if (button.id === item) {
        button.className = addClass(button.className, CLASS_SELECTED);
      } else {
        button.className = removeClass(button.className, CLASS_SELECTED);
      }
  });
  selectedItem = item;
}

function init(onSelect) {

  buttonIds.forEach(function (id) {
    var button = document.getElementById(id);
    button.onclick = function() {
      selectItem(id);
      onSelect(id);
    };
    buttons.push(button);
  });

  selectItem(DEFAULT_SELECTED);
}

module.exports.init = init;
