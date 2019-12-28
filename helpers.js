function getDigits (n, base = 10) {
  const digits = []
  while (n >= 1) {
    const d = n % base
    digits.push(d)
    n = (n - d) / base
  }
  if (digits.length === 0) digits.push(0)
  return digits
}

function getAssignments (items, groups = 2) {
  const combinations = []
  const nCombinations = Math.pow(groups, items)
  for (let i = 0; i < nCombinations; i++) {
    const combiString = i.toString(groups).padStart(items, '0')
    const combination = combiString.split('')
    if (groups === 2) combinations.push(combination.map(v => +v))
    else combinations.push(combination)
  }
  return combinations
}

function getPermutations (items, required = items.length) {
  const combinations = []
  function recurse (assigned, unassigned) {
    if (assigned.length < required) {
      for (let i = 0; i < unassigned.length; i++) {
        const next = unassigned.shift()
        recurse([...assigned, next], unassigned)
        unassigned.push(next)
      }
    } else {
      combinations.push(assigned)
    }
  }
  recurse([], items)
  return combinations
}

function getCombinations (items, required) {
  const combinations = []
  function recurse (assigned, i) {
    if (assigned.length < required) {
      while (i < items.length) {
        recurse([...assigned, items[i]], i + 1)
        i++
      }
    } else {
      combinations.push(assigned)
    }
  }
  recurse([], 0)
  return combinations
}

function getSplitCombinations (total, items) {
  const combinations = []
  function recurse (division, i) {
    if (division.length < items - 1) {
      while (i <= total) {
        recurse(division.concat(i), i)
        i++
      }
    } else {
      division = [0, ...division, total]
      const combination = []
      for (let i = 1; i < division.length; i++) {
        combination.push(division[i] - division[i - 1])
      }
      combinations.push(combination)
    }
  }
  recurse([], 0)
  return combinations
}

module.exports = {
  getDigits,
  getAssignments,
  getPermutations,
  getCombinations,
  getSplitCombinations
}
