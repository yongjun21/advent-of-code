const load = require('../loader')

function parseRow (line) {
  const substr = line.split(' -> ')
  const match = substr[0].match(/^([a-z]+) \(([0-9]+)\)/)
  const children = substr[1] && substr[1].split(', ') || []
  return {
    label: match[1],
    weight: +match[2],
    children
  }
}

function constructDepencies (input) {
  const programs = input.trim().split('\n').map(line => parseRow(line.trim()))
  const dependencies = {}
  programs.forEach(row => {
    dependencies[row.label] = row
  })
  programs.forEach(row => {
    row.children.forEach(child => {
      dependencies[child].parent = row.label
    })
  })
  return dependencies
}

function findRoot (input) {
  const dependencies = constructDepencies(input)
  return Object.keys(dependencies).filter(key => !dependencies[key].parent)[0]
}

function findUnbalanced (input) {
  const dependencies = constructDepencies(input)

  function getStackedWeight (target) {
    if (target.stackedWeight) return target.stackedWeight
    target.stackedWeight = target.weight +
      target.children.reduce((sum, child) => sum + getStackedWeight(dependencies[child]), 0)
    return target.stackedWeight
  }

  Object.keys(dependencies).forEach(key => {
    getStackedWeight(dependencies[key])
  })

  return Object.keys(dependencies).filter(key => {
    if (dependencies[key].children.length === 0) return false
    const unbalancedWeights = {}
    dependencies[key].children.forEach(child => {
      const childWeight = dependencies[child].stackedWeight
      unbalancedWeights[childWeight] = unbalancedWeights[childWeight] || 0
      unbalancedWeights[childWeight]++
    })
    if (Object.keys(unbalancedWeights).length > 1) {
      dependencies[key].unbalancedWeights = unbalancedWeights
      return true
    }
    return false
  }).map(key => dependencies[key])
}

const test = load('day7', __dirname)

console.log(findRoot(test))
console.log(findUnbalanced(test))
