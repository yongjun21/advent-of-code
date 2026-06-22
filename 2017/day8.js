const load = require('../loader')

function parseInput (input) {
  return input.trim().split('\n').map(line => {
    const [lhs, rhs] = line.split(' if ')
    const [target, operation, incrementValue] = lhs.split(' ')
    const [compareTarget, comparison, comparedValue] = rhs.split(' ')

    return {
      target,
      operation,
      incrementValue: +incrementValue,
      compareTarget,
      comparison,
      comparedValue: +comparedValue
    }
  })
}

function getRegisterHighestValue (input) {
  const lines = parseInput(input)

  const registerState = {}

  function checkCondition (line) {
    const target = registerState[line.compareTarget] || 0
    switch (line.comparison) {
      case '<':
        return target < line.comparedValue
      case '>':
        return target > line.comparedValue
      case '<=':
        return target <= line.comparedValue
      case '>=':
        return target >= line.comparedValue
      case '==':
        return target == line.comparedValue // eslint-disable-line
      case '!=':
        return target != line.comparedValue // eslint-disable-line
    }
  }

  const highestValues = []

  lines.forEach(line => {
    if (checkCondition(line)) {
      registerState[line.target] = registerState[line.target] || 0
      if (line.operation === 'inc') registerState[line.target] += line.incrementValue
      else if (line.operation === 'dec') registerState[line.target] -= line.incrementValue
    }
    const max = Math.max(...Object.keys(registerState).map(key => registerState[key]))
    highestValues.push(max)
  })

  return highestValues
}

const test = load('day8', __dirname)

const highestValues = getRegisterHighestValue(test)

console.log(highestValues[highestValues.length - 1])
console.log(Math.max(...highestValues))
