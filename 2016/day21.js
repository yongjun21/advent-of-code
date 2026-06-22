const load = require('../loader')

function scramble (input, original, reverse) {
  original = original.split('')

  const mapReverseIndex = (function (n) {
    const mapping = {}
    for (let i = 0; i < n; i++) {
      const j = (i + 1 + i + (i >= 4 ? 1 : 0)) % n
      mapping[j] = i
    }
    return mapping
  })(original.length)

  const instructions = input.trim().split('\n')
  if (reverse) instructions.reverse()

  instructions.forEach(line => {
    let match, a, b, i, j, n

    match = line.match(/^swap position ([0-9]+) with position ([0-9]+)$/)
    if (match) {
      i = +match[1]
      j = +match[2]
      a = original[i]
      b = original[j]
      original[i] = b
      original[j] = a
      return
    }

    match = line.match(/^swap letter ([a-z]) with letter ([a-z])$/)
    if (match) {
      a = match[1]
      b = match[2]
      i = original.indexOf(a)
      j = original.indexOf(b)
      original[i] = b
      original[j] = a
      return
    }

    match = line.match(/^rotate (left|right) ([0-9]+) steps?$/)
    if (match) {
      n = match[1] === 'right' ? +match[2] : -+match[2]
      if (reverse) n *= -1
      original = original.slice(-n).concat(original.slice(0, -n))
      return
    }

    match = line.match(/^rotate based on position of letter ([a-z])$/)
    if (match) {
      a = match[1]
      i = original.indexOf(a)
      if (reverse) i = mapReverseIndex[i]
      n = (1 + i + (i >= 4 ? 1 : 0)) % original.length
      if (reverse) n *= -1
      original = original.slice(-n).concat(original.slice(0, -n))
      return
    }

    match = line.match(/^reverse positions ([0-9]+) through ([0-9]+)$/)
    if (match) {
      i = +match[1]
      j = +match[2]
      original = [].concat(
        original.slice(0, i),
        original.slice(i, j + 1).reverse(),
        original.slice(j + 1)
      )
      return
    }

    match = line.match(/^move position ([0-9]+) to position ([0-9]+)$/)
    if (match) {
      i = reverse ? +match[2] : +match[1]
      j = reverse ? +match[1] : +match[2]
      a = original[i]
      original.splice(i, 1)
      original.splice(j, 0, a)
      return
    }
  })

  return original.join('')
}

const test = load('day21', __dirname)

console.log(scramble(test, 'abcdefgh'))
console.log(scramble(test, 'fbgdceah', true))
