function run (input, dim, cycles) {
  const adjacents = getAdjacents(dim)

  const bbox = new Array(dim * 2).fill(0)
  let active = new Set()
  input.forEach((row, y) => {
    row.forEach((col, x) => {
      if (col === '#') {
        if (x > bbox[dim]) bbox[dim] = x
        if (y > bbox[dim + 1]) bbox[dim + 1] = y
        const coord = new Array(dim).fill(0)
        coord[0] = x
        coord[1] = y
        const key = coord.join(',')
        active.add(key)
      }
    })
  })

  function cycle (prev) {
    const next = new Set()
    const coords = getCoords(bbox)
    coords.forEach(coord => {
      let active = 0
      for (const offset of adjacents) {
        const key = coord.map((v, i) => v + offset[i]).join(',')
        if (prev.has(key)) active++
      }
      const key = coord.join(',')
      if ((prev.has(key) && active >= 2 && active <= 3) || (!prev.has(key) && active === 3)) {
        next.add(key)
        coord.forEach((v, i) => {
          if (v < bbox[i]) bbox[i] = v
          if (v > bbox[dim + i]) bbox[dim + i] = v
        })
      }
    })
    return next
  }

  while (cycles-- > 0) {
    active = cycle(active)
  }
  return active.size
}

function getAdjacents (dim, center = false) {
  if (dim === 0) return [[]]
  const output = []
  const lower = getAdjacents(dim - 1, true)
  ;[-1, 0, 1].forEach(v => {
    lower.forEach(arr => {
      output.push(arr.concat(v))
    })
  })
  return center ? output : output.filter(arr => arr.some(v => v !== 0))
}

function getCoords (bbox) {
  const dim = bbox.length / 2
  if (dim === 0) return [[]]
  const output = []
  const lower = getCoords(bbox.slice(0, dim - 1).concat(bbox.slice(dim, -1)))
  for (let v = bbox[dim - 1] - 1; v <= bbox[2 * dim - 1] + 1; v++) {
    lower.forEach(arr => {
      output.push(arr.concat(v))
    })
  }
  return output
}

const test = `
.#.#..##
..#....#
##.####.
...####.
#.##..##
#...##..
...##.##
#...#.#.
`.trim().split('\n').map(line => line.trim().split(''))

console.log(run(test, 3, 6))
console.log(run(test, 4, 6))
