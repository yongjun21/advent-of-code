const load = require('../loader')

const ACTIONS = {
  U: [0, -1],
  D: [0, 1],
  L: [-1, 0],
  R: [1, 0]
}

function sumVisited (input, knots = 1) {
  const visited = new Set()
  let headX = 0
  let headY = 0
  const states = new Array(knots).fill([0, 0])
  let tailX = headX + states.reduce((sum, state) => sum + state[0], 0)
  let tailY = headY + states.reduce((sum, state) => sum + state[1], 0)
  visited.add(`${tailX},${tailY}`)
  input.forEach(({ action: actionKey, times }) => {
    while (times-- > 0) {
      let action = ACTIONS[actionKey]
      headX += action[0]
      headY += action[1]
      for (let i = 0; i < states.length; i++) {
        const [nextState, actionTail] = transition(states[i], action)
        states[i] = nextState
        action = actionTail
      }
      tailX = headX + states.reduce((sum, state) => sum + state[0], 0)
      tailY = headY + states.reduce((sum, state) => sum + state[1], 0)
      visited.add(`${tailX},${tailY}`)
    }
  })
  return visited.size
}

function transition (state, action) {
  /*
  S0 = T0 - H0
  AH = H1 - H0
  H1 = H0 + AH
  T0 = H0 + S0
  H1 - T0 = AH - S0
  */
  const offset = [action[0] - state[0], action[1] - state[1]]

  // AT = f(H1 - T0)
  const actionTail =
    Math.abs(offset[0]) > 1 || Math.abs(offset[1]) > 1
      ? [clamp(offset[0], -1, 1), clamp(offset[1], -1, 1)]
      : [0, 0]

  /*
  AT = T1 - T0
  S1 = T1 - H1
  S1 - S0 = (T1 - T0) - (H1 - H0)
          = AT - AH
  S1 = S0 + AT - AH
  */
  const nextState = [
    state[0] + actionTail[0] - action[0],
    state[1] + actionTail[1] - action[1]
  ]
  return [nextState, actionTail]
}

function clamp (v, min, max) {
  return Math.min(Math.max(v, min), max)
}

function parse (line) {
  const tokens = line.split(' ')
  return {
    action: tokens[0],
    times: +tokens[1]
  }
}

const test = load('day9', __dirname).trim().split('\n').map(parse)

console.log(sumVisited(test))
console.log(sumVisited(test, 9))
