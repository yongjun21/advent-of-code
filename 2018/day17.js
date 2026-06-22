const load = require('../loader')
const fs = require('fs')

function findTilesReached (input) {
  const {tiles, bbox} = scan(input)

  flowDown([500, 0])
  print(tiles, bbox)

  return Object.keys(tiles).reduce((sum, coord) => {
    const y = +coord.split(',')[1]
    if (y < bbox[1]) return sum
    if (tiles[coord] === '|') sum['|']++
    if (tiles[coord] === '~') sum['~']++
    return sum
  }, {'|': 0, '~': 0})

  function flowDown (source) {
    let [x, y] = source
    do {
      if (y > bbox[3]) return true
      tiles[[x, y]] = '|'
      const bottom = tiles[[x, y + 1]]
      if (bottom == null) {
        y++
      } else if (bottom === '#' || bottom === '~') {
        const left = flowSideway([x, y], -1)
        const right = flowSideway([x, y], 1)
        if (left == null || right == null) return true
        for (let x = left; x <= right; x++) tiles[[x, y]] = '~'
        y--
      } else if (bottom === '|') {
        return true
      }
    } while (y > source[1])
  }

  function flowSideway (source, direction) {
    let [x, y] = source
    while (true) {
      tiles[[x, y]] = '|'

      const bottom = tiles[[x, y + 1]]
      if (bottom === '|') return null
      if (bottom == null && flowDown([x, y])) return null

      const next = tiles[[x + direction, y]]
      if (next === '#') return x
      else if (next === '|') return null
      else x += direction
    }
  }
}

function scan (input) {
  const tiles = {}
  const bbox = [Infinity, Infinity, -Infinity, -Infinity]
  input.forEach(row => {
    if (row.x[0] < bbox[0]) bbox[0] = row.x[0]
    if (row.y[0] < bbox[1]) bbox[1] = row.y[0]
    if (row.x[1] > bbox[2]) bbox[2] = row.x[1]
    if (row.y[1] > bbox[3]) bbox[3] = row.y[1]
    for (let x = row.x[0]; x <= row.x[1]; x++) {
      for (let y = row.y[0]; y <= row.y[1]; y++) {
        tiles[[x, y]] = '#'
      }
    }
  })
  return {tiles, bbox}
}

function print (tiles, bbox) {
  const rows = []
  for (let y = bbox[1]; y <= bbox[3]; y++) {
    let row = ''
    for (let x = bbox[0] - 1; x <= bbox[2] + 1; x++) {
      row += tiles[[x, y]] || '.'
    }
    rows.push(row)
  }
  fs.writeFileSync('2018/output/day17.txt', rows.join('\n'))
}

function parse (line) {
  const match = line.match(/^(x|y)=(\d+), (x|y)=(\d+)..(\d+)$/)
  const row = {}
  row[match[1]] = [+match[2], +match[2]]
  row[match[3]] = [+match[4], +match[5]]
  return row
}

const test = load('day17', __dirname).trim().split('\n').map(parse)

const tilesReached = findTilesReached(test)
console.log(tilesReached['|'] + tilesReached['~'])
console.log(tilesReached['~'])
