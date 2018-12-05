function * disc (positions, start) {
  let position = start
  while (true) {
    position = (position + 1) % positions
    yield position
  }
}

function getDiscs (input) {
  const discs = []
  input.trim().split('\n').forEach(line => {
    const match = line.match(/^Disc #. has ([0-9]+) positions; at time=0, it is at position ([0-9]+).$/)
    discs.push(disc(+match[1], +match[2]))
  })
  return discs
}

function passThrough (positions, discs, delay = 0) {
  while (positions.length < discs.length + delay) {
    positions.push(discs.map(disc => disc.next().value))
  }

  return discs.reduce((and, disc, i) => {
    return and && positions[i + delay][i] === 0
  }, true)
}

function getCapsule (input, ...extras) {
  const discs = getDiscs(input)
  extras.forEach(extra => {
    discs.push(disc(extra[0], extra[1]))
  })
  const positions = []
  let delay = 0
  while (!passThrough(positions, discs, delay)) {
    positions[delay++] = undefined
  }
  return delay
}

const test = `
Disc #1 has 5 positions; at time=0, it is at position 2.
Disc #2 has 13 positions; at time=0, it is at position 7.
Disc #3 has 17 positions; at time=0, it is at position 10.
Disc #4 has 3 positions; at time=0, it is at position 2.
Disc #5 has 19 positions; at time=0, it is at position 9.
Disc #6 has 7 positions; at time=0, it is at position 0.
`

console.log(getCapsule(test))
console.log(getCapsule(test, [11, 0]))
