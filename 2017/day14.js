const knotHash = require('./day10')

function generateBitmap (input) {
  const hashes = []
  for (let i = 0; i < 128; i++) {
    hashes.push(knotHash(input + '-' + i))
  }

  return hashes.map(hash =>
    hash.split('').reduce((binary, digit) => {
      const bits = parseInt(digit, 16).toString(2)
      return binary + '0'.repeat(4 - bits.length) + bits
    }, '').split('').map(bit => +bit)
  )
}

function findUsedSquares (input) {
  const bitmap = generateBitmap(input)
  return bitmap
    .map(row => row.reduce((sum, bit) => sum + bit, 0))
    .reduce((sum, v) => sum + v, 0)
}

function findRegions (input) {
  const bitmap = generateBitmap(input)

  let r = 1
  const regions = {}

  function bfs (x, y) {
    const unvisited = []
    unvisited.push([x, y])
    while (unvisited.length > 0) {
      const [x, y] = unvisited.shift()
      const key = [x, y].join('.')
      if (key in regions) continue
      regions[key] = r
      if (x < 127 && bitmap[y][x + 1] === 1) unvisited.push([x + 1, y])
      if (x > 0 && bitmap[y][x - 1] === 1) unvisited.push([x - 1, y])
      if (y < 127 && bitmap[y + 1][x] === 1) unvisited.push([x, y + 1])
      if (y > 0 && bitmap[y - 1][x] === 1) unvisited.push([x, y - 1])
    }
    r++
  }

  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 128; x++) {
      const key = [x, y].join('.')
      if (bitmap[y][x] === 1 && !(key in regions)) bfs(x, y)
    }
  }

  const members = {}
  Object.keys(regions).forEach(key => {
    const region = regions[key]
    members[region] = members[region] || []
    members[region].push(key)
  })

  return Object.keys(members).length
}

const test = 'xlqgujun'

console.log(findUsedSquares(test))
console.log(findRegions(test))
