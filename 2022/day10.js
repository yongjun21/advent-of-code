const load = require('../loader')

function sumSignalStrength (input) {
  const INTERESTING = [20, 60, 100, 140, 180, 220]
  let cycle = 0
  let x = 1
  let i = 0
  let sum = 0
  input.forEach(row => {
    cycle += row.instruction === 'addx' ? 2 : 1
    if (cycle >= INTERESTING[i]) {
      sum += INTERESTING[i] * x
      i++
    }
    x += row.instruction === 'addx' ? row.value : 0
  })
  return sum
}

function renderImage (input) {
  const pixels = new Uint8Array(240)
  let cycle = 0
  let x = 1
  input.forEach(row => {
    if (row.instruction === 'addx') {
      renderPixel()
      renderPixel()
      x += row.value
    } else {
      renderPixel()
    }
  })
  function renderPixel () {
    const position = cycle
    pixels[position] = (position >= x - 1 && position <= x + 1) ? 1 : 0
    cycle++
    if (cycle % 40 === 0) x += 40
  }
  for (let i = 0; i < pixels.length; i += 40) {
    let line = ''
    for (let ii = i; ii < i + 40; ii++) {
      line += pixels[ii] ? '#' : '.'
    }
    console.log(line)
  }
}

function parse (line) {
  const tokens = line.split(' ')
  const instruction = tokens[0]
  return {
    instruction,
    value: tokens[1] ? +tokens[1] : undefined
  }
}

const test = load('day10', __dirname).trim().split('\n').map(parse)

console.log(sumSignalStrength(test))
renderImage(test)
