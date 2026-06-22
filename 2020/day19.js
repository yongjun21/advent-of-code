const load = require('../loader')

function countMatchRules (input, rules, overwrites = []) {
  rules = parseRules(rules, overwrites)
  return input.filter(message =>
    matchRule(message, 0, rules).some(index => index === message.length)).length
}

function matchRule (message, rule, rules, index = 0) {
  const matched = new Set()
  rules.get(rule).forEach(subrules => {
    let prev = new Set([index])
    subrules.forEach(v => {
      const next = new Set()
      if (typeof v === 'string') {
        prev.forEach(index => {
          if (message.startsWith(v, index)) next.add(index + v.length)
        })
      } else {
        prev.forEach(index => {
          matchRule(message, v, rules, index).forEach(index => next.add(index))
        })
      }
      prev = next
    })
    for (const index of prev) matched.add(index)
  })
  return [...matched]
}

function parseRules (input, overwrites = []) {
  const output = new Map()
  input.forEach(line => {
    overwrites.forEach(([original, replacement]) => {
      if (line === original) line = replacement
    })
    let [key, value] = line.trim().split(': ')
    value = value.split(' | ').map(subrules => {
      return subrules.split(' ')
        .map(v => v.startsWith('"') ? v.slice(1, -1) : +v)
    })
    output.set(+key, value)
  })
  return output
}

const [rulesInput, testInput] = load('day19', __dirname).trim().split('\n\n')
const rules = rulesInput.split('\n')
const test = testInput.split('\n')

const overwrites = [
  ['8: 42', '8: 42 | 42 8'],
  ['11: 42 31', '11: 42 31 | 42 11 31']
]

console.log(countMatchRules(test, rules))
console.log(countMatchRules(test, rules, overwrites))
