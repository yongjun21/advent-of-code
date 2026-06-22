const load = require('../loader')

function countExcluded (input, y) {
  return getExcluded(input, y).reduce((sum, range) => sum + range[1] - range[0] + 1, 0)
}

function locateDistressBeacon (input, range) {
  const beacons = new Set()
  input.forEach(row => {
    const [x, y] = row.beacon
    beacons.add(`${x},${y}`)
  })

  for (let y = range[0]; y <= range[1]; y++) {
    const excluded = unionRange(
      getExcluded(input, y),
      [[-Infinity, range[0] - 1], [range[1] + 1, Infinity]]
    )
    for (let i = 1; i < excluded.length; i++) {
      if (excluded[i][0] - 1 > excluded[i - 1][1]) {
        const x = excluded[i][0] - 1
        if (beacons.has(`${x},${y}`)) continue
        return 4000000 * x + y
      }
    }
  }
}

function getExcluded (input, y) {
  let excluded = []
  input.forEach(row => {
    const d = Math.abs(row.sensor[0] - row.beacon[0]) + Math.abs(row.sensor[1] - row.beacon[1])
    const offsetY = Math.abs(row.sensor[1] - y)
    const offsetX = d - offsetY
    if (offsetX < 0) return
    const toExclude = [row.sensor[0] - offsetX, row.sensor[0] + offsetX]
    if (row.beacon[1] === y) {
      if (row.beacon[0] === toExclude[0]) toExclude[0]++
      if (row.beacon[0] === toExclude[1]) toExclude[1]--
    }
    if (toExclude[1] >= toExclude[0]) excluded = unionRange(excluded, [toExclude])
  })
  return excluded
}

function unionRange (a, b) {
  const union = []
  let slice
  let indexA = 0
  let indexB = 0
  while (indexA < a.length || indexB < b.length) {
    let min
    if (!b[indexB]) min = a[indexA++]
    else if (!a[indexA]) min = b[indexB++]
    else if (a[indexA][0] <= b[indexB][0]) min = a[indexA++]
    else min = b[indexB++]

    if (!slice || min[0] > slice[1]) union.push((slice = [...min]))
    else if (min[1] > slice[1]) slice[1] = min[1]
  }
  return union
}

function parse (line) {
  const matched = line.match(/^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/)
  return {
    sensor: [+matched[1], +matched[2]],
    beacon: [+matched[3], +matched[4]]
  }
}

const test = load('day15', __dirname).trim().split('\n').map(parse)

console.log(countExcluded(test, 2000000))
console.log(locateDistressBeacon(test, [0, 4000000]))
