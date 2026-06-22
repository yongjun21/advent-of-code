const load = require('../loader')

function getChecksum (input) {
  const charCount = input.map(getCharCount)
  return charCount.filter(row => Object.values(row).some(count => count === 2)).length *
    charCount.filter(row => Object.values(row).some(count => count === 3)).length
}

function getCharCount (str) {
  return str.split('').reduce((obj, char) => {
    obj[char] = obj[char] || 0
    obj[char]++
    return obj
  }, {})
}

function getDifferByN (input, count = 1) {
  input = input.map(row => row.split(''))
  let first, second
  input.some((f, i) => {
    return input.some((s, j) => {
      if (i === j) return
      if (getDifferBy(f, s) === count) {
        first = f
        second = s
        return true
      }
    })
  })
  return [first.join(''), second.join('')]
}

function getDifferBy (first, second) {
  return first.reduce((count, char, i) => count + (char === second[i] ? 0 : 1), 0)
}

const test = load('day2', __dirname).trim().split('\n')

console.log(getChecksum(test))
console.log(getDifferByN(test))
