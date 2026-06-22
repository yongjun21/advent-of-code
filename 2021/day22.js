const load = require('../loader')

function executeReboot (input, limit = [-50, 50]) {
  const setX = new Set()
  const setY = new Set()
  const setZ = new Set()
  input.forEach(([v, bbox]) => {
    setX.add(bbox[0])
    setZ.add(bbox[2])
    setY.add(bbox[1])
    setX.add(bbox[3])
    setY.add(bbox[4])
    setZ.add(bbox[5])
  })
  const sortedX = new Int32Array(setX).sort()
  const sortedY = new Int32Array(setY).sort()
  const sortedZ = new Int32Array(setZ).sort()

  const state = new Uint8Array(sortedX.length * sortedY.length * sortedZ.length)
  input.forEach(([value, bbox], index) => {
    const lowerX = sortedX.indexOf(bbox[0])
    const lowerY = sortedY.indexOf(bbox[1])
    const lowerZ = sortedZ.indexOf(bbox[2])
    const upperX = sortedX.indexOf(bbox[3])
    const upperY = sortedY.indexOf(bbox[4])
    const upperZ = sortedZ.indexOf(bbox[5])
    for (let i = lowerX; i < upperX; i++) {
      for (let j = lowerY; j < upperY; j++) {
        for (let k = lowerZ; k < upperZ; k++) {
          const key = i * sortedY.length * sortedZ.length + j * sortedZ.length + k
          state[key] = value
        }
      }
    }
  })

  let sum = 0
  for (let i = 0; i < sortedX.length; i++) {
    for (let j = 0; j < sortedX.length; j++) {
      for (let k = 0; k < sortedX.length; k++) {
        const key = i * sortedY.length * sortedZ.length + j * sortedZ.length + k
        if (state[key]) {
          if (sortedX[i + 1] <= limit[0]) continue
          if (sortedY[j + 1] <= limit[0]) continue
          if (sortedZ[k + 1] <= limit[0]) continue
          if (sortedX[i] >= limit[1] + 1) continue
          if (sortedY[j] >= limit[1] + 1) continue
          if (sortedZ[k] >= limit[1] + 1) continue
          sum +=
            (Math.min(sortedX[i + 1], limit[1] + 1) - Math.max(sortedX[i], limit[0])) *
            (Math.min(sortedY[j + 1], limit[1] + 1) - Math.max(sortedY[j], limit[0])) *
            (Math.min(sortedZ[k + 1], limit[1] + 1) - Math.max(sortedZ[k], limit[0]))
        }
      }
    }
  }
  return sum
}

function parse (line) {
  const matched = line.match(
    /^(on|off) x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)/
  )
  return [
    matched[1] === 'on' ? 1 : 0,
    [
      +matched[2],
      +matched[4],
      +matched[6],
      +matched[3] + 1,
      +matched[5] + 1,
      +matched[7] + 1
    ]
  ]
}

const test = load('day22', __dirname).trim()  .split('\n')  .map(parse)

console.log(executeReboot(test))
console.log(executeReboot(test, [-Infinity, Infinity]))
