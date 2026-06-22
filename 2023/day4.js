const load = require('../loader')

function calculatePoints(input) {
  return input.reduce((sum, card) => {
    const count = score(card)
    return count > 0 ? sum + Math.pow(2, count - 1) : sum
  }, 0)
}

function totalCards(input) {
  const total = new Uint32Array(input.length).fill(1)
  input.forEach((card, i) => {
    const count = score(card)
    for (let j = i + 1; j <= Math.min(i + count, input.length - 1); j++) {
      total[j] += total[i]
    }
  })
  return total.reduce((sum, n) => sum + n)
}

function score(card) {
  const winning = new Set(card.winning)
  return card.our.filter(number => winning.has(number)).length
}

function parse(line) {
  const [_, numbers] = line.split(':')
  const [winning, our] = numbers.split('|')
  return {
    winning: winning.trim().split(/\W+/).map(Number),
    our: our.trim().split(/\W+/).map(Number)
  }
}

const test = load('day4', __dirname).trim().split('\n').map(parse)

console.log(calculatePoints(test))
console.log(totalCards(test))
