const load = require('../loader')

function findOverlap (input) {
  const claims = getClaims(input)
  return Object.values(claims).filter(count => count > 1).length
}

function findNoOverlap (input) {
  const claims = getClaims(input)
  return input.find(row => {
    for (let x = row.left + 1; x <= row.left + row.width; x++) {
      for (let y = row.top + 1; y <= row.top + row.height; y++) {
        const key = x + '.' + y
        if (claims[key] > 1) return false
      }
    }
    return true
  }).id
}

function getClaims (parsed) {
  const claims = {}
  parsed.forEach(row => {
    for (let x = row.left + 1; x <= row.left + row.width; x++) {
      for (let y = row.top + 1; y <= row.top + row.height; y++) {
        const key = x + '.' + y
        claims[key] = claims[key] || 0
        claims[key]++
      }
    }
  })
  return claims
}

function parse (line) {
  const match = line.match(/^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$/)
  const id = match[1]
  const left = +match[2]
  const top = +match[3]
  const width = +match[4]
  const height = +match[5]
  return {id, left, top, width, height}
}

const test = load('day3', __dirname).trim().split('\n').map(parse)

console.log(findOverlap(test))
console.log(findNoOverlap(test))
