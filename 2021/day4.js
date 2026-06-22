const load = require('../loader')

function getScoreOfWinningBoard (boards, drawn, order = 1) {
  const [winningBoard, state, lastDrawn] = getWinningBoard(boards, drawn, order)
  const sum = winningBoard.reduce(
    (sum, v, i) => sum + (state[i] === 0 ? v : 0),
    0
  )
  return sum * lastDrawn
}

function getWinningBoard (boards, drawn, order) {
  const n = Math.sqrt(boards[0].length)
  const completeSets = getCompleteSets(n)
  const stateMap = new WeakMap()
  const wonMap = new WeakMap()
  boards.forEach(board => {
    stateMap.set(board, new Uint8Array(board.length))
    wonMap.set(board, 0)
  })
  for (const lastDrawn of drawn) {
    for (const board of boards) {
      const state = stateMap.get(board)
      const won = wonMap.get(board)
      if (won) continue
      board.forEach((v, i) => {
        if (v === lastDrawn) state[i] = 1
      })
      for (const set of completeSets) {
        const sum = set.reduce((sum, i) => sum + state[i], 0)
        if (sum === n) {
          order--
          wonMap.set(board, 1)
          if (order === 0) return [board, state, lastDrawn]
          else break
        }
      }
    }
  }
}

function getCompleteSets (n) {
  const sets = []
  for (let i = 0; i < n * n; i += n) {
    const set = []
    for (let j = 0; j < n; j++) set.push(i + j)
    sets.push(set)
  }
  for (let i = 0; i < n; i++) {
    const set = []
    for (let j = 0; j < n * n; j += n) set.push(i + j)
    sets.push(set)
  }
  return sets
}

function parseBoard (str) {
  return new Uint8Array(str.split(/\D+/).map(Number))
}

const test = load('day4', __dirname)
const parts = test.split('\n\n')
const drawn = parts[0].split(',').map(Number)
const boards = parts.slice(1).map(parseBoard)

console.log(getScoreOfWinningBoard(boards, drawn))
console.log(getScoreOfWinningBoard(boards, drawn, boards.length))
