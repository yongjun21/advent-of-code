const load = require('../loader')

const ADJACENTS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]

function simulate (input, visibility = 1, limits = [0, 4]) {
  const rows = input.length
  const cols = input[0].length

  let changed = true

  let state = new Int8Array((rows + 2) * (cols + 2))
  for (let i = 0; i < rows; i++) {
    state[(i + 1) * (cols + 2)] = 9
    state[(i + 2) * (cols + 2) - 1] = 9
    for (let j = 0; j < cols; j++) {
      const target = (i + 1) * (cols + 2) + (j + 1)
      if (input[i][j] === 'L') state[target] = -1
    }
  }
  for (let j = -1; j < cols + 1; j++) {
    state[j + 1] = 9
    state[(rows + 2) * (cols + 2) - 1 - (j + 1)] = 9
  }

  function run (prev) {
    const next = new Int8Array(prev.length)
    for (let j = -1; j < cols + 1; j++) {
      next[j + 1] = 9
      next[(rows + 2) * (cols + 2) - 1 - (j + 1)] = 9
    }
    let changed = false
    for (let i = 0; i < rows; i++) {
      next[(i + 1) * (cols + 2)] = 9
      next[(i + 2) * (cols + 2) - 1] = 9
      for (let j = 0; j < cols; j++) {
        const target = (i + 1) * (cols + 2) + (j + 1)
        if (prev[target] === 0) continue
        let occupied = 0
        ADJACENTS.forEach(offset => {
          let k = 1
          while (k <= visibility) {
            const adj = (i + 1 + k * offset[0]) * (cols + 2) + (j + 1 + k * offset[1])
            if (prev[adj] === 0) k++
            else {
              if (prev[adj] === 1) occupied++
              break
            }
          }
        })
        if (prev[target] === -1 && occupied <= limits[0]) {
          next[target] = 1
          changed = true
        } else if (prev[target] === 1 && occupied >= limits[1]) {
          next[target] = -1
          changed = true
        } else {
          next[target] = prev[target]
        }
      }
    }
    return [next, changed]
  }

  // print(state, rows, cols)

  while (changed) {
    [state, changed] = run(state)
    // print(state, rows, cols)
  }

  return state.reduce((count, v) => count + (v === 1), 0)
}

function print (state, rows, cols) {
  for (let i = 0; i < rows; i++) {
    let line = ''
    for (let j = 0; j < cols; j++) {
      const target = (i + 1) * (cols + 2) + (j + 1)
      if (state[target] === -1) line += 'L'
      if (state[target] === 0) line += '.'
      if (state[target] === 1) line += '#'
    }
    console.log(line)
  }
  console.log('')
}

const test = load('day11', __dirname).trim().split('\n').map(line => line.split(''))

const test2 = `
L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL
`.trim().split('\n').map(line => line.split(''))

console.log(simulate(test))
console.log(simulate(test, Infinity, [0, 5]))
