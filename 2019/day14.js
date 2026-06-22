const load = require('../loader')

function findMinOre (dependencies, units = 1) {
  const required = { FUEL: units }

  const callstack = []
  callstack.push('ORE')

  while (callstack.length > 0) {
    const id = callstack.pop()
    const dependents = dependencies[id]
    if (dependents.every(depedent => depedent.output in required)) {
      required[id] = dependents.reduce((sum, depedent) => {
        return sum + Math.ceil(required[depedent.output] / depedent.out) * depedent.in
      }, 0)
    } else {
      callstack.push(id)
      dependents.forEach(dependent => {
        if (!(dependent.output in required)) callstack.push(dependent.output)
      })
    }
  }

  return required.ORE
}

function findMaxFuel (dependencies, units = 1000000000000) {
  if (findMinOre(dependencies, 1) > units) return 0
  let p = 0
  let n = Math.pow(2, p)
  while (findMinOre(dependencies, n * 2) <= units) {
    p++
    n = n * 2
  }

  while (p-- > 0) {
    if (findMinOre(dependencies, n + Math.pow(2, p)) <= units) {
      n += Math.pow(2, p)
    }
  }

  return n
}

function getDependencies (reactions) {
  const dependencies = {}
  reactions.forEach(reaction => {
    reaction.inputs.forEach(input => {
      dependencies[input.id] = dependencies[input.id] || []
      dependencies[input.id].push({
        output: reaction.output.id,
        in: input.units,
        out: reaction.output.units
      })
    })
  })
  return dependencies
}

const test = load('day14', __dirname).trim().split('\n').map(parse)

function parse (line) {
  const [inStr, outStr] = line.split(' => ')
  const [units, id] = outStr.split(' ')
  const output = { id, units: +units }
  const inputs = inStr.split(', ').map(str => {
    const [units, id] = str.split(' ')
    return { id, units: +units }
  })
  return { inputs, output }
}

const dependencies = getDependencies(test)
console.log(findMinOre(dependencies))
console.log(findMaxFuel(dependencies))
