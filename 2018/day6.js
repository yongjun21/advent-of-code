const load = require('../loader')

function findLargestArea (input) {
  const xs = input.map(coord => coord[0]).sort((a, b) => a - b)
  const ys = input.map(coord => coord[1]).sort((a, b) => a - b)

  const tally = {}

  for (let x = xs[0]; x <= xs[xs.length - 1]; x++) {
    for (let y = ys[0]; y <= ys[ys.length - 1]; y++) {
      const distance = getDistance(input, x, y)
      const minD = distance.reduce((min, d) => d < min ? d : min, Infinity)
      if (distance.filter(d => d === minD).length > 1) continue
      const closest = distance.findIndex(d => d === minD)
      tally[closest] = tally[closest] || 0
      tally[closest]++
    }
  }

  Object.keys(tally).forEach(key => {
    if (
      xs.filter(x => x < input[key][0]).length <= 0 ||
      ys.filter(y => y < input[key][1]).length <= 0 ||
      xs.filter(x => x > input[key][0]).length <= 0 ||
      ys.filter(y => y > input[key][1]).length <= 0
    ) tally[key] = Infinity
  })

  return Object.values(tally).filter(n => n < Infinity)
    .reduce((max, n) => n > max ? n : max, -Infinity)
}

function findRegionNearAll (input, cutoff = 10000) {
  const xs = input.map(coord => coord[0]).sort((a, b) => a - b)
  const ys = input.map(coord => coord[1]).sort((a, b) => a - b)

  const middle = Math.floor((input.length - 1) / 2)
  const cx = xs[middle]
  const cy = ys[middle]

  let count = 0
  let dx = 0
  let dy = 0

  function comb (offset, cb) {
    const initial = [dx, dy]
    while (true) {
      dx += offset[0]
      dy += offset[1]
      const distance = getDistance(input, cx + dx, cy + dy)
      if (distance.reduce((sum, d) => sum + d, 0) <= cutoff) {
        count++
        if (cb) cb()
      } else break
    }
    dx = initial[0]
    dy = initial[1]
  }

  function combHorizontally () {
    comb([1, 0])
    comb([-1, 0])
  }

  combHorizontally()
  comb([0, 1], combHorizontally)
  comb([0, -1], combHorizontally)

  if (count > 0) count++
  return count
}

function getDistance (points, x, y) {
  return points.map(coord => Math.abs(coord[0] - x) + Math.abs(coord[1] - y))
}

function parse (line) {
  return line.split(', ').map(v => +v)
}

const test = load('day6', __dirname).trim().split('\n').map(parse)

console.log(findLargestArea(test))
console.log(findRegionNearAll(test))
