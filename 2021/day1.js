const load = require('../loader')

function countIncreasing (input, window = 1) {
  const ahead = window - 1
  let sum = 0
  for (let i = 1; i < input.length - ahead; i++) {
    if (input[i + ahead] > input[i - 1]) sum++
  }
  return sum
}

const test = load('day1', __dirname).trim().split('\n').map(Number)

console.log(countIncreasing(test))
console.log(countIncreasing(test, 3))
