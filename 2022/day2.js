const load = require('../loader')

const OPPONENT_MOVES = {
  A: 1,
  B: 2,
  C: 3
}

const PLAYER_MOVES = {
  X: 1,
  Y: 2,
  Z: 3
}

const INTENDED_OUTCOME = {
  X: 2,
  Y: 0,
  Z: 1
}

const OUTCOMES = new Map([
  [2, 0],
  [1, 6],
  [0, 3],
  [-1, 0],
  [-2, 6]
])

function getScore (input) {
  return input.reduce((sum, row) => {
    return sum + row.player + OUTCOMES.get(row.player - row.opponent)
  }, 0)
}

function getScore2 (input) {
  return input.reduce((sum, row) => {
    const player = ((row.opponent - 1 + row.intended) % 3) + 1
    return sum + player + OUTCOMES.get(player - row.opponent)
  }, 0)
}

function parse (line) {
  const splitted = line.split(' ')
  return {
    opponent: OPPONENT_MOVES[splitted[0]],
    player: PLAYER_MOVES[splitted[1]],
    intended: INTENDED_OUTCOME[splitted[1]]
  }
}

const test = load('day2', __dirname).trim()  .split('\n')  .map(parse)

console.log(getScore(test))
console.log(getScore2(test))
