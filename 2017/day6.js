const load = require('../loader')

function reallocateMemory (arr) {
  arr = [...arr]
  let step = 0
  const states = {}
  while (!(arr.join('.') in states)) {
    states[arr.join('.')] = step++
    const max = Math.max(...arr)
    const maxIndex = arr.findIndex(v => v === max)
    const count = arr[maxIndex]
    arr[maxIndex] = 0
    for (let i = maxIndex + 1; i <= maxIndex + count; i++) {
      arr[i % arr.length]++
    }
  }
  return {step: step, loop: step - states[arr.join('.')]}
}

const test = load('day6', __dirname).split('\n').map(Number)

console.log(reallocateMemory(test))
