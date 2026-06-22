const load = require('../loader')

function run (input, fix = false, pointer = 0, acc = 0) {
  const visited = new Set()
  while (!visited.has(pointer)) {
    visited.add(pointer)
    if (pointer >= input.length) return { value: acc, done: true }
    const { op, arg } = input[pointer]
    if (op === 'acc') {
      acc += arg
      pointer++
      continue
    }
    if (fix) {
      const fixed = run(input, false, pointer + (op === 'jmp' ? 1 : arg), acc)
      if (fixed.done) return fixed
    }
    pointer += op === 'jmp' ? arg : 1
  }
  return { value: acc, done: false }
}

function parse (line) {
  const [op, arg] = line.split(' ')
  return { op, arg: +arg }
}

const test = load('day8', __dirname).trim().split('\n').map(parse)

console.log(run(test).value)
console.log(run(test, true).value)
