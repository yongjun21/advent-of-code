const load = require('../loader')

function combat (one, two) {
  while (one.length > 0 && two.length > 0) {
    const oneNext = one.shift()
    const twoNext = two.shift()
    if (oneNext > twoNext) one.push(oneNext, twoNext)
    else if (twoNext > oneNext) two.push(twoNext, oneNext)
  }
  return one.length > 0
    ? { winner: 'one', deck: one }
    : { winner: 'two', deck: two }
}

function recursiveCombat (one, two) {
  const memo = new Set()
  while (one.length > 0 && two.length > 0) {
    const state = one.join(',') + '/' + two.join(',')
    if (memo.has(state)) return { winner: 'one', deck: one }
    memo.add(state)
    const oneNext = one.shift()
    const twoNext = two.shift()
    if (one.length >= oneNext && two.length >= twoNext) {
      const { winner } = recursiveCombat(one.slice(0, oneNext), two.slice(0, twoNext))
      if (winner === 'one') one.push(oneNext, twoNext)
      else two.push(twoNext, oneNext)
    } else if (oneNext > twoNext) {
      one.push(oneNext, twoNext)
    } else if (twoNext > oneNext) {
      two.push(twoNext, oneNext)
    }
  }
  return one.length > 0
    ? { winner: 'one', deck: one }
    : { winner: 'two', deck: two }
}

function getScore (deck) {
  const n = deck.length
  return deck.reduce((sum, v, i) => sum + (n - i) * v, 0)
}

const test = load('day22', __dirname)
const parts = test.split('\n\n')
const playerOne = parts[0].split('\n').map(Number)
const playerTwo = parts[1].split('\n').map(Number)

console.log(getScore(combat([...playerOne], [...playerTwo]).deck))
console.log(getScore(recursiveCombat([...playerOne], [...playerTwo]).deck))
