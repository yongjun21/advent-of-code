const load = require('../loader')

function countContain (input) {
  const inverted = {}
  input.forEach(row => {
    row.inner.forEach(bag => {
      inverted[bag.type] = inverted[bag.type] || []
      inverted[bag.type].push(row.outer)
    })
  })
  const contain = new Set()

  function visit (root) {
    if (!(root in inverted)) return
    inverted[root].forEach(type => {
      if (contain.has(type)) return
      contain.add(type)
      visit(type)
    })
  }

  visit('shiny gold')
  return contain.size
}

function countContained (input) {
  const tree = {}
  input.forEach(row => {
    tree[row.outer] = row.inner
  })

  function count (root) {
    return 1 + tree[root].reduce((sum, child) => sum + child.count * count(child.type), 0)
  }

  return count('shiny gold') - 1
}

function parse (line) {
  const [outer, innerRaw] = line.split(' bags contain ')
  const inner = innerRaw.split(', ')
    .filter(str => !str.startsWith('no other'))
    .map(str => {
      const matched = str.match(/^(\d+) (.+) bags?\.?$/)
      return { type: matched[2], count: +matched[1] }
    })
  return { outer, inner }
}

const test = load('day7', __dirname).trim().split('\n').map(parse)

console.log(countContain(test))
console.log(countContained(test))
