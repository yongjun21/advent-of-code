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
  const matched = line.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/)
  return {
    sensor: [+matched[1], +matched[2]],
    beacon: [+matched[3], +matched[4]]
  }
}

const test = `
Sensor at x=3729579, y=1453415: closest beacon is at x=4078883, y=2522671
Sensor at x=3662668, y=2749205: closest beacon is at x=4078883, y=2522671
Sensor at x=257356, y=175834: closest beacon is at x=1207332, y=429175
Sensor at x=2502777, y=3970934: closest beacon is at x=3102959, y=3443573
Sensor at x=24076, y=2510696: closest beacon is at x=274522, y=2000000
Sensor at x=3163363, y=3448163: closest beacon is at x=3102959, y=3443573
Sensor at x=1011369, y=447686: closest beacon is at x=1207332, y=429175
Sensor at x=3954188, y=3117617: closest beacon is at x=4078883, y=2522671
Sensor at x=3480746, y=3150039: closest beacon is at x=3301559, y=3383795
Sensor at x=2999116, y=3137910: closest beacon is at x=3102959, y=3443573
Sensor at x=3546198, y=462510: closest beacon is at x=3283798, y=-405749
Sensor at x=650838, y=1255586: closest beacon is at x=274522, y=2000000
Sensor at x=3231242, y=3342921: closest beacon is at x=3301559, y=3383795
Sensor at x=1337998, y=31701: closest beacon is at x=1207332, y=429175
Sensor at x=1184009, y=3259703: closest beacon is at x=2677313, y=2951659
Sensor at x=212559, y=1737114: closest beacon is at x=274522, y=2000000
Sensor at x=161020, y=2251470: closest beacon is at x=274522, y=2000000
Sensor at x=3744187, y=3722432: closest beacon is at x=3301559, y=3383795
Sensor at x=2318112, y=2254019: closest beacon is at x=2677313, y=2951659
Sensor at x=2554810, y=56579: closest beacon is at x=3283798, y=-405749
Sensor at x=1240184, y=897870: closest beacon is at x=1207332, y=429175
Sensor at x=2971747, y=2662873: closest beacon is at x=2677313, y=2951659
Sensor at x=3213584, y=3463821: closest beacon is at x=3102959, y=3443573
Sensor at x=37652, y=3969055: closest beacon is at x=-615866, y=3091738
Sensor at x=1804153, y=1170987: closest beacon is at x=1207332, y=429175
`.trim().split('\n').map(parse)

const test2 = `
Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3
`.trim().split('\n').map(parse)

console.log(countExcluded(test, 2000000))
console.log(locateDistressBeacon(test, [0, 4000000]))
