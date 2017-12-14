const md5 = require('md5')

function getOTPkey (input, stretch = 0, n = 64) {
  let index = 0
  const lookahead = 1000

  const hashes = []

  for (let i = 0; i < lookahead; i++) {
    hashes.push(getHash(input + i, stretch))
  }

  while (n > 0) {
    hashes.push(getHash(input + (lookahead + index), stretch))
    const match = hashes[index++].match(/(.)\1\1/)
    if (!match) continue
    const five = match[1].repeat(5)
    const isKey = hashes.slice(-lookahead).filter(hash => hash.indexOf(five) > -1).length === 1
    if (isKey) n--
  }

  return index - 1
}

function getHash (str, stretch) {
  let hash = md5(str)
  while (stretch-- > 0) {
    hash = md5(hash)
  }
  return hash
}

const test = 'yjdafjpo'

console.log(getOTPkey(test))
console.log(getOTPkey(test, 2016))
