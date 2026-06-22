const load = require('../loader')

function maxPressureReleased (input, startTime) {
  const score = search(input, startTime)
  return score[0][1]
}

function maxPressureReleased2 (input, startTime) {
  const score = search(input, startTime)
  let max = 0
  for (let j = 1; j < score.length; j++) {
    for (let i = 0; i < j; i++) {
      if (score[i][1] * 2 < max) break
      const hashA = score[i][0]
      const hashB = score[j][0]
      if (hashA & hashB) continue
      const total = score[i][1] + score[j][1]
      if (total > max) max = total
    }
  }
  return max
}

function search (input, startTime) {
  const valves = getValves(input)
  const openable = input.filter(row => row.rate > 0)
  const shortestPath = getShortestPath(valves, openable)

  const score = []
  const unvisited = []
  unvisited.push([0, 'AA', startTime, 0])

  while (unvisited.length > 0) {
    const [visited, next, time, released, extras] = unvisited.pop()
    openable.forEach(row => {
      if (visited & row.hash) return
      score.push([visited, released])
      const distance = shortestPath[next][row.from]
      const nextTime = time - distance - 1
      if (nextTime > 0) {
        unvisited.push([
          visited + row.hash,
          row.from,
          nextTime,
          released + nextTime * row.rate,
          extras
        ])
      }
    })
  }

  return score.sort((a, b) => b[1] - a[1])
}

function getShortestPath (valves, openable) {
  function findShortestPath (start) {
    const visited = {}
    const unvisited = []
    unvisited.push([valves[start], 0])
    while (unvisited.length > 0) {
      const [next, steps] = unvisited.shift()
      if (next.from in visited) {
        if (steps >= visited[next.from]) continue
        else visited[next.from] = steps
      } else {
        visited[next.from] = steps
      }
      Object.keys(next.to).forEach(id =>
        unvisited.push([valves[id], steps + next.to[id]])
      )
    }
    delete visited[start]
    return visited
  }

  const shortest = {}
  shortest.AA = findShortestPath('AA')
  openable.forEach(row => {
    shortest[row.from] = findShortestPath(row.from)
  })
  return shortest
}

function getValves (input) {
  const valves = {}
  let hash = 1
  input.forEach(row => {
    valves[row.from] = row
    if (row.rate > 0) {
      row.hash = hash
      hash *= 2
    }
  })

  function preprocessInputRowTo (row, path = []) {
    if (!Array.isArray(row.to)) return row.to
    const to = {}
    row.to.forEach(id => {
      if (path.includes(id)) return
      const next = valves[id]
      const steps =
        next.rate > 0
          ? { [id]: 0 }
          : preprocessInputRowTo(next, [...path, row.from])
      Object.keys(steps).forEach(id => {
        if (id in to) to[id] = Math.min(to[id], steps[id] + 1)
        else to[id] = steps[id] + 1
      })
    })
    delete to[row.from]
    return to
  }

  input.forEach(row => {
    row.to = preprocessInputRowTo(row)
  })

  return valves
}

function parse (line) {
  const matched = line.match(
    /^Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? ([A-Z, ]+)$/
  )
  return {
    from: matched[1],
    to: matched[3].split(', '),
    rate: +matched[2]
  }
}

const test = load('day16', __dirname).trim().split('\n').map(parse)

console.log(maxPressureReleased(test, 30))
console.log(maxPressureReleased2(test, 26))
