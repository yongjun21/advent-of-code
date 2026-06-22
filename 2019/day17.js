/* eslint-disable no-labels */
const load = require('../loader')

const { ascii, runCommands } = require('./common')

const OFFSETS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0]
]

function sumAlignmentParameters (input, verbose) {
  const camera = getCamera(ascii([...input]), verbose)
  let sum = 0
  camera.forEach((row, y) => {
    row.forEach((v, x) => {
      if (v !== '#') return
      if (
        camera[y][x - 1] === '#' &&
        camera[y][x + 1] === '#' &&
        camera[y - 1][x] === '#' &&
        camera[y + 1][x] === '#'
      ) {
        sum += (x - 1) * (y - 1)
      }
    })
  })
  return sum
}

function reportDust (input, verbose) {
  const camera = getCamera(ascii([...input]))
  const path = [...trace(camera)]

  const freq = {}
  const possible = path.map((_, i) => {
    const set = []
    for (let j = path.length; j > i; j--) {
      const part = simplify(path.slice(i, j))
      if (part.key.length > 20 || path.length / part.steps > 20) continue
      set.push(part)
      freq[part.key] = freq[part.key] || 0
      freq[part.key]++
    }
    return set
  })
  possible.forEach(set => {
    set.sort((a, b) => freq[a.key] - freq[b.key] || a.steps - b.steps)
  })

  function aStar () {
    const stack = []
    stack.push([])

    while (stack.length > 0) {
      const next = stack.pop()
      if (next.length > 10) continue
      const routines = new Set()
      let n = 0
      next.forEach(part => {
        routines.add(part.key)
        n += part.steps
      })
      if (routines.size > 3) continue
      if (n === path.length) return next
      possible[n].forEach(part => {
        stack.push(next.concat(part))
      })
    }
  }

  const solution = aStar()
  const routines = new Map()
  solution.forEach(part => {
    if (routines.has(part.key)) return
    routines.set(part.key, ['A', 'B', 'C'][routines.size])
  })
  const main = solution.map(part => routines.get(part.key)).join(',')
  const commands = [main, ...routines.keys(), 'n']

  input = [...input]
  input[0] = 2
  const program = ascii(input)
  runCommands(program, commands, verbose)
  const output = program.next().value
  if (verbose) process.stdout.write(output)
  return program.next().value
}

function * trace (camera) {
  let x, y, d

  loop: for (let j = 0; j < camera.length; j++) {
    for (let i = 0; i < camera[j].length; i++) {
      const v = camera[j][i]
      if (v !== '#' && v !== '.') {
        x = i
        y = j
        d = ['^', '>', 'v', '<'].indexOf(v)
        break loop
      }
    }
  }

  const left = d => d === 0 ? 3 : d - 1
  const right = d => d === 3 ? 0 : d + 1

  while (true) {
    if (camera[y + OFFSETS[d][1]][x + OFFSETS[d][0]] === '#') {
      yield 1
      x += OFFSETS[d][0]
      y += OFFSETS[d][1]
    } else if (camera[y + OFFSETS[left(d)][1]][x + OFFSETS[left(d)][0]] === '#') {
      yield 'L'
      d = left(d)
    } else if (camera[y + OFFSETS[right(d)][1]][x + OFFSETS[right(d)][0]] === '#') {
      yield 'R'
      d = right(d)
    } else {
      break
    }
  }
}

function getCamera (program, print = false) {
  const camera = []
  program.next().value.split('\n').forEach(line => {
    if (line.length === 0) return
    if (print) console.log(line)
    camera.push(['.', ...line.split(''), '.'])
  })
  const ncol = camera[0].length
  camera.unshift(Array(ncol).fill('.'))
  camera.push(Array(ncol).fill('.'))
  return camera
}

function simplify (path) {
  const key = []
  let run = 0
  path.forEach(step => {
    if (step === 1) run++
    else {
      if (run > 0) key.push(run)
      key.push(step)
      run = 0
    }
  })
  if (run > 0) key.push(run)
  return {
    key: key.join(','),
    steps: path.length
  }
}

const test = load('day17', __dirname).split(',').map(Number)

console.log(sumAlignmentParameters(test))
console.log(reportDust(test))
