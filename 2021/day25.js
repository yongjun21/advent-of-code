const load = require('../loader')

function waitNoMove (input) {
  const [state, n, m] = getSeaFloorMap(input)
  let t = 0
  let prevState = state
  while (true) {
    t++
    let changes = 0
    const nextStateA = new Uint8Array(n * m)
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < m; i++) {
        if (prevState[j * m + i] === 0) continue
        if (prevState[j * m + i] === 2) {
          nextStateA[j * m + i] = 2
          continue
        }
        const ii = (i + 1 >= m) ? 0 : i + 1
        if (prevState[j * m + ii] === 0) {
          nextStateA[j * m + ii] = 1
          changes++
        } else {
          nextStateA[j * m + i] = 1
        }
      }
    }
    const nextStateB = new Uint8Array(n * m)
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < m; i++) {
        if (nextStateA[j * m + i] === 0) continue
        if (nextStateA[j * m + i] === 1) {
          nextStateB[j * m + i] = 1
          continue
        }
        const jj = (j + 1 >= n) ? 0 : j + 1
        if (nextStateA[jj * m + i] === 0) {
          nextStateB[jj * m + i] = 2
          changes++
        } else {
          nextStateB[j * m + i] = 2
        }
      }
    }
    prevState = nextStateB
    if (changes === 0) return t
  }
}

function getSeaFloorMap (input) {
  const n = input.length
  const m = input[0].length
  const seaFloorMap = new Uint8Array(n * m)
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < m; i++) {
      seaFloorMap[j * m + i] =
        input[j][i] === '>' ? 1 : input[j][i] === 'v' ? 2 : 0
    }
  }
  return [seaFloorMap, n, m]
}

const test = load('day25', __dirname).trim()  .split('\n')

console.log(waitNoMove(test))
