const load = require('../loader')

function getTotalFuel (input, levels = 1) {
  return input.reduce((sum, v) => {
    let n = levels
    while (n-- > 0) {
      v = Math.floor(v / 3) - 2
      if (v > 0) sum += v
      else break
    }
    return sum
  }, 0)
}

const test = load('day1', __dirname).trim().split('\n').map(Number)

console.log(getTotalFuel(test))
console.log(getTotalFuel(test, Infinity))
