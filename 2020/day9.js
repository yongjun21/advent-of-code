const load = require('../loader')

function findWeakness (input) {
  for (let i = 25; i < input.length; i++) {
    if (!checksum(input[i], 2, input, i - 25, i)) return input[i]
  }
}

function breakEncrypt (input) {
  const weakness = findWeakness(input)
  let first = 0
  let last = 0
  let sum = input[0]
  while (first < input.length) {
    if (last < first) {
      last++
      sum += input[last]
    } else if (sum < weakness) {
      if (last < input.length - 1) {
        last++
        sum += input[last]
      } else {
        sum -= input[first]
        first++
      }
    } else if (sum > weakness) {
      sum -= input[first]
      first++
    } else {
      const list = input.slice(first, last + 1).sort((a, b) => a - b)
      return list[0] + list[list.length - 1]
    }
  }
}

function checksum (sum, n, input, start = 0, end = input.length) {
  if (n === 0) return sum === 0
  for (let i = start; i < end; i++) {
    const product = checksum(sum - input[i], n - 1, input, i + 1, end)
    if (product !== false) return true
  }
  return false
}

const test = load('day9', __dirname).trim().split('\n').map(Number)

console.log(findWeakness(test))
console.log(breakEncrypt(test))
