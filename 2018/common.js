exports.operations = {
  addr (input, a, b, c) {
    const output = [...input]
    output[c] = input[a] + input[b]
    return output
  },
  addi (input, a, b, c) {
    const output = [...input]
    output[c] = input[a] + b
    return output
  },
  mulr (input, a, b, c) {
    const output = [...input]
    output[c] = input[a] * input[b]
    return output
  },
  muli (input, a, b, c) {
    const output = [...input]
    output[c] = input[a] * b
    return output
  },
  banr (input, a, b, c) {
    const output = [...input]
    output[c] = input[a] & input[b]
    return output
  },
  bani (input, a, b, c) {
    const output = [...input]
    output[c] = input[a] & b
    return output
  },
  borr (input, a, b, c) {
    const output = [...input]
    output[c] = input[a] | input[b]
    return output
  },
  bori (input, a, b, c) {
    const output = [...input]
    output[c] = input[a] | b
    return output
  },
  setr (input, a, b, c) {
    const output = [...input]
    output[c] = input[a]
    return output
  },
  seti (input, a, b, c) {
    const output = [...input]
    output[c] = a
    return output
  },
  gtir (input, a, b, c) {
    const output = [...input]
    output[c] = a > input[b] ? 1 : 0
    return output
  },
  gtri (input, a, b, c) {
    const output = [...input]
    output[c] = input[a] > b ? 1 : 0
    return output
  },
  gtrr (input, a, b, c) {
    const output = [...input]
    output[c] = input[a] > input[b] ? 1 : 0
    return output
  },
  eqir (input, a, b, c) {
    const output = [...input]
    output[c] = a === input[b] ? 1 : 0
    return output
  },
  eqri (input, a, b, c) {
    const output = [...input]
    output[c] = input[a] === b ? 1 : 0
    return output
  },
  eqrr (input, a, b, c) {
    const output = [...input]
    output[c] = input[a] === input[b] ? 1 : 0
    return output
  }
}
