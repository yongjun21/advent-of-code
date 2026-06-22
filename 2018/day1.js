const load = require('../loader')

function getResultingFreq (input) {
  return input.reduce((result, change) => {
    return result + +change
  }, 0)
}

function getRepeatedFreq (input) {
  const change = getChange(input)
  const visited = {}
  let freq = 0
  while (!(freq in visited)) {
    visited[freq] = 1
    freq += change.next().value
  }
  return freq
}

function * getChange (input) {
  while (true) {
    for (let value of input) {
      yield +value
    }
  }
}

const test = load('day1', __dirname).trim().split('\n')

console.log(getResultingFreq(test))
console.log(getRepeatedFreq(test))
