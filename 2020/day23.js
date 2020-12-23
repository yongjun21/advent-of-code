function simple (input) {
  const state = play(input, 100)
  let output = ''
  let curr = state[1]
  while (curr !== 1) {
    output += curr
    curr = state[curr]
  }
  return output
}

function complex (input) {
  const state = play(input, 10000000, 1000000)
  return state[1] * state[state[1]]
}

function play (input, moves, n = input.length) {
  const state = new Int32Array(n + 1)
  input.forEach((v, i) => {
    if (i === input.length - 1) return
    state[v] = input[i + 1]
  })
  let curr = input[input.length - 1]
  for (let i = input.length + 1; i <= n; i++) {
    state[curr] = i
    curr = i
  }
  state[curr] = input[0]

  curr = input[0]
  while (moves-- > 0) {
    let next = state[curr]
    const pickup = []
    for (let i = 0; i < 3; i++) {
      pickup.push(next)
      next = state[next]
    }
    let target = curr === 1 ? n : curr - 1
    while (pickup.indexOf(target) >= 0) {
      target = target === 1 ? n : target - 1
    }
    state[curr] = next
    state[pickup[2]] = state[target]
    state[target] = pickup[0]
    curr = next
  }
  return state
}

const test = '156794823'.split('').map(Number)

console.log(simple(test))
console.log(complex(test))
