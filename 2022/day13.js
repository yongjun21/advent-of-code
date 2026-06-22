const load = require('../loader')

function findCorrectPair (input) {
  let sum = 0
  for (const [left, right, index] of parse(input)) {
    if (compare(left, right) < 0) sum += index
  }
  return sum
}

function findDecoderKey (input) {
  const DIVIDER_PACKETS = [[[2]], [[6]]]
  const packets = []
  for (const [left, right] of parse(input)) {
    packets.push(left, right)
  }
  packets.push(...DIVIDER_PACKETS)
  packets.sort(compare)
  const dividerIndex = DIVIDER_PACKETS.map(packet => packets.indexOf(packet) + 1)
  return dividerIndex.reduce((product, index) => product * index, 1)
}

function compare (left, right) {
  if (typeof left === 'number' && typeof right === 'number') return left - right
  if (typeof left === 'number') left = [left]
  if (typeof right === 'number') right = [right]
  const n = Math.min(left.length, right.length)
  for (let i = 0; i < n; i++) {
    const compared = compare(left[i], right[i])
    if (compared) return compared
  }
  return left.length - right.length
}

function * parse (input) {
  let index = 1
  for (let i = 0; i < input.length; i += 3) {
    const left = JSON.parse(input[i])
    const right = JSON.parse(input[i + 1])
    yield [left, right, index++]
  }
}

const test = load('day13', __dirname).trim().split('\n')

console.log(findCorrectPair(test))
console.log(findDecoderKey(test))
