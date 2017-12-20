const fs = require('fs')

function followRoute (input) {
  const diagram = input.split('\n').map(line => line.split(''))
  const start = [diagram[0].indexOf('|'), 0]

  let current = [...start]
  let next = [0, 1]
  let steps = 1

  const letters = []

  while (true) {
    steps++
    current = [current[0] + next[0], current[1] + next[1]]
    const spot = diagram[current[1]][current[0]]
    if (spot.match(/[A-Z]/)) letters.push(spot)
    if (spot === '+') {
      if (next[1] && diagram[current[1]][current[0] - 1] === '-') next = [-1, 0]
      else if (next[1] && diagram[current[1]][current[0] + 1] === '-') next = [1, 0]
      else if (next[0] && diagram[current[1] - 1][current[0]] === '|') next = [0, -1]
      else if (next[0] && diagram[current[1] + 1][current[0]] === '|') next = [0, 1]
      else break
    }
    if (next[1] && diagram[current[1] + next[1]][current[0]] === ' ') break
    if (next[0] && diagram[current[1]][current[0] + next[0]] === ' ') break
  }

  return {letters: letters.join(''), steps}
}

const test = fs.readFileSync('2017/input/day19.txt', {encoding: 'utf8'})

console.log(followRoute(test))
