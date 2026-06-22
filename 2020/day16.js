const load = require('../loader')

function getErrorRate (input, rules) {
  return input.reduce((sum, row) => {
    return sum + row.reduce((sum, v) => {
      const invalid = rules.every(rule =>
        rule.conditions.every(cond =>
          v < cond.min || v > cond.max))
      return sum + (invalid ? v : 0)
    }, 0)
  }, 0)
}

function identifyFields (own, nearby, rules) {
  const retained = nearby.filter(row =>
    row.every(v =>
      rules.some(rule =>
        rule.conditions.some(cond =>
          v >= cond.min && v <= cond.max))))
  const valid = own.map((v, i) => {
    const filtered = rules.filter(rule =>
      retained.every(row =>
        rule.conditions.some(cond =>
          row[i] >= cond.min && row[i] <= cond.max)))
    return filtered.reduce((set, rule) => set.add(rule.field), new Set())
  })
  const assigned = []
  let changed = true
  while (changed) {
    changed = false
    valid.forEach((fields, i) => {
      if (fields.size === 1) {
        const field = [...fields].pop()
        assigned[i] = field
        valid.forEach(fields => fields.delete(field))
        changed = true
      }
    })
  }
  return assigned.reduce((product, field, i) => product * (field.startsWith('departure') ? own[i] : 1), 1)
}

function parse (line) {
  const [key, value] = line.split(': ')
  const conditions = value.split(' or ').map(range => {
    const [min, max] = range.split('-').map(Number)
    return { min, max }
  })
  return { field: key, conditions }
}

const test = load('day16', __dirname)
const parts = test.split('\n\n')
const rules = parts[0].split('\n').map(parse)
const own = parts[1].split(',').map(Number)
const nearby = parts[2].split('\n').map(line => line.split(',').map(Number))

console.log(getErrorRate(nearby, rules))
console.log(identifyFields(own, nearby, rules))
