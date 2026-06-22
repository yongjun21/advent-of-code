const assert = require('assert')

const load = require('../loader')

function countDots (dots, folds) {
  const [folded] = applyFold(dots, folds)
  return folded.reduce((sum, v) => sum + v, 0)
}

function printFolded (dots, fold) {
  const [folded, dim] = applyFold(dots, folds)
  for (let i = 0; i < dim[0] * dim[1]; i += dim[0]) {
    const line = [...folded.slice(i, i + dim[0]).values()].map(v => v ? 'X' : ' ').join('')
    console.log(line)
  }
}

function applyFold (dots, folds) {
  const maxCoord = [0, 0]
  dots.forEach(coord => {
    if (coord[0] > maxCoord[0]) maxCoord[0] = coord[0]
    if (coord[1] > maxCoord[1]) maxCoord[1] = coord[1]
  })

  let state = [...dots]

  folds.forEach(line => {
    const axis = line.charAt(11) === 'x' ? 0 : 1
    const value = Number(line.slice(13))
    assert(maxCoord[axis] >= value)

    maxCoord[axis] = value

    const updatedState = []
    state.forEach(coord => {
      const transformed = [...coord]
      if (coord[0] > maxCoord[0]) {
        transformed[0] = maxCoord[0] - (coord[0] - maxCoord[0])
      }
      if (coord[1] > maxCoord[1]) {
        transformed[1] = maxCoord[1] - (coord[1] - maxCoord[1])
      }
      updatedState.push(transformed)
    })
    state = updatedState
  })

  const dim = [maxCoord[0] + 1, maxCoord[1] + 1]
  const reduced = new Uint8Array(dim[0] * dim[1])
  state.forEach(coord => {
    reduced[coord[0] + coord[1] * dim[0]] = 1
  })

  return [reduced, dim]
}

const test = load('day13', __dirname)
const parts = test.split('\n\n')
const dots = parts[0].split('\n').map(line => line.split(',').map(Number))
const folds = parts[1].split('\n')

console.log(countDots(dots, folds.slice(0, 1)))
printFolded(dots, folds)
