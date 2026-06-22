const load = require('../loader')

const { parseBatch } = require('../2020/common')

const BASE_ROTATION = [
  new Int8Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
  new Int8Array([1, 0, 0, 0, -1, 0, 0, 0, -1]),
  new Int8Array([-1, 0, 0, 0, 1, 0, 0, 0, -1]),
  new Int8Array([-1, 0, 0, 0, -1, 0, 0, 0, 1]),
  new Int8Array([-1, 0, 0, 0, 0, -1, 0, -1, 0]),
  new Int8Array([-1, 0, 0, 0, 0, 1, 0, 1, 0]),
  new Int8Array([1, 0, 0, 0, 0, 1, 0, -1, 0]),
  new Int8Array([1, 0, 0, 0, 0, -1, 0, 1, 0])
]
const ROTATIONS = getRotations(BASE_ROTATION)

function countBeacons (combined) {
  return combined.size
}

function findLargestDistance (scans) {
  let max = 0
  for (let i = 0; i < scans.length - 1; i++) {
    const a = scans[i].position
    for (let j = i + 1; j < scans.length; j++) {
      const b = scans[j].position
      const distance =
        Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2])
      max = Math.max(distance, max)
    }
  }
  return max
}

function assembleMap (input) {
  const scans = parseBatch(input, (line, datum) => {
    const matched = line.match(/^--- scanner (\d+) ---$/)
    if (matched) {
      datum.scanner = +matched[1]
      datum.beacons = []
    } else {
      datum.beacons.push(line.split(',').map(Number))
    }
  })

  const combined = new Map()
  const output = []
  const scan = scans.shift()
  scan.position = [0, 0, 0]
  scan.rotation = ROTATIONS[0]
  scan.beacons.forEach(d => combined.set(d.join(','), d))
  output.push(scan)

  while (scans.length > 0) {
    scans.some((scan, index) => {
      return ROTATIONS.some(t => {
        const transformed = scan.beacons.map(d => [
          t[0] * d[0] + t[1] * d[1] + t[2] * d[2],
          t[3] * d[0] + t[4] * d[1] + t[5] * d[2],
          t[6] * d[0] + t[7] * d[1] + t[8] * d[2]
        ])
        const tally = Object.create(null)
        return [...combined.values()].some(a =>
          transformed.some(b => {
            const offset = [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
            const key = offset.join(',')
            tally[key] = tally[key] || 0
            tally[key]++
            if (tally[key] >= 12) {
              transformed.forEach(d => {
                d[0] += offset[0]
                d[1] += offset[1]
                d[2] += offset[2]
                combined.set(d.join(','), d)
              })
              scan.position = offset.map(v => -v)
              scan.rotation = t
              scans.splice(index, 1)
              output.push(scan)
              return true
            }
            return false
          })
        )
      })
    })
  }
  return [combined, output]
}

function getRotations (base) {
  const withOrientation = []
  for (let k = 0; k < 9; k += 3) {
    base.forEach(before => {
      const after = new Int8Array(9)
      before.forEach((v, i) => {
        after[(i + k) % 9] = v
      })
      withOrientation.push(after)
    })
  }
  return withOrientation
}

const test = load('day19', __dirname)

const [combined, scans] = assembleMap(test)
console.log(countBeacons(combined))
console.log(findLargestDistance(scans))
