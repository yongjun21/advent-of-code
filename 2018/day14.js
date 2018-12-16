function next10score (input) {
  const scoreboard = [3, 7]
  let first = 0
  let second = 1
  while (scoreboard.length < input + 10) {
    const firstScore = scoreboard[first]
    const secondScore = scoreboard[second]
    const sum = firstScore + secondScore
    if (sum >= 10) scoreboard.push(1, sum - 10)
    else scoreboard.push(sum)
    first = (first + firstScore + 1) % scoreboard.length
    second = (second + secondScore + 1) % scoreboard.length
  }

  return scoreboard.slice(input, input + 10).join('')
}

function recipesToTheLeft (input) {
  input = input.toString().split('').map(v => +v)
  let matchUpTo = 0
  const scoreboard = [3, 7]
  scoreboard.push = push
  let first = 0
  let second = 1
  while (true) {
    const firstScore = scoreboard[first]
    const secondScore = scoreboard[second]
    const sum = firstScore + secondScore
    if (sum >= 10) {
      if (scoreboard.push(1)) break
      if (scoreboard.push(sum - 10)) break
    } else {
      if (scoreboard.push(sum)) break
    }
    first = (first + firstScore + 1) % scoreboard.length
    second = (second + secondScore + 1) % scoreboard.length
  }

  function push (digit) {
    Array.prototype.push.call(this, digit)
    if (input[matchUpTo] === digit) {
      matchUpTo++
      if (matchUpTo === input.length) return true
    } else {
      matchUpTo = 0
    }
  }

  return scoreboard.length - input.length
}

const test = 880751

console.log(next10score(test))
console.log(recipesToTheLeft(test))
