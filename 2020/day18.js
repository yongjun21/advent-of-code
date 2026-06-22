const load = require('../loader')

function sum (input, precedence = false) {
  return input.reduce((sum, expression) => sum + compute(expression, precedence), 0)
}

function compute (expression, precedence, index = 0) {
  const re = /(\d+|\+|\*)/y
  re.lastIndex = index
  const flattened = []
  let lhs
  if (expression[index] === '(') {
    lhs = compute(expression, precedence, re.lastIndex + 1)
    re.lastIndex = compute.lastIndex
  } else {
    lhs = +expression.match(re)[0]
  }
  flattened.push(lhs)
  while (re.lastIndex < expression.length) {
    if (expression[re.lastIndex] === ')') {
      re.lastIndex++
      break
    }
    const op = expression.match(re)[0]
    flattened.push(op)
    let rhs
    if (expression[re.lastIndex] === '(') {
      rhs = compute(expression, precedence, re.lastIndex + 1)
      re.lastIndex = compute.lastIndex
    } else {
      rhs = +expression.match(re)[0]
    }
    flattened.push(rhs)
  }
  compute.lastIndex = re.lastIndex
  let curr = 0
  if (precedence) {
    let first = 0
    while (curr + 1 < flattened.length) {
      if (flattened[curr + 1] === '+') {
        flattened[first] += flattened[curr + 2]
        flattened[curr + 1] = '-'
      } else {
        first = curr + 2
      }
      curr += 2
    }
    curr = 0
  }
  while (curr + 1 < flattened.length) {
    if (flattened[curr + 1] === '+') flattened[0] += flattened[curr + 2]
    else if (flattened[curr + 1] === '*') flattened[0] *= flattened[curr + 2]
    curr += 2
  }
  return flattened[0]
}

const test = load('day18', __dirname).trim().split('\n').map(line => line.replace(/ /g, ''))

console.log(sum(test))
console.log(sum(test, true))
