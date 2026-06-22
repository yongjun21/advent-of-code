const load = require('../loader')

const SNAFU_SYMBOLS = ['=', '-', '0', '1', '2']

function sumSnafu (input) {
  const sum = input.reduce((sum, snafu) => sum + decode(snafu), 0)
  return encode(sum)
}

function decode (snafu) {
  let base = 1
  let num = 0
  for (let i = snafu.length - 1; i >= 0; i--) {
    const value = SNAFU_SYMBOLS.indexOf(snafu[i]) - 2
    num += base * value
    base *= 5
  }
  return num
}

function encode (num) {
  let snafu = ''
  while (num > 0) {
    num += 2
    const index = num % 5
    snafu = SNAFU_SYMBOLS[index] + snafu
    num = Math.floor(num / 5)
  }
  return snafu
}

const test = load('day25', __dirname).trim().split('\n')

console.log(sumSnafu(test))
