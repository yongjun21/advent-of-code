const load = require('../loader')

function parseInput (input) {
  return input.trim().split('\n').map(line => {
    const match = line.match(/^rect ([0-9]+)x([0-9]+)/)
    const match2 = line.match(/^rotate (row|column) ([xy])=([0-9]+) by ([0-9]+)/)
    if (match) {
      return {
        type: 'rect',
        x: +match[1],
        y: +match[2]
      }
    } else if (match2) {
      return {
        type: 'rotate',
        [match2[2]]: +match2[3],
        offset: +match2[4]
      }
    }
  })
}

function computePixel (input, width, height) {
  const lines = parseInput(input)
  const screen = {}

  lines.forEach(line => {
    if (line.type === 'rect') {
      for (let i = 0; i < line.x; i++) {
        for (let j = 0; j < line.y; j++) {
          screen[[i, j].join('.')] = 1
        }
      }
    } else if (line.type === 'rotate') {
      const original = []
      const transformed = []
      const {x: i, y: j} = line
      if (i != null) {
        for (let j = 0; j < height; j++) {
          original.push(screen[[i, j].join('.')])
        }
        original.forEach((v, j) => {
          transformed[(j + line.offset) % height] = v
        })
        transformed.forEach((v, j) => {
          screen[[i, j].join('.')] = v
        })
      } else if (j != null) {
        for (let i = 0; i < width; i++) {
          original.push(screen[[i, j].join('.')])
        }
        original.forEach((v, i) => {
          transformed[(i + line.offset) % width] = v
        })
        transformed.forEach((v, i) => {
          screen[[i, j].join('.')] = v
        })
      }
    }
  })

  return screen
}

function render (state, width, height) {
  for (let j = 0; j < height; j++) {
    let str = ''
    for (let i = 0; i < width; i++) {
      str += state[[i, j].join('.')] ? 'o' : ' '
    }
    console.log(str)
  }
}

const test = load('day8', __dirname)

const width = 50
const height = 6

const pixelState = computePixel(test, width, height)

console.log(Object.keys(pixelState).filter(key => pixelState[key]).length)

render(pixelState, width, height)
