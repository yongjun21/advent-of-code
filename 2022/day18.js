const load = require('../loader')

function getSurfaceArea (input) {
  const volume = new Set()
  input.forEach(pt => {
    volume.add(pt.join(','))
  })

  let sum = 0
  input.forEach(([x, y, z]) => {
    sum += 6
    if (volume.has([x - 1, y, z].join(','))) sum--
    if (volume.has([x + 1, y, z].join(','))) sum--
    if (volume.has([x, y - 1, z].join(','))) sum--
    if (volume.has([x, y + 1, z].join(','))) sum--
    if (volume.has([x, y, z - 1].join(','))) sum--
    if (volume.has([x, y, z - 1].join(','))) sum--
  })

  return sum
}

function getExposedSurfaceArea (input) {
  const volume = new Set()
  const bbox = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity]
  input.forEach(([x, y, z]) => {
    volume.add(`${x},${y},${z}`)
    if (x < bbox[0]) bbox[0] = x
    if (y < bbox[1]) bbox[1] = y
    if (z < bbox[2]) bbox[2] = z
    if (x > bbox[3]) bbox[3] = x
    if (y > bbox[4]) bbox[4] = y
    if (z > bbox[5]) bbox[5] = z
  })

  const visited = new Map()
  const unvisited = []
  unvisited.push([bbox[0] - 1, bbox[1] - 1, bbox[2] - 1])

  while (unvisited.length > 0) {
    const [x, y, z] = unvisited.pop()
    const key = `${x},${y},${z}`
    if (visited.has(key)) continue
    if (volume.has(key)) continue
    visited.set(key, [x, y, z])
    if (x >= bbox[0]) unvisited.push([x - 1, y, z])
    if (y >= bbox[1]) unvisited.push([x, y - 1, z])
    if (z >= bbox[2]) unvisited.push([x, y, z - 1])
    if (x <= bbox[3]) unvisited.push([x + 1, y, z])
    if (y <= bbox[4]) unvisited.push([x, y + 1, z])
    if (z <= bbox[5]) unvisited.push([x, y, z + 1])
  }

  const l = bbox[3] - bbox[0] + 1 + 2
  const w = bbox[4] - bbox[1] + 1 + 2
  const h = bbox[5] - bbox[2] + 1 + 2
  return getSurfaceArea([...visited.values()]) - 2 * l * w - 2 * w * h - 2 * h * l
}

const test = load('day18', __dirname).trim().split('\n').map(line => line.split(',').map(Number))

console.log(getSurfaceArea(test))
console.log(getExposedSurfaceArea(test))
