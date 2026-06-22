const load = require('../loader')

const {getCombinations} = require('../lazyHelpers')

function checksum (doc, callback) {
  const rows = doc.trim().split('\n').map(r => r.split('\t').map(v => +v))
  return rows.reduce((sum, r) => sum + callback(r), 0)
}

function range (row) {
  row.sort((a, b) => b - a)
  const max = row[0]
  const min = row[row.length - 1]
  return max - min
}

function division (row) {
  row.sort((a, b) => b - a)
  let division = 0
  for (let pair of getCombinations(row, 2)) {
    if (pair[0] % pair[1] === 0) {
      division = pair[0] / pair[1]
      break
    }
  }
  return division
}

/* eslint-disable */
const test = load('day2', __dirname)

console.log(checksum(test, range))
console.log(checksum(test, division))
