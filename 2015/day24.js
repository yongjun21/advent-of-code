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

const test = [1, 3, 5, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113]

console.log(findIdealConfig(test))
console.log(findIdealConfig(test, 4))
