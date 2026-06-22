const load = require('../loader')

function findProduct (sum, n, input, start = 0) {
  if (n === 0) return sum === 0
  for (let i = start; i < input.length; i++) {
    const product = findProduct(sum - input[i], n - 1, input, i + 1)
    if (product !== false) return input[i] * product
  }
  return false
}

const test = load('day1', __dirname).trim().split('\n').map(Number)

console.log(findProduct(2020, 2, test))
console.log(findProduct(2020, 3, test))
