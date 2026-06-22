const load = require('../loader')

const PRIORITY_ORDER = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

function sumPriorities (input) {
  return input.reduce((sum, line) => {
    const first = line.slice(0, line.length / 2)
    const second = line.slice(line.length / 2)
    const firstSet = new Set(first)
    for (const item of second) {
      if (firstSet.has(item)) {
        const priority = PRIORITY_ORDER.indexOf(item) + 1
        return sum + priority
      }
    }
  }, 0)
}

function sumPriorities2 (input) {
  let sum = 0
  for (let i = 0; i < input.length; i += 3) {
    const firstSet = new Set(input[i])
    const secondSet = new Set()
    for (const item of input[i + 1]) {
      if (firstSet.has(item)) secondSet.add(item)
    }
    for (const item of input[i + 2]) {
      if (secondSet.has(item)) {
        const priority = PRIORITY_ORDER.indexOf(item) + 1
        sum += priority
        break
      }
    }
  }
  return sum
}

const test = load('day3', __dirname).trim()  .split('\n')

console.log(sumPriorities(test))
console.log(sumPriorities2(test))
