const load = require('../loader')

const {
  // printState,
  intcode
} = require('./common')

// const pixels = { 1: '|', 2: 'x', 3: '_', 4: 'o' }

function play (input, quarters = 1) {
  input = [...input]
  input[0] = quarters
  const program = intcode(input)
  const screen = {}
  let score
  let ball
  let paddle
  while (true) {
    if (program.mode === 'i') {
      // printState(screen, pixels)
      const joystick = ball[0] > paddle[0] ? 1 : ball[0] < paddle[0] ? -1 : 0
      const next = program.next(joystick)
      if (next.done) break
    } else {
      const next = program.next()
      if (next.done) break
      const x = next.value
      const y = program.next().value
      const id = program.next().value
      if (x === -1 && y === 0) {
        score = id
      } else {
        if (id === 3) paddle = [x, y]
        if (id === 4) ball = [x, y]
        screen[x + ',' + y] = id
      }
    }
  }
  return [screen, score]
}

function countTiles (input, tileId) {
  const [screen] = play(input)
  return Object.values(screen).filter(id => id === tileId).length
}

const test = load('day13', __dirname).split(',').map(Number)

console.log(countTiles(test, 2))
console.log(play(test, 2)[1])
