const load = require('../loader')

function getDimensions (str) {
  return str.split('x').map(v => +v).sort((a, b) => a - b)
}

function calcWrappingPaper (input) {
  return input.reduce((sum, str) => {
    const dimensions = getDimensions(str)
    return sum +
      dimensions[0] * dimensions[1] * 3 +
      dimensions[1] * dimensions[2] * 2 +
      dimensions[2] * dimensions[0] * 2
  }, 0)
}

function calcRibbon (input) {
  return input.reduce((sum, str) => {
    const dimensions = getDimensions(str)
    return sum +
      (dimensions[0] + dimensions[1]) * 2 +
      dimensions[0] * dimensions[1] * dimensions[2]
  }, 0)
}

const test = load('day2', __dirname).split('\n')

console.log(calcWrappingPaper(test))
console.log(calcRibbon(test))
