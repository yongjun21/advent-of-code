const load = require('../loader')

function getDistribution (input) {
  const sorted = [0, ...input].sort((a, b) => a - b)
  sorted.push(sorted[sorted.length - 1] + 3)
  const dist = new Map()
  for (let i = 1; i < sorted.length; i++) {
    const diff = sorted[i] - sorted[i - 1]
    dist.set(diff, (dist.get(diff) || 0) + 1)
  }
  return dist
}

function countArrangements (input) {
  const sorted = [0, ...input].sort((a, b) => a - b)
  const arrangements = [1]
  for (let i = 1; i < sorted.length; i++) {
    arrangements[i] = 0
    for (let j = i - 1; j >= 0; j--) {
      if (sorted[i] - sorted[j] > 3) break
      arrangements[i] += arrangements[j]
    }
  }
  return arrangements[arrangements.length - 1]
}

const test = load('day10', __dirname).trim().split('\n').map(Number)

const dist = getDistribution(test)
console.log(dist.get(1) * dist.get(3))
console.log(countArrangements(test))
