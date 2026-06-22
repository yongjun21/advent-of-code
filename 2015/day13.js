const load = require('../loader')

const {getPermutations} = require('../helpers')

function parseInput (input) {
  const matrix = {}
  const members = {}
  input.trim().split('\n').forEach(line => {
    const match = line.match(/^(.+) would (gain|lose) ([0-9]+) happiness units by sitting next to (.+).$/)
    const value = match[2] === 'lose' ? -1 * +match[3] : +match[3]
    matrix[[match[1], match[4]].join('.')] = value
    members[match[1]] = 1
    members[match[4]] = 1
  })
  return {
    matrix,
    members: Object.keys(members),
    get (a, b) {
      if (typeof a === 'symbol' || typeof b === 'symbol') return 0
      return this.matrix[[a, b].join('.')]
    }
  }
}

function findMaxHappiness (input, neutral = 0) {
  const matrix = parseInput(input)
  for (let n = 0; n < neutral; n++) {
    matrix.members.push(Symbol())
  }

  const arrangements = getPermutations(matrix.members.slice(1))

  const totalHappiness = arrangements.map(arrangement => {
    const arr = [matrix.members[0], ...arrangement, matrix.members[0]]
    let happiness = 0
    for (let i = 1; i < arr.length; i++) {
      happiness += matrix.get(arr[i - 1], arr[i])
      happiness += matrix.get(arr[i], arr[i - 1])
    }
    return happiness
  })

  return Math.max(...totalHappiness)
}

const test = load('day13', __dirname)

console.log(findMaxHappiness(test))
console.log(findMaxHappiness(test, 1))
