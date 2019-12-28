const { getDigits } = require('./common')

function shuffle (input, card, deck, repeat = 1) {
  const { beta0, beta1 } = analyzeShuffle(input, deck)
  const params = reapply(beta0, beta1, repeat, deck)
  return add(mul(params.beta1, card, deck), params.beta0, deck)
}

function analyzeShuffle (input, base) {
  let beta0 = 0
  let beta1 = 1
  input.forEach(step => {
    if (step.type === 'rotate') {
      beta0 = add(beta0, -step.value, base)
    } else if (step.type === 'spread') {
      beta0 = mul(beta0, step.value, base)
      beta1 = mul(beta1, step.value, base)
    } else if (step.type === 'reverse') {
      beta0 = mul(beta0, -1, base)
      beta1 = mul(beta1, -1, base)
      beta0 = add(beta0, -1, base)
    }
  })
  return { beta0, beta1 }
}

function add (a, b, base) {
  let sum = a + b
  if (sum < 0) sum += base
  if (sum >= base) sum -= base
  return sum
}

function mul (a, b, base) {
  const binary = getDigits(Math.abs(b), 2)
  const components = [a]
  while (components.length < binary.length) {
    const prev = components[components.length - 1]
    const next = add(prev, prev, base)
    components.push(next)
  }
  let sum = 0
  components.forEach((v, i) => {
    if (binary[i] === 1) {
      sum = add(sum, v, base)
    }
  })
  return b >= 0 ? sum : base - sum
}

function reapply (b0, b1, n, base) {
  const binary = getDigits(Math.abs(n), 2)
  const components = [[b0, b1]]
  while (components.length < binary.length) {
    const prev = components[components.length - 1]
    const next = [
      add(mul(prev[1], prev[0], base), prev[0], base),
      mul(prev[1], prev[1], base)
    ]
    components.push(next)
  }
  let beta0 = 0
  let beta1 = 1
  components.forEach((v, i) => {
    if (binary[i] === 1) {
      beta0 = add(mul(v[1], beta0, base), v[0], base)
      beta1 = mul(v[1], beta1, base)
    }
  })
  return n >= 0 ? { beta0, beta1 } : unapply(beta0, beta1, base)
}

function unapply (b0, b1, base) {
  let r0 = base
  let r1 = b1
  let t0 = 0
  let t1 = 1
  while (r1 > 0) {
    const q1 = Math.floor(r0 / r1)
    ;[r0, r1] = [r1, r0 - q1 * r1]
    ;[t0, t1] = [t1, t0 - q1 * t1]
  }
  const inv = t0 < 0 ? t0 + base : t0
  return {
    beta0: base - mul(inv, b0, base),
    beta1: inv
  }
}

function parse (line) {
  if (line === 'deal into new stack') return { type: 'reverse' }
  const splitted = line.split(' ')
  const value = +splitted[splitted.length - 1]
  return {
    type: splitted[0] === 'cut' ? 'rotate' : 'spread',
    value
  }
}

const test = `
cut -8737
deal with increment 36
deal into new stack
deal with increment 32
cut -3856
deal with increment 27
deal into new stack
cut 8319
deal with increment 15
deal into new stack
deal with increment 53
cut 2157
deal with increment 3
deal into new stack
cut 9112
deal with increment 59
cut 957
deal with increment 28
cut -9423
deal with increment 51
deal into new stack
deal with increment 8
cut 3168
deal with increment 16
cut 6558
deal with increment 32
deal into new stack
cut -8246
deal with increment 40
cut 4405
deal with increment 9
cut -2225
deal with increment 36
cut -5080
deal with increment 59
cut -648
deal with increment 64
cut -1845
deal into new stack
cut -7726
deal with increment 44
cut 1015
deal with increment 12
cut 960
deal with increment 30
deal into new stack
deal with increment 65
deal into new stack
deal with increment 27
cut 6877
deal with increment 5
deal into new stack
cut -3436
deal with increment 63
deal into new stack
deal with increment 71
deal into new stack
deal with increment 7
cut -9203
deal with increment 38
cut 9008
deal with increment 59
deal into new stack
deal with increment 13
cut 5979
deal with increment 55
cut 9483
deal with increment 65
cut -9250
deal with increment 75
deal into new stack
cut -1830
deal with increment 55
deal into new stack
deal with increment 67
cut -8044
deal into new stack
cut 8271
deal with increment 51
cut 6002
deal into new stack
deal with increment 47
cut 3638
deal with increment 18
cut -785
deal with increment 63
cut -2460
deal with increment 25
cut 5339
deal with increment 61
cut -5777
deal with increment 54
deal into new stack
cut 8075
deal into new stack
deal with increment 22
cut 3443
deal with increment 34
cut 5193
deal with increment 3
`.trim().split('\n').map(parse)

console.log(shuffle(test, 2019, 10007))
console.log(shuffle(test, 2020, 119315717514047, -101741582076661))
