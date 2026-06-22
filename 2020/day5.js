const load = require('../loader')

function findSeat (input) {
  const seatIds = input
    .map(seat => seat.col * 8 + seat.row)
    .sort((a, b) => a - b)
  for (let i = 1; i < seatIds.length - 1; i++) {
    if (seatIds[i + 1] === seatIds[i] + 2) return seatIds[i] + 1
  }
}

function sanityCheck (input) {
  return input.reduce((max, seat) => {
    const seatId = seat.col * 8 + seat.row
    return seatId > max ? seatId : max
  }, -1)
}

function parse (line) {
  return {
    col: decode(line.slice(0, 7), 'B'),
    row: decode(line.slice(7), 'R')
  }
}

function decode (str, one) {
  const bits = str.split('').reverse()
  let sum = 0
  let base = 1
  bits.forEach(char => {
    if (char === one) sum += base
    base *= 2
  })
  return sum
}

const test = load('day5', __dirname).trim().split('\n').map(parse)

console.log(sanityCheck(test))
console.log(findSeat(test))
