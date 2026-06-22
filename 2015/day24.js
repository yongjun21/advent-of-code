const load = require('../loader')

const {getAssignments, getCombinations} = require('../lazyHelpers')

function findIdealConfig (input, groups = 3) {
  const totalWeight = input.reduce((sum, weight) => sum + weight, 0)
  const targetWeight = totalWeight / groups

  let n = 0
  let combinations

  while (true) {
    n++
    combinations = Array.from(getCombinations(input, n))
      .filter(combi => combi.reduce((sum, weight) => sum + weight, 0) === targetWeight)
    combinations.sort((a, b) => getQE(a) - getQE(b))
    for (let combi of combinations) {
      const leftovers = [...input]
      combi.forEach(weight => {
        leftovers.splice(leftovers.indexOf(weight), 1)
      })

      const splits = getAssignments(leftovers.length)

      for (let split of splits) {
        const oneSideWeight = leftovers.reduce((sum, weight, i) => sum + weight * split[i], 0)
        if (oneSideWeight === targetWeight) return getQE(combi)
      }
    }
  }
}

function getQE (arr) {
  return arr.reduce((product, weight) => product * weight, 1)
}

const test = load('day24', __dirname).split('\n').map(Number)

console.log(findIdealConfig(test))
console.log(findIdealConfig(test, 4))
