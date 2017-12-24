function infect (input, convert, bursts = 10000) {
  convert = Object.assign({'#': '.', '.': '#'}, convert)

  const grid = input.trim().split('\n').reverse()
  const range = (grid.length - 1) / 2
  const state = {}
  for (let i = -range; i < range + 1; i++) {
    for (let j = -range; j < range + 1; j++) {
      state[[i, j].join('.')] = grid[range + j][range + i]
    }
  }

  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
  ]

  let direction = 0
  let current = [0, 0]
  let infections = 0

  while (bursts-- > 0) {
    const key = current.join('.')
    state[key] = state[key] || '.'
    if (state[key] === '#') direction = (direction + 1) % 4
    else if (state[key] === 'F') direction = (direction + 2) % 4
    else if (state[key] === '.') direction = (direction + 3) % 4
    else if (state[key] === 'W') direction = (direction + 4) % 4
    state[key] = convert[state[key]]
    current = [
      current[0] + directions[direction][0],
      current[1] + directions[direction][1]
    ]
    if (state[key] === '#') infections++
  }

  return infections
}

const test = `
##.###.....##..#.####....
##...#.#.#..##.#....#.#..
...#..#.###.#.###.##.####
..##..###....#.##.#..##.#
###....#####..###.#..#..#
.....#.#...#..##..#.##...
.##.#.###.#.#...##.#.##.#
......######.###......###
#.....##.#....#...#......
....#..###.#.#.####.##.#.
.#.#.##...###.######.####
####......#...#...#..#.#.
###.##.##..##....#..##.#.
..#.###.##..#...#######..
...####.#...###..#..###.#
..#.#.......#.####.#.....
..##..####.######..##.###
..#..#..##...#.####....#.
.#..#.####.#..##..#..##..
......#####...#.##.#....#
###..#...#.#...#.#..#.#.#
.#.###.#....##..######.##
##.######.....##.#.#.#..#
..#..##.##..#.#..###.##..
#.##.##..##.#.###.......#
`

console.log(infect(test))
console.log(infect(test, {'#': 'F', 'F': '.', '.': 'W', 'W': '#'}, 10000000))
