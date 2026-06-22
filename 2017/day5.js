const load = require('../loader')

function escapeTrampoline (arr) {
  arr = [...arr]
  let step = 0
  let i = 0
  while (i >= 0 && i < arr.length) {
    step++
    i += arr[i]++
  }
  return step
}

function escapeTrampoline2 (arr) {
  arr = [...arr]
  let step = 0
  let i = 0
  while (i >= 0 && i < arr.length) {
    step++
    const advance = arr[i]
    arr[i] += advance >= 3 ? -1 : 1
    i += advance
  }
  return step
}

const test = load('day5', __dirname).split('\n').map(Number)

console.log(escapeTrampoline(test))
console.log(escapeTrampoline2(test))
