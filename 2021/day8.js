const load = require('../loader')

const { getPermutations } = require('../helpers')

const BASE_SEQUENCE = 'abcdefg'
const BASE_PATTERNS = [
  'abcefg',
  'cf',
  'acdeg',
  'acdfg',
  'bcdf',
  'abdfg',
  'abdefg',
  'acf',
  'abcdefg',
  'abcdfg'
]

const PERMUTATIONS = getPermutations(BASE_SEQUENCE.split('')).map(ordered => {
  const mapping = new Map()
  BASE_SEQUENCE.split('').forEach((before, i) => {
    const after = ordered[i]
    mapping.set(before, after)
  })

  return BASE_PATTERNS.map(pattern =>
    pattern
      .split('')
      .map(before => mapping.get(before))
      .sort()
      .join('')
  )
})

function count1478 (input) {
  const count = new Array(10).fill(0)
  input.forEach(row => {
    const decoded = decode(row)
    decoded.forEach(v => {
      count[v]++
    })
  })
  return count[1] + count[4] + count[7] + count[8]
}

function sumOutput (input) {
  let sum = 0
  input.forEach(row => {
    const decoded = decode(row)
    sum += Number(decoded.join(''))
  })
  return sum
}

function decode ([input, output]) {
  const matched = PERMUTATIONS.find(permutation => permutation.every(pattern => input.includes(pattern)))
  return output.map(pattern => matched.indexOf(pattern))
}

function parse (line) {
  return line
    .split(' | ')
    .map(part => part.split(' ').map(token => token.split('').sort().join('')))
}

const test = load('day8', __dirname).trim().split('\n').map(parse)

console.log(count1478(test))
console.log(sumOutput(test))
