const load = require('../loader')

function parseInstruction (row) {
  const match = row.match(/^(.+) (\d+,\d+) through (\d+,\d+)$/)
  return {
    action: match[1],
    range: [
      match[2].split(',').map(v => +v),
      match[3].split(',').map(v => +v)
    ]
  }
}

function lightUp (input, actions) {
  const state = {}

  const instructions = input.trim().split('\n').map(parseInstruction)
  instructions.forEach(row => {
    const xMin = Math.min(row.range[0][0], row.range[1][0])
    const yMin = Math.min(row.range[0][1], row.range[1][1])
    const xMax = Math.max(row.range[0][0], row.range[1][0])
    const yMax = Math.max(row.range[0][1], row.range[1][1])

    for (let x = xMin; x <= xMax; x++) {
      for (let y = yMin; y <= yMax; y++) {
        const key = x + '.' + y
        state[key] = actions[row.action](state[key] || 0)
      }
    }
  })

  return Object.keys(state).reduce((sum, key) => sum + state[key], 0)
}

const actionSetOne = {
  'turn on': v => 1,
  'turn off': v => 0,
  'toggle': v => v ? 0 : 1
}

const actionSetTwo = {
  'turn on': v => v + 1,
  'turn off': v => Math.max(0, v - 1),
  'toggle': v => v + 2
}

const test = load('day6', __dirname)

console.log(lightUp(test, actionSetOne))
console.log(lightUp(test, actionSetTwo))
