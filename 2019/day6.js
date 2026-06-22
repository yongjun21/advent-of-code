const load = require('../loader')

function constructRelations (input) {
  const relations = {}
  input.forEach(row => {
    const [value, key] = row
    relations[key] = value
  })
  return relations
}

function getOrbitCount (relations) {
  let n = 0
  Object.keys(relations).forEach(o => {
    let next = o
    while (next in relations) {
      n++
      next = relations[next]
    }
  })
  return n
}

function getMinOrbitalTransfers (relations, o1, o2) {
  const o1ToR = []
  const o2ToR = []
  let next = o1
  while (next in relations) {
    next = relations[next]
    o1ToR.push(next)
  }
  next = o2
  while (next in relations) {
    next = relations[next]
    o2ToR.push(next)
  }
  o1ToR.reverse()
  o2ToR.reverse()
  let n = 0
  while (o1ToR[n] === o2ToR[n]) n++
  return o1ToR.length - n + o2ToR.length - n
}

const test = load('day6', __dirname).trim().split('\n').map(line => line.split(')'))

const relations = constructRelations(test)
console.log(getOrbitCount(relations))
console.log(getMinOrbitalTransfers(relations, 'YOU', 'SAN'))
