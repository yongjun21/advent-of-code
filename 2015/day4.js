const md5 = require('md5')

function mineAdventCoins (hash, zeros = 5) {
  let n = 1
  while (md5(hash + n).slice(0, zeros) !== '0'.repeat(zeros)) {
    n++
  }
  return n
}

const test = 'iwrupvqb'

console.log(mineAdventCoins(test))
console.log(mineAdventCoins(test, 6))
