function getBestLocation (input) {
  const locations = []
  input.forEach((row, y) => {
    row.forEach((v, x) => {
      if (v === '#') locations.push([x, y])
    })
  })

  locations.forEach((o, i) => {
    const north = new Map()
    const south = new Map()
    locations.forEach((d, j) => {
      if (i === j) return
      const off = [d[0] - o[0], d[1] - o[1]]
      const grad = off[0] / off[1]
      if (off[1] <= 0) {
        const aligned = north.get(grad) || []
        aligned.push(d)
        north.set(grad, aligned)
      } else {
        const aligned = south.get(grad) || []
        aligned.push(d)
        south.set(grad, aligned)
      }
    })
    o.push(north, south)
  })

  return locations.reduce((best, pt) => pt[2].size + pt[3].size > best[2].size + best[3].size ? pt : best)
}

function countAsteroids (location, n) {
  const north = [...location[2]].sort((a, b) => b[0] - a[0])
  const south = [...location[3]].sort((a, b) => b[0] - a[0])
  const ordered = [].concat(
    north.filter(v => v[0] <= 0),
    south,
    north.filter(v => v[0] > 0)
  ).map(v => {
    const withDistance = v[1].map(pt => [manhattan(location, pt), pt])
    return withDistance.sort((a, b) => a[0] - b[0]).map(v => v[1])
  })
  let i = 0
  let vaporized
  while (n-- > 0) {
    vaporized = ordered[i].shift()
    if (i === ordered.length - 1) i = 0
    else i++
  }
  return vaporized
}

function manhattan (a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
}

const test = `
.#......##.#..#.......#####...#..
...#.....##......###....#.##.....
..#...#....#....#............###.
.....#......#.##......#.#..###.#.
#.#..........##.#.#...#.##.#.#.#.
..#.##.#...#.......#..##.......##
..#....#.....#..##.#..####.#.....
#.............#..#.........#.#...
........#.##..#..#..#.#.....#.#..
.........#...#..##......###.....#
##.#.###..#..#.#.....#.........#.
.#.###.##..##......#####..#..##..
.........#.......#.#......#......
..#...#...#...#.#....###.#.......
#..#.#....#...#.......#..#.#.##..
#.....##...#.###..#..#......#..##
...........#...#......#..#....#..
#.#.#......#....#..#.....##....##
..###...#.#.##..#...#.....#...#.#
.......#..##.#..#.............##.
..###........##.#................
###.#..#...#......###.#........#.
.......#....#.#.#..#..#....#..#..
.#...#..#...#......#....#.#..#...
#.#.........#.....#....#.#.#.....
.#....#......##.##....#........#.
....#..#..#...#..##.#.#......#.#.
..###.##.#.....#....#.#......#...
#.##...#............#..#.....#..#
.#....##....##...#......#........
...#...##...#.......#....##.#....
.#....#.#...#.#...##....#..##.#.#
.#.#....##.......#.....##.##.#.##
`.trim().split('\n').map(line => line.split(''))

const bestLocation = getBestLocation(test)
console.log(bestLocation[2].size + bestLocation[3].size)
console.log(countAsteroids(bestLocation, 200).slice(0, 2))
