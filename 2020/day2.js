const load = require('../loader')

function countValid (input) {
  return input.filter(row => {
    let count = 0
    for (const letter of row.test) {
      if (letter === row.letter) count++
    }
    return count >= row.min && count <= row.max
  }).length
}

function countValid2 (input) {
  return input.filter(row => {
    let count = 0
    if (row.test[row.min - 1] === row.letter) count++
    if (row.test[row.max - 1] === row.letter) count++
    return count === 1
  }).length
}

function parse (line) {
  const matched = line.match(/^(\d+)-(\d+) ([a-z]): ([a-z]+)$/)
  return {
    min: +matched[1],
    max: +matched[2],
    letter: matched[3],
    test: matched[4]
  }
}

const test = load('day2', __dirname).trim().split('\n').map(parse)

console.log(countValid(test))
console.log(countValid2(test))
