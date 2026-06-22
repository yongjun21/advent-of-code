const load = require('../loader')

function totalScore (input) {
  const cleaned = input.replace(/!./g, '')
  let stack = 0
  let garbage = false
  let garbageCount = 0
  let score = 0
  for (let char = cleaned[0], i = 0; i < input.length; char = cleaned[++i]) {
    if (garbage) {
      if (char === '>') garbage = false
      else garbageCount++
    } else {
      if (char === '<') garbage = true
      if (char === '{') stack++
      if (char === '}') {
        if (stack > 0) {
          score += stack
          stack--
        }
      }
    }
  }
  return {score, garbageCount}
}

const test = load('day9', __dirname)

console.log(totalScore(test))
