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
      if (hashA + hashB !== (hashA | hashB)) continue
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
      if ((visited & row.hash) === row.hash) return
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

const test = `
Valve EJ has flow rate=25; tunnel leads to valve MC
Valve WC has flow rate=0; tunnels lead to valves OW, RU
Valve NP has flow rate=0; tunnels lead to valves VR, KL
Valve AA has flow rate=0; tunnels lead to valves QT, AP, EZ, AK, XV
Valve VO has flow rate=6; tunnels lead to valves KM, RF, HS, LJ, IA
Valve CB has flow rate=0; tunnels lead to valves UI, UP
Valve TE has flow rate=18; tunnel leads to valve JT
Valve CZ has flow rate=0; tunnels lead to valves UP, OW
Valve LJ has flow rate=0; tunnels lead to valves DV, VO
Valve UP has flow rate=7; tunnels lead to valves SK, CB, CZ
Valve FP has flow rate=0; tunnels lead to valves OW, RE
Valve KM has flow rate=0; tunnels lead to valves SE, VO
Valve DV has flow rate=0; tunnels lead to valves LJ, UM
Valve FL has flow rate=0; tunnels lead to valves AH, TS
Valve VR has flow rate=24; tunnels lead to valves DM, TF, NP
Valve IA has flow rate=0; tunnels lead to valves VS, VO
Valve RF has flow rate=0; tunnels lead to valves VO, JF
Valve RT has flow rate=0; tunnels lead to valves UM, SE
Valve RU has flow rate=0; tunnels lead to valves AR, WC
Valve SE has flow rate=4; tunnels lead to valves GU, KM, CX, RT
Valve MC has flow rate=0; tunnels lead to valves EJ, AR
Valve TF has flow rate=0; tunnels lead to valves AH, VR
Valve CX has flow rate=0; tunnels lead to valves SE, TO
Valve GL has flow rate=11; tunnels lead to valves UY, KL, CY
Valve GU has flow rate=0; tunnels lead to valves SE, EZ
Valve VS has flow rate=0; tunnels lead to valves XN, IA
Valve EZ has flow rate=0; tunnels lead to valves AA, GU
Valve GK has flow rate=0; tunnels lead to valves FI, HZ
Valve JT has flow rate=0; tunnels lead to valves TE, XN
Valve DM has flow rate=0; tunnels lead to valves VR, HZ
Valve AR has flow rate=16; tunnels lead to valves UI, RU, MC
Valve XN has flow rate=9; tunnels lead to valves XP, JT, VS, GT, CY
Valve CY has flow rate=0; tunnels lead to valves XN, GL
Valve QT has flow rate=0; tunnels lead to valves UM, AA
Valve KL has flow rate=0; tunnels lead to valves GL, NP
Valve SK has flow rate=0; tunnels lead to valves XV, UP
Valve OW has flow rate=12; tunnels lead to valves CZ, WC, FP
Valve AK has flow rate=0; tunnels lead to valves AA, HS
Valve XV has flow rate=0; tunnels lead to valves AA, SK
Valve GT has flow rate=0; tunnels lead to valves XN, UM
Valve FI has flow rate=0; tunnels lead to valves JF, GK
Valve UY has flow rate=0; tunnels lead to valves JF, GL
Valve UM has flow rate=5; tunnels lead to valves DV, GT, RT, QT
Valve IQ has flow rate=0; tunnels lead to valves HZ, AH
Valve JF has flow rate=10; tunnels lead to valves RF, FI, UY, RE, TS
Valve TS has flow rate=0; tunnels lead to valves JF, FL
Valve AH has flow rate=23; tunnels lead to valves IQ, FL, TF
Valve HS has flow rate=0; tunnels lead to valves AK, VO
Valve HZ has flow rate=20; tunnels lead to valves IQ, DM, GK
Valve TO has flow rate=15; tunnel leads to valve CX
Valve XP has flow rate=0; tunnels lead to valves AP, XN
Valve AP has flow rate=0; tunnels lead to valves XP, AA
Valve RE has flow rate=0; tunnels lead to valves JF, FP
Valve UI has flow rate=0; tunnels lead to valves AR, CB
`.trim().split('\n').map(parse)

console.log(maxPressureReleased(test, 30))
console.log(maxPressureReleased2(test, 26))
