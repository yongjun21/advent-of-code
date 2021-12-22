const { getAssignments } = require('../helpers')

function playPracticeGame (a, b) {
  const die = deterministicDie(100)
  const [winner, loser, rolls] = play(a, b, die) // eslint-disable-line
  return loser.score * rolls
}

function playDiracGame (a, b) {
  let movePaths = new Map()
  getAssignments(3, 3).forEach(combi => {
    const moves = combi.reduce((sum, v) => sum + v, 0) + 3
    const paths = movePaths.get(moves) || 0
    movePaths.set(moves, paths + 1)
  })
  movePaths = [...movePaths]
  let aWin = 0
  let bWin = 0
  const unvisited = []
  unvisited.push([a % 10, b % 10, 0, 0, true, 1])
  while (unvisited.length > 0) {
    const [aSpace, bSpace, aScore, bScore, aNext, paths] = unvisited.pop()
    if (aScore >= 21) {
      aWin += paths
      continue
    }
    if (bScore >= 21) {
      bWin += paths
      continue
    }
    if (aNext) {
      movePaths.forEach(([moves, newPaths]) => {
        const nextSpace = (aSpace + moves) % 10
        const nextScore = aScore + (nextSpace === 0 ? 10 : nextSpace)
        unvisited.push([
          nextSpace,
          bSpace,
          nextScore,
          bScore,
          false,
          paths * newPaths
        ])
      })
    } else {
      movePaths.forEach(([moves, newPaths]) => {
        const nextSpace = (bSpace + moves) % 10
        const nextScore = bScore + (nextSpace === 0 ? 10 : nextSpace)
        unvisited.push([
          aSpace,
          nextSpace,
          aScore,
          nextScore,
          true,
          paths * newPaths
        ])
      })
    }
  }
  return Math.max(aWin, bWin)
}

function play (a, b, die) {
  const player1 = { space: a % 10, score: 0 }
  const player2 = { space: b % 10, score: 0 }
  let currPlayer = player1
  let rolls = 0
  while (true) {
    currPlayer.space = (currPlayer.space + roll(die, 3)) % 10
    currPlayer.score += currPlayer.space === 0 ? 10 : currPlayer.space
    rolls += 3
    if (currPlayer.score >= 1000) break
    currPlayer = currPlayer === player1 ? player2 : player1
  }
  return [currPlayer, currPlayer === player1 ? player2 : player1, rolls]
}

function roll (die, times = 1) {
  let sum = 0
  while (times-- > 0) {
    sum += die.next().value
  }
  return sum
}

function * deterministicDie (side) {
  let k = 0
  while (true) {
    yield (k % side) + 1
    k++
  }
}

console.log(playPracticeGame(5, 8))
console.log(playDiracGame(5, 8))
