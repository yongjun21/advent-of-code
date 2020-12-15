const assert = require('assert')

function findEarliest (input, now) {
  input = input.filter(v => v !== 'x').map(Number)
  const next = input.map(id => Math.ceil(now / id) * id - now)
  const earliest = next.reduce((min, v) => v < min ? v : min)
  const id = input[next.indexOf(earliest)]
  return id * earliest
}

function findEarliest2 (input) {
  let t = 0
  let period = 1
  input.forEach((id, offset) => {
    if (id === 'x') return
    id = +id
    assert(isPrime(id))
    while ((t + offset) % id !== 0) {
      t += period
    }
    period *= id
  })
  return t
}

function isPrime (n) {
  for (let k = 2; k < n; k++) {
    if (n % k === 0) return false
  }
  return true
}

const test = '19,x,x,x,x,x,x,x,x,x,x,x,x,37,x,x,x,x,x,599,x,29,x,x,x,x,x,x,x,x,x,x,x,x,x,x,17,x,x,x,x,x,23,x,x,x,x,x,x,x,761,x,x,x,x,x,x,x,x,x,41,x,x,13'.split(',')

console.log(findEarliest(test, 1009310))
console.log(findEarliest2(test))
