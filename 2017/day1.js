const load = require('../loader')

function captcha (str, offset = 1) {
  let sum = 0
  const tokenized = str.split('').map(v => +v)
  const extended = tokenized.concat(tokenized)
  for (let i = 0; i < tokenized.length; i++) {
    if (tokenized[i] === extended[i + offset]) sum += tokenized[i]
  }
  return sum
}

const test = load('day1', __dirname)

console.log(captcha(test))
console.log(captcha(test, test.length / 2))
