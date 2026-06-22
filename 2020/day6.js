const load = require('../loader')

const { parseBatch } = require('./common')

function sumSome (input) {
  const parsed = parseBatch(input, (line, datum) => {
    for (const key of line) {
      datum[key] = datum[key] || 0
      datum[key]++
    }
  })
  return parsed.reduce((sum, group) => sum + Object.keys(group).length, 0)
}

function sumEvery (input) {
  const parsed = parseBatch(input, (line, datum) => {
    datum.members++
    for (const key of line) {
      datum[key] = datum[key] || 0
      datum[key]++
    }
  }, () => ({ members: 0 }))
  return parsed.reduce((sum, group) => {
    return sum + Object.keys(group).filter(key => key !== 'members' && group[key] === group.members).length
  }, 0)
}

const test = load('day6', __dirname)

console.log(sumSome(test))
console.log(sumEvery(test))
