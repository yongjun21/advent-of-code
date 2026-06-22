const load = require('../loader')

function parenthesisMatching (str, terminating) {
  let count = 0
  for (var i = 0; i < str.length; i++) {
    if (str[i] === '(') count++
    else if (str[i] === ')') count--
    if (count === terminating) break
  }
  return {count, step: i + 1}
}

const test = load('day1', __dirname)

console.log(parenthesisMatching(test).count)
console.log(parenthesisMatching(test, -1).step)
