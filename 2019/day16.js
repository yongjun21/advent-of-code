const load = require('../loader')

function fft (input, phases = 100) {
  let output = [...input]
  while (phases-- > 0) {
    output = output.map((_, i) => {
      const pattern = patternGenerator(i + 1)
      pattern.next()
      const sum = output.reduce((sum, v) => sum + v * pattern.next().value, 0)
      return Math.abs(sum) % 10
    })
  }
  return output.slice(0, 8).join('')
}

function fft2 (input, phases = 100) {
  const offset = +input.slice(0, 7).join('')
  const working = Array(phases + 1).fill(input[input.length - 1])
  const message = []
  for (let i = input.length * 10000 - 2; i >= offset; i--) {
    working[0] = input[i % input.length]
    for (let j = 1; j < working.length; j++) {
      working[j] = (working[j - 1] + working[j]) % 10
    }
    if (i - offset < 8) message.unshift(working[working.length - 1])
  }
  return message.join('')
}

function * patternGenerator (n) {
  const base = [0, 1, 0, -1]
  let i = 0
  while (true) {
    for (let j = 0; j < n; j++) {
      yield base[i]
    }
    i++
    if (i === base.length) i = 0
  }
}

const test = load('day16', __dirname).split('').map(Number)

console.log(fft(test))
console.log(fft2(test))
