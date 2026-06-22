const load = require('../loader')

function countOverlap (input, skip = () => false) {
  const count = Object.create(null)
  input.forEach(([a, b]) => {
    if (skip(a, b)) return
    const norm = Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]))
    for (let k = 0; k <= norm; k++) {
      const t = k / norm
      const interpolated = [
        Math.round((1 - t) * a[0] + t * b[0]),
        Math.round((1 - t) * a[1] + t * b[1])
      ]
      count[interpolated] = count[interpolated] || 0
      count[interpolated]++
    }
  })
  return Object.values(count).filter(v => v > 1).length
}

function parse (line) {
  return line.split(' -> ').map(sub => sub.split(',').map(Number))
}

const test = load('day5', __dirname).trim().split('\n').map(parse)

console.log(countOverlap(test, (a, b) => a[0] !== b[0] && a[1] !== b[1]))
console.log(countOverlap(test))
