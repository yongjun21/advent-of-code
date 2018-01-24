function getAssignments (items, groups = 2) {
  const nCombinations = Math.pow(groups, items)
  const zeroPad = '0'.repeat(items)
  return {
    [Symbol.iterator]: function* () {
      for (let i = 0; i < nCombinations; i++) {
        const combiString = (zeroPad + i.toString(groups)).slice(-items)
        const combination = combiString.split('')
        if (groups === 2) yield combination.map(v => +v)
        else yield combination
      }
    }
  }
}

function getPermutations (items, required = items.length) {
  return {
    [Symbol.iterator]: function* () {
      const stack = []
      stack.push([[], items])
      while (stack.length > 0) {
        const [assigned, unassigned] = stack.pop()
        if (assigned.length < required) {
          for (let i = unassigned.length - 1; i >= 0; i--) {
            stack.push([
              [unassigned[i], ...assigned],
              [unassigned.slice(0, i).concat(unassigned.slice(i + 1))]
            ])
          }
        } else {
          yield assigned
        }
      }
    }
  }
}

function getCombinations (items, required) {
  return {
    [Symbol.iterator]: function* () {
      const stack = []
      stack.push([[], items.length - 1])
      while (stack.length > 0) {
        let [assigned, i] = stack.pop()
        if (assigned.length < required) {
          while (i >= 0) {
            stack.push([[items[i], ...assigned], i - 1])
            i--
          }
        } else {
          yield assigned
        }
      }
    }
  }
}

function getSplitCombinations (total, items) {
  return {
    [Symbol.iterator]: function* () {
      const stack = []
      stack.push([[], total])
      while (stack.length > 0) {
        let [division, i] = stack.pop()
        if (division.length < items - 1) {
          while (i >= 0) {
            stack.push([division.concat(i), i])
            i--
          }
        } else {
          division = [0, ...division, total]
          const combination = []
          for (let i = 1; i < division.length; i++) {
            combination.push(division[i] - division[i - 1])
          }
          yield combination
        }
      }
    }
  }
}

module.exports = {
  getAssignments,
  getPermutations,
  getCombinations,
  getSplitCombinations
}
