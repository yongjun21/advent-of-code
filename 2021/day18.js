const load = require('../loader')

const { getPermutations } = require('../helpers')

const OPEN_TOKEN = '['
const CLOSE_TOKEN = ']'

function getFinalSumMagnitude (input) {
  const result = input.reduce((res, num) => {
    return reduce([OPEN_TOKEN, ...res, ...num, CLOSE_TOKEN])
  })
  return getMagnitude(result)[0]
}

function getLargestMaginitude (input) {
  let largest = 0
  for (const [a, b] of getPermutations(input, 2)) {
    const result = reduce([OPEN_TOKEN, ...a, ...b, CLOSE_TOKEN])
    largest = Math.max(getMagnitude(result)[0], largest)
  }
  return largest
}

function reduce (raw) {
  const reduced = [...raw]
  while (true) {
    let nesting = 0
    const exploded = reduced.some((token, i) => {
      if (token === OPEN_TOKEN) {
        nesting++
        if (nesting > 4) {
          const left = reduced[i + 1]
          const right = reduced[i + 2]
          for (let j = i; j >= 0; j--) {
            if (reduced[j] !== OPEN_TOKEN && reduced[j] !== CLOSE_TOKEN) {
              reduced[j] += left
              break
            }
          }
          for (let j = i + 3; j < reduced.length; j++) {
            if (reduced[j] !== OPEN_TOKEN && reduced[j] !== CLOSE_TOKEN) {
              reduced[j] += right
              break
            }
          }
          reduced.splice(i, 4, 0)
          return true
        }
      } else if (token === CLOSE_TOKEN) {
        nesting--
      }
      return false
    })
    if (exploded) continue
    const splitted = reduced.some((token, i) => {
      if (token !== OPEN_TOKEN && token !== CLOSE_TOKEN && token >= 10) {
        const halved = token / 2
        reduced.splice(
          i,
          1,
          OPEN_TOKEN,
          Math.floor(halved),
          Math.ceil(halved),
          CLOSE_TOKEN
        )
        return true
      }
      return false
    })
    if (splitted) continue
    break
  }
  return reduced
}

function getMagnitude (num, i = 0) {
  if (num[i] !== OPEN_TOKEN) return [num[i], i + 1]
  const [left, j] = getMagnitude(num, i + 1)
  const [right, k] = getMagnitude(num, j)
  return [3 * left + 2 * right, k + 1]
}

function parse (line) {
  return line
    .replace(/,/g, '')
    .split('')
    .map(token =>
      token === OPEN_TOKEN || token === CLOSE_TOKEN ? token : Number(token)
    )
}

const test = load('day18', __dirname).trim()  .split('\n')  .map(parse)

console.log(getFinalSumMagnitude(test))
console.log(getLargestMaginitude(test))
