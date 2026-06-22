const load = require('../loader')

function findNice (input, criteria) {
  return input.trim().split('\n').filter(str => {
    return criteria.every(rule => rule(str))
  }).length
}

const criteriaSetOne = [
  str => {
    const vowels = str.match(/[aeiou]/g)
    return vowels && vowels.length >= 3
  },
  str => str.match(/(.)\1{1,}/),
  str => !str.match(/ab|cd|pq|xy/)
]

const criteriaSetTwo = [
  str => str.match(/(..).*\1{1}/),
  str => str.match(/(.).\1{1}/)
]

const test = load('day5', __dirname)

console.log(findNice(test, criteriaSetOne))
console.log(findNice(test, criteriaSetTwo))
