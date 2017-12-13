function excludeRed (input) {
  return Object.keys(input).some(key => input[key] === 'red')
}

function sumNumbers (input, exclude = v => false) {
  if (typeof input === 'number') return input
  if (typeof input === 'string') return 0
  if (input instanceof Array) {
    return input.reduce((sum, value) => sum + sumNumbers(value, exclude), 0)
  } else if (typeof input === 'object') {
    if (exclude(input)) return 0
    return Object.keys(input).reduce((sum, key) => sum + sumNumbers(input[key], exclude), 0)
  }
}

const test = require('./input/day12.json')

console.log(sumNumbers(test))
console.log(sumNumbers(test, excludeRed))
