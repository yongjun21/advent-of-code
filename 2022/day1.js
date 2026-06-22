const load = require('../loader')

const { MinHeap } = require('./common')

function findLargest (input, n = 1) {
  const heap = new MinHeap((a, b) => b - a)
  let sum = 0
  input.trim().split('\n').forEach(line => {
    if (line) {
      sum += Number(line)
    } else {
      heap.push(sum)
      sum = 0
    }
  })
  heap.push(sum)
  let largest = 0
  while (n-- > 0) {
    largest += heap.pop()
  }
  return largest
}

const test = load('day1', __dirname)

console.log(findLargest(test))
console.log(findLargest(test, 3))
