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

const test = `
noop
noop
addx 5
addx 3
addx -2
noop
addx 5
addx 4
noop
addx 3
noop
addx 2
addx -17
addx 18
addx 3
addx 1
noop
addx 5
noop
addx 1
addx 2
addx 5
addx -40
noop
addx 5
addx 2
addx 3
noop
addx 2
addx 3
addx -2
addx 2
addx 2
noop
addx 3
addx 5
addx 2
addx 3
addx -2
addx 2
addx -24
addx 31
addx 2
addx -33
addx -6
addx 5
addx 2
addx 3
noop
addx 2
addx 3
noop
addx 2
addx -1
addx 6
noop
noop
addx 1
addx 4
noop
noop
addx -15
addx 20
noop
addx -23
addx 27
noop
addx -35
addx 1
noop
noop
addx 5
addx 11
addx -10
addx 4
addx 1
noop
addx 2
addx 2
noop
addx 3
noop
addx 3
addx 2
noop
addx 3
addx 2
addx 11
addx -4
addx 2
addx -38
addx -1
addx 2
noop
addx 3
addx 5
addx 2
addx -7
addx 8
addx 2
addx 2
noop
addx 3
addx 5
addx 2
addx -25
addx 26
addx 2
addx 8
addx -1
addx 2
addx -2
addx -37
addx 5
addx 3
addx -1
addx 5
noop
addx 22
addx -21
addx 2
addx 5
addx 2
addx 13
addx -12
addx 4
noop
noop
addx 5
addx 1
noop
noop
addx 2
noop
addx 3
noop
noop
`.trim().split('\n').map(parse)

console.log(sumSignalStrength(test))
renderImage(test)
