const load = require('../loader')

function executeMoves (stacks, moves, maxHold = 1) {
  stacks = stacks.map(stack => [...stack])
  moves.forEach(row => {
    const fromStack = stacks[row.from - 1]
    const toStack = stacks[row.to - 1]
    const holdStack = []
    for (let n = 0; n < row.move; n++) {
      if (holdStack.length === maxHold) {
        for (const item of emptyStack(holdStack)) toStack.push(item)
      }
      holdStack.push(fromStack.pop())
    }
    for (const item of emptyStack(holdStack)) toStack.push(item)
  })
  return stacks
}

function * emptyStack (stack) {
  while (stack.length > 0) {
    yield stack.pop()
  }
}

function parse (line) {
  const splitted = line.split(' ')
  return {
    move: +splitted[1],
    from: +splitted[3],
    to: +splitted[5]
  }
}

const test = load('day5', __dirname)
const parts = test.split('\n\n')
const stacks = parts[0].split('\n').map(line => line.split(''))
const moves = parts[1].split('\n').map(parse)

console.log(executeMoves(stacks, moves).map(stack => stack.pop()).join(''))
console.log(executeMoves(stacks, moves, Infinity).map(stack => stack.pop()).join(''))
