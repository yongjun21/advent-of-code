function totalRiskLevel (target, regionType) {
  let total = 0

  for (let y = 0; y <= target[1]; y++) {
    for (let x = 0; x <= target[0]; x++) {
      total += regionType([x, y])
    }
  }

  return total
}

function fastestWay (target, regionType, maxMoves = Infinity) {
  const adjacents = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
  ]

  function canReach (region, tool) {
    return regionType(region) !== tool
  }

  function changeTool (region, tool) {
    switch (regionType(region)) {
      case 0:
        return tool === 1 ? 2 : 1
      case 1:
        return tool === 2 ? 0 : 2
      case 2:
        return tool === 0 ? 1 : 0
    }
  }

  const unvisited = []
  const visited = {}

  unvisited.push([[0, 0], 1, 0])

  function visit (firstPass) {
    const [region, tool, moves] = unvisited.shift()
    const key = [region, tool]
    if (key in visited && moves >= visited[key]) return
    if (moves + manhatten(region, target) >= maxMoves) return
    visited[key] = moves
    if (region[0] === target[0] && region[1] === target[1] && tool === 1) {
      maxMoves = moves
      return
    }
    adjacents.forEach(offset => {
      const adj = [region[0] + offset[0], region[1] + offset[1]]
      if (adj[0] < 0 || adj[1] < 0) return
      if (firstPass && (adj[0] > target[0] || adj[1] > target[1])) return
      if (canReach(adj, tool)) unvisited.push([adj, tool, moves + 1])
    })
    unvisited.push([region, changeTool(region, tool), moves + 7])
  }

  while (unvisited.length > 0) {
    visit(true)
  }

  Object.keys(visited).forEach(key => {
    const [x, y, tool] = key.split(',').map(Number)
    if (x === target[0] || y === target[1]) {
      unvisited.push([[x, y], tool, visited[key]])
      delete visited[key]
    }
  })

  while (unvisited.length > 0) {
    visit(false)
  }

  return maxMoves
}

function getRegionType (target, depth, a = 16807, b = 48271, c = 20183) {
  const stack = []
  const memo = {}

  return region => {
    if (region[0] === target[0] && region[1] === target[1]) region = [0, 0]
    stack.push(region)
    while (stack.length > 0) {
      const [x, y] = stack.pop()
      if ([x, y] in memo) continue
      if (y === 0) {
        memo[[x, y]] = (a * x + depth) % c
      } else if (x === 0) {
        memo[[x, y]] = (b * y + depth) % c
      } else if ([x - 1, y] in memo && [x, y - 1] in memo) {
        memo[[x, y]] = (memo[[x - 1, y]] * memo[[x, y - 1]] + depth) % c
      } else {
        stack.push([x, y])
        stack.push([x - 1, y])
        stack.push([x, y - 1])
      }
    }
    return memo[region] % 3
  }
}

function manhatten (a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
}

const regionType = getRegionType([15, 700], 4848)

console.log(totalRiskLevel([15, 700], regionType))
console.log(fastestWay([15, 700], regionType, 984))
