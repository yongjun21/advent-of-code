const load = require('../loader')

const {getAssignments} = require('../helpers')

function findFittingCombi (input, total) {
  const combinations = getAssignments(input.length)

  return combinations.filter(combi =>
    combi.reduce((sum, weight, i) => sum + weight * input[i], 0) === total)
}

function findMinimunContainers (input, total) {
  const fittingCombinations = findFittingCombi(input, total)
  const containers = fittingCombinations.map(combi => {
    return combi.reduce((sum, weight) => sum + weight, 0)
  })
  const minimum = containers.reduce((min, n) => n < min ? n : min, Infinity)
  return fittingCombinations.filter((combi, i) => containers[i] === minimum)
}

const test = load('day17', __dirname).split('\n').map(Number)

console.log(findFittingCombi(test, 150).length)
console.log(findMinimunContainers(test, 150).length)
