const load = require('../loader')

function countMatch (input, rounds, validateA = v => true, validateB = v => true) {
  let [valueA, valueB] = input
  let count = 0

  const factorA = 16807
  const factorB = 48271
  const divisor = 2147483647
  const sixteenBits = Math.pow(2, 16)

  while (rounds-- > 0) {
    do {
      valueA = (valueA * factorA) % divisor
    } while (!validateA(valueA))
    do {
      valueB = (valueB * factorB) % divisor
    } while (!validateB(valueB))
    if (valueA % sixteenBits === valueB % sixteenBits) count++
  }

  return count
}

const test = load('day15', __dirname).split('\n').map(Number)

console.log(countMatch(test, 40000000))
console.log(countMatch(test, 5000000, v => v % 4 === 0, v => v % 8 === 0))
