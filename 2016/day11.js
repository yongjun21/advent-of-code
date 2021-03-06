function parseInput (input) {
  const pairs = {}

  input.trim().split('\n').forEach((line, i) => {
    if (line.match(/nothing relevant/)) return
    const generators = line.match(/[a-z]+ generator/g)
    const microchips = line.match(/[a-z]+-compatible microchip/g)
    if (generators) {
      generators.forEach(g => {
        const key = g.slice(0, -10)
        pairs[key] = pairs[key] || {}
        pairs[key].G = i + 1
      })
    }
    if (microchips) {
      microchips.forEach(g => {
        const key = g.slice(0, -21)
        pairs[key] = pairs[key] || {}
        pairs[key].M = i + 1
      })
    }
  })
  return Object.keys(pairs).map(key => pairs[key])
}

function serialize (current, pairs) {
  const sorted = pairs.map(pair => pair.G * 10 + pair.M).sort()
  return [current, ...sorted].join(',')
}

function deserialized (serialized) {
  const splitted = serialized.split(',')
  const current = +splitted[0]
  const pairs = splitted.slice(1).map((pair, i) => {
    const G = +pair[0]
    const M = +pair[1]
    return {G, M}
  })
  return {current, pairs}
}

function getPermittedMoves (current, pairs) {
  const ideal = []
  const nonIdeal = []

  const gs = []
  const ms = []
  pairs.forEach((pair, i) => {
    if (pair.G === current) gs.push(i)
    if (pair.M === current) ms.push(i)
  })

  function populate (next, one, two) {
    for (let i = 0; i < gs.length; i++) {
      for (let j = i + 1; j < gs.length; j++) {
        two.push({next, G: [gs[i], gs[j]], M: []})
      }
      one.push({next, G: [gs[i]], M: []})
    }

    for (let i = 0; i < ms.length; i++) {
      for (let j = i + 1; j < ms.length; j++) {
        two.push({next, G: [], M: [ms[i], ms[j]]})
      }
      one.push({next, G: [], M: [ms[i]]})
    }

    for (let i = 0; i < gs.length; i++) {
      for (let j = 0; j < ms.length; j++) {
        two.push({next, G: [gs[i]], M: [ms[j]]})
      }
    }
  }

  if (current < 4) populate(current + 1, nonIdeal, ideal)
  if (current > 1) populate(current - 1, ideal, nonIdeal)

  return [...ideal, ...nonIdeal].map(move => {
    return {
      current: move.next,
      pairs: pairs.map((pair, i) => {
        pair = Object.assign({}, pair)
        if (move.G.includes(i)) pair.G = move.next
        if (move.M.includes(i)) pair.M = move.next
        return pair
      })
    }
  }).filter(permitted)
}

function permitted ({current, pairs}) {
  const floors = [
    {G: [], M: []},
    {G: [], M: []},
    {G: [], M: []},
    {G: [], M: []}
  ]
  pairs.forEach((pair, i) => {
    floors[pair.G - 1].G.push(i)
    floors[pair.M - 1].M.push(i)
  })

  return floors.every(floor => {
    return floor.M.every(m => floor.G.includes(m) || floor.G.length === 0)
  })
}

function isComplete (current, pairs) {
  return current === 4 && pairs.every(pair => pair.G === 4 && pair.M === 4)
}

function minimumMoves (state, current = 1) {
  const visited = {}
  const unvisited = []

  unvisited.push(serialize(current, state) + '.0')

  while (unvisited.length > 0) {
    const [serialized, moves] = unvisited.shift().split('.')
    if (serialized in visited) continue
    const {current, pairs} = deserialized(serialized)
    if (isComplete(current, pairs)) return +moves
    visited[serialized] = moves
    getPermittedMoves(current, pairs).forEach(({current, pairs}) => {
      const serialized = serialize(current, pairs)
      unvisited.push(serialized + '.' + (+moves + 1))
    })
  }
}

const test = `
The first floor contains a promethium generator and a promethium-compatible microchip.
The second floor contains a cobalt generator, a curium generator, a ruthenium generator, and a plutonium generator.
The third floor contains a cobalt-compatible microchip, a curium-compatible microchip, a ruthenium-compatible microchip, and a plutonium-compatible microchip.
The fourth floor contains nothing relevant.
`

const state = parseInput(test)

console.log(minimumMoves(state))

state.push({G: 1, M: 1})
state.push({G: 1, M: 1})

console.log(minimumMoves(state))
