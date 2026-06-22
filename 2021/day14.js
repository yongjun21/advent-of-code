const load = require('../loader')

function diffMostLeastCommon (seed, rules, steps = 10) {
  let tally = Object.create(null)
  for (let i = 1; i < seed.length; i++) {
    const key = seed.slice(i - 1, i + 1)
    tally[key] = tally[key] || 0
    tally[key]++
  }

  while (steps-- > 0) {
    const updated = Object.create(null)
    Object.keys(tally).forEach(key => {
      let matched = false
      for (const rule of rules) {
        if (key.charAt(0) === rule[0] && key.charAt(1) === rule[1]) {
          const keyA = rule[0] + rule[2]
          const keyB = rule[2] + rule[1]
          updated[keyA] = updated[keyA] || 0
          updated[keyB] = updated[keyB] || 0
          updated[keyA] += tally[key]
          updated[keyB] += tally[key]
          matched = true
          break
        }
      }
      if (!matched) {
        updated[key] = updated[key] || 0
        updated[key] += tally[key]
      }
    })
    tally = updated
  }

  const count = Object.create(null)
  Object.keys(tally).forEach(key => {
    const el = key.charAt(1)
    count[el] = count[el] || 0
    count[el] += tally[key]
  })
  count[seed.charAt(0)] = count[seed.charAt(0)] || 0
  count[seed.charAt(0)]++
  const sorted = Object.values(count).sort((a, b) => a - b)
  return sorted[sorted.length - 1] - sorted[0]
}

const test = load('day14', __dirname)
const parts = test.split('\n\n')
const seed = parts[0]
const rules = parts[1].split('\n').map(line => [line[0], line[1], line[6]])

console.log(diffMostLeastCommon(seed, rules))
console.log(diffMostLeastCommon(seed, rules, 40))
