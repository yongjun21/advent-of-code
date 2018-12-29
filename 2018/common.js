exports.operations = {
  addr (input, a, b, c) {
    input[c] = input[a] + input[b]
    return input
  },
  addi (input, a, b, c) {
    input[c] = input[a] + b
    return input
  },
  mulr (input, a, b, c) {
    input[c] = input[a] * input[b]
    return input
  },
  muli (input, a, b, c) {
    input[c] = input[a] * b
    return input
  },
  banr (input, a, b, c) {
    input[c] = input[a] & input[b]
    return input
  },
  bani (input, a, b, c) {
    input[c] = input[a] & b
    return input
  },
  borr (input, a, b, c) {
    input[c] = input[a] | input[b]
    return input
  },
  bori (input, a, b, c) {
    input[c] = input[a] | b
    return input
  },
  setr (input, a, b, c) {
    input[c] = input[a]
    return input
  },
  seti (input, a, b, c) {
    input[c] = a
    return input
  },
  gtir (input, a, b, c) {
    input[c] = a > input[b] ? 1 : 0
    return input
  },
  gtri (input, a, b, c) {
    input[c] = input[a] > b ? 1 : 0
    return input
  },
  gtrr (input, a, b, c) {
    input[c] = input[a] > input[b] ? 1 : 0
    return input
  },
  eqir (input, a, b, c) {
    input[c] = a === input[b] ? 1 : 0
    return input
  },
  eqri (input, a, b, c) {
    input[c] = input[a] === b ? 1 : 0
    return input
  },
  eqrr (input, a, b, c) {
    input[c] = input[a] === input[b] ? 1 : 0
    return input
  }
}
