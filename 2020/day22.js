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

const playerOne = [41, 48, 12, 6, 1, 25, 47, 43, 4, 35, 10, 13, 23, 39, 22, 28, 44, 42, 32, 31, 24, 50, 34, 29, 14]
const playerTwo = [36, 49, 11, 16, 20, 17, 26, 30, 18, 5, 2, 38, 7, 27, 21, 9, 19, 15, 8, 45, 37, 40, 33, 46, 3]

console.log(getScore(combat([...playerOne], [...playerTwo]).deck))
console.log(getScore(recursiveCombat([...playerOne], [...playerTwo]).deck))
