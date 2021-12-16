const ADJACENTS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0]
]

function countFlashes (input, steps = 100) {
  const [state, n, m] = getFlashState(input)
  let flashes = 0
  while (steps-- > 0) {
    flashes += step(state, n, m)
  }
  return flashes
}

function syncFlash (input) {
  const [state, n, m] = getFlashState(input)
  let steps = 0
  while (true) {
    steps++
    if (step(state, n, m) === state.length) break
  }
  return steps
}

function getFlashState (input) {
  const n = input.length
  const m = input[0].length
  const state = new Uint8Array(n * m)
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < m; i++) {
      state[j * m + i] = input[j][i]
    }
  }
  return [state, n, m]
}

function step (state, n, m) {
  let flashes = 0
  state.forEach((v, i) => {
    state[i]++
  })
  while (state.filter(v => v > 9).length > 0) {
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < m; i++) {
        if (state[j * m + i] <= 9) continue
        state[j * m + i] = 0
        ADJACENTS.forEach(offset => {
          const x = i + offset[0]
          const y = j + offset[1]
          if (x < 0 || x >= m || y < 0 || y >= n) return
          if (state[y * m + x] === 0) return
          state[y * m + x]++
        })
        flashes++
      }
    }
  }
  return flashes
}

const test = `
7313511551
3724855867
2374331571
4438213437
6511566287
6727245532
3736868662
2348138263
2417483121
8812617112
`.trim().split('\n')

console.log(countFlashes(test))
console.log(syncFlash(test))
