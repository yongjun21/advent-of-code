function findFittingCombi (input, total) {
  const combinations = []
  const nCombinations = Math.pow(2, input.length)
  const zeroPad = '0'.repeat(input.length)
  for (let i = 0; i < nCombinations; i++) {
    const combiString = (zeroPad + i.toString(2)).slice(-input.length)
    combinations.push(combiString.split('').map(v => +v))
  }

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

const test = [33, 14, 18, 20, 45, 35, 16, 35, 1, 13, 18, 13, 50, 44, 48, 6, 24, 41, 30, 42]

console.log(findFittingCombi(test, 150).length)
console.log(findMinimunContainers(test, 150).length)
