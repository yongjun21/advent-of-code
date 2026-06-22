const load = require('../loader')

const DIRECTIONS = [[1, 0], [0, 1], [-1, 0], [0, -1]]

const SIMPLE_TOPOLOGY = [
  [
    [1, 0],
    [2, 1],
    [1, 2],
    [4, 3]
  ],
  [
    [0, 0],
    [1, 1],
    [0, 2],
    [1, 3]
  ],
  [
    [2, 0],
    [4, 1],
    [2, 2],
    [0, 3]
  ],
  [
    [4, 0],
    [5, 1],
    [4, 2],
    [5, 3]
  ],
  [
    [3, 0],
    [0, 1],
    [3, 2],
    [2, 3]
  ],
  [
    [5, 0],
    [3, 1],
    [5, 2],
    [3, 3]
  ]
]

const TOPOLOGY_3D = [
  [
    [1, 0],
    [2, 1],
    [3, 0],
    [5, 0]
  ],
  [
    [4, 2],
    [2, 2],
    [0, 2],
    [5, 3]
  ],
  [
    [1, 3],
    [4, 1],
    [3, 1],
    [0, 3]
  ],
  [
    [4, 0],
    [5, 1],
    [0, 0],
    [2, 0]
  ],
  [
    [1, 2],
    [5, 2],
    [3, 2],
    [2, 3]
  ],
  [
    [4, 3],
    [1, 1],
    [0, 1],
    [3, 3]
  ]
]

function getFinalPassword (map, moves, topology, size = 50) {
  const [data, dim, faces] = readMap(map, size)

  let direction = 0
  let face = 0
  let [x, y] = faces[face]

  function crossFace (nextFace, nextDirection, x, y, size = 50) {
    x -= faces[face][0]
    y -= faces[face][1]
    let nextX, nextY
    switch (nextDirection) {
      case 0:
        nextX = 0
        if (direction === 0) nextY = y
        if (direction === 1) nextY = (size - 1) - x
        if (direction === 2) nextY = (size - 1) - y
        if (direction === 3) nextY = x
        break
      case 1:
        nextY = 0
        if (direction === 0) nextX = (size - 1) - y
        if (direction === 1) nextX = x
        if (direction === 2) nextX = y
        if (direction === 3) nextX = (size - 1) - x
        break
      case 2:
        nextX = 49
        if (direction === 0) nextY = (size - 1) - y
        if (direction === 1) nextY = x
        if (direction === 2) nextY = y
        if (direction === 3) nextY = (size - 1) - x
        break
      case 3:
        nextY = 49
        if (direction === 0) nextX = y
        if (direction === 1) nextX = (size - 1) - x
        if (direction === 2) nextX = (size - 1) - y
        if (direction === 3) nextX = x
        break
    }
    nextX += faces[nextFace][0]
    nextY += faces[nextFace][1]
    return [nextX, nextY]
  }

  for (let move of readMoves(moves)) {
    if (move === 'R') {
      direction++
      if (direction >= DIRECTIONS.length) direction -= DIRECTIONS.length
    } else if (move === 'L') {
      direction--
      if (direction < 0) direction += DIRECTIONS.length
    } else {
      while (move-- > 0) {
        let nextX = x + DIRECTIONS[direction][0]
        let nextY = y + DIRECTIONS[direction][1]
        let nextFace = face
        let nextDirection = direction
        if (nextX >= faces[face][0] + size) {
          [nextFace, nextDirection] = topology[face][0];
          [nextX, nextY] = crossFace(nextFace, nextDirection, x, y, size)
        } else if (nextY >= faces[face][1] + size) {
          [nextFace, nextDirection] = topology[face][1];
          [nextX, nextY] = crossFace(nextFace, nextDirection, x, y, size)
        } else if (nextX < faces[face][0]) {
          [nextFace, nextDirection] = topology[face][2];
          [nextX, nextY] = crossFace(nextFace, nextDirection, x, y, size)
        } else if (nextY < faces[face][1]) {
          [nextFace, nextDirection] = topology[face][3];
          [nextX, nextY] = crossFace(nextFace, nextDirection, x, y, size)
        }
        if (data[nextY * dim[0] + nextX]) break
        face = nextFace
        direction = nextDirection
        x = nextX
        y = nextY
      }
    }
  }

  return (y + 1) * 1000 + (x + 1) * 4 + direction
}

function readMap (map, size = 50) {
  const dim = [
    map.reduce((max, line) => line.length > max ? line.length : max, 0),
    map.length
  ]

  const faces = []
  for (let y = 0; y < dim[1]; y += size) {
    for (let x = 0; x < dim[0]; x += size) {
      if (map[y][x] === '.' || map[y][x] === '#') faces.push([x, y])
    }
  }

  const data = new Uint8Array(dim[0] * dim[1])
  faces.forEach(([x0, y0]) => {
    for (let y = y0; y < y0 + size; y++) {
      for (let x = x0; x < x0 + size; x++) {
        if (map[y][x] === '#') data[y * dim[0] + x] = 1
      }
    }
  })

  return [data, dim, faces]
}

function * readMoves (moves) {
  const re = /(\d+)|([RDLU])/g
  while (true) {
    const matched = re.exec(moves)
    if (!matched) break
    if (matched[1]) yield +matched[1]
    else yield matched[2]
  }
}

const test = load('day22', __dirname)
const parts = test.split('\n\n')
const map = parts[0].split('\n')
const moves = parts[1]

console.log(getFinalPassword(map, moves, SIMPLE_TOPOLOGY))
console.log(getFinalPassword(map, moves, TOPOLOGY_3D))
