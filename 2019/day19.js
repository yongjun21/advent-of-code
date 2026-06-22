const load = require('../loader')

const { intcode } = require('./common')

function scan (input, w, h) {
  let sum = 0
  for (let y = 0; y < h; y++) {
    // let line = ''
    for (let x = 0; x < w; x++) {
      const program = intcode([...input])
      program.next(x)
      program.next(y)
      const out = program.next().value
      sum += out
      // line += out ? '#' : '.'
    }
    // console.log(line)
  }
  return sum
}

function closestPoint (input, start) {
  const t = trace(start[0], start[1], input)
  const edges = []
  let i = 0
  while (true) {
    edges.push(t.next().value)
    if (edges.length >= 100 && edges[i - 99].trailing[0] - edges[i].leading[0] === 99) break
    i++
  }
  const last = edges[edges.length - 1]
  return [last.leading[0], last.leading[1] - 99]
}

function * trace (x, y, p) {
  let x1 = x
  let x2 = x
  while (true) {
    const x10 = Math.floor((x1 - 1) / y * (y + 1)) + 1
    const x11 = x1 / y * (y + 1)
    x1 = Math.ceil(x11)
    for (let i = x10; i < x11; i++) {
      const program = intcode([...p])
      program.next(i)
      program.next(y + 1)
      if (program.next().value === 1) x1 = i
    }
    const x20 = Math.ceil((x2 + 1) / y * (y + 1)) - 1
    const x21 = x2 / y * (y + 1)
    x2 = Math.floor(x21)
    for (let i = x20; i > x21; i--) {
      const program = intcode([...p])
      program.next(i)
      program.next(y + 1)
      if (program.next().value === 1) x2 = i
    }
    y = y + 1
    yield {
      leading: [x1, y],
      trailing: [x2, y]
    }
  }
}

const test = load('day19', __dirname).split(',').map(Number)

console.log(scan(test, 50, 50))
console.log(closestPoint(test, [5, 4]))
