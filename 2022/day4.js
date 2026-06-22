const load = require('../loader')

function countContain (input) {
  return input.filter(([a, b]) => {
    return (a[0] >= b[0] && a[1] <= b[1]) || (b[0] >= a[0] && b[1] <= a[1])
  }).length
}

function countOverlap (input) {
  return input.filter(([a, b]) => {
    const min = Math.min(a[0], b[0])
    const max = Math.max(a[1], b[1])
    return (max - min + 1) < (a[1] - a[0] + 1) + (b[1] - b[0] + 1)
  }).length
}

function parse (line) {
  return line.split(',').map(substr => substr.split('-').map(Number))
}

const test = load('day4', __dirname).trim().split('\n').map(parse)

console.log(countContain(test))
console.log(countOverlap(test))
