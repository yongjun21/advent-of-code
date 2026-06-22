const load = require('../loader')

function parseInput (input) {
  return input.trim().split('\n').map(line => {
    const match = line.match(/^(.+) -> ([a-z]+)$/)
    const lhs = match[1]
    const rhs = match[2]
    const operator = lhs.match(/[A-Z]+/)
    const splitted = lhs.split(/[A-Z]+/).map(substr => substr.trim())

    return {
      out: rhs,
      in1: splitted[0],
      in2: splitted[1],
      operator: operator && operator[0]
    }
  })
}

function executeLogic (lines) {
  const signal = {}

  lines.forEach(line => {
    delete line.signal
    signal[line.out] = line
  })

  Object.keys(signal).forEach(key => {
    getSignal(key)
  })

  function getSignal (key) {
    if (!(key in signal)) return +key
    const line = signal[key]
    if (line.signal != null) return line.signal
    switch (line.operator) {
      case null:
        line.signal = getSignal(line.in1)
        break
      case 'NOT':
        line.signal = ~getSignal(line.in2)
        break
      case 'LSHIFT':
        line.signal = getSignal(line.in1) << getSignal(line.in2)
        break
      case 'RSHIFT':
        line.signal = getSignal(line.in1) >>> getSignal(line.in2)
        break
      case 'AND':
        line.signal = getSignal(line.in1) & getSignal(line.in2)
        break
      case 'OR':
        line.signal = getSignal(line.in1) | getSignal(line.in2)
        break
    }
    return line.signal
  }
  return signal
}

const test = load('day7', __dirname)

const lines = parseInput(test)
console.log(executeLogic(lines)['a'].signal)
lines.push({out: 'b', in1: '16076', operator: null})
console.log(executeLogic(lines)['a'].signal)
