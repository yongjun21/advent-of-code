const INITIAL_RESOURCE = {
  OR: 1,
  O: 0,
  CR: 0,
  C: 0,
  ObR: 0,
  Ob: 0,
  GR: 0,
  G: 0
}

function sumQualityLevel (input) {
  return input.reduce((sum, row) =>
    sum + row.id * getMaxGeodes(row.conversions, 24), 0)
}

function multiplyGeodes (input) {
  return input.reduce((product, row) =>
    product * getMaxGeodes(row.conversions, 32), 1)
}

function getMaxGeodes (conversion, time) {
  const maxRobotNeeded = getMaxRobotNeeded(conversion)

  let max = 0
  const unvisited = []

  unvisited.push([INITIAL_RESOURCE, 0])
  while (unvisited.length > 0) {
    const [resource, t] = unvisited.pop()
    const canCatchUp = (time - 1 - t) * (time - t) / 2 + resource.G + resource.GR * (time - t) > max
    if (!canCatchUp) continue

    let endSearch = true
    conversion.forEach(row => {
      if (resource[row.output] >= maxRobotNeeded[row.output]) return
      const earliest = getEarliest(resource, row.input)
      if (t + earliest + 1 < time) {
        const next = { ...resource }
        useResource(next, row.input)
        mineResource(next, earliest + 1)
        next[row.output]++
        unvisited.push([next, t + earliest + 1])
        endSearch = false
      }
    })
    if (endSearch) {
      mineResource(resource, time - t)
      if (resource.G > max) {
        max = resource.G
      }
    }
  }
  return max
}

function getMaxRobotNeeded (conversion) {
  const max = {}
  conversion.forEach(row => {
    const key = row.output.slice(0, -1)
    max[row.output] = conversion.reduce((max, row) => {
      const v = row.input[key] ?? 0
      return v > max ? v : max
    }, 0)
  })
  max.GR = Infinity
  return max
}

function getEarliest (curr, input) {
  return Object.keys(input).reduce((max, key) => {
    const e = Math.max(Math.ceil((input[key] - curr[key]) / curr[key + 'R']), 0)
    return e > max ? e : max
  }, 0)
}

function mineResource (curr, times = 1) {
  curr.O += curr.OR * times
  curr.C += curr.CR * times
  curr.Ob += curr.ObR * times
  curr.G += curr.GR * times
}

function useResource (curr, input) {
  Object.keys(input).forEach(key => {
    curr[key] -= input[key]
  })
  return curr
}

const BLUEPRINT_REGEX = /^Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian.$/
function parse (line) {
  const matched = line.match(BLUEPRINT_REGEX)
  return {
    id: +matched[1],
    conversions: [
      { input: { O: +matched[2] }, output: 'OR' },
      { input: { O: +matched[3] }, output: 'CR' },
      { input: { O: +matched[4], C: +matched[5] }, output: 'ObR' },
      { input: { O: +matched[6], Ob: +matched[7] }, output: 'GR' }
    ]
  }
}

const test = `
Blueprint 1: Each ore robot costs 2 ore. Each clay robot costs 2 ore. Each obsidian robot costs 2 ore and 17 clay. Each geode robot costs 2 ore and 10 obsidian.
Blueprint 2: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 15 clay. Each geode robot costs 3 ore and 8 obsidian.
Blueprint 3: Each ore robot costs 3 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 16 clay. Each geode robot costs 2 ore and 18 obsidian.
Blueprint 4: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 17 clay. Each geode robot costs 2 ore and 13 obsidian.
Blueprint 5: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 5 clay. Each geode robot costs 3 ore and 15 obsidian.
Blueprint 6: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 17 clay. Each geode robot costs 4 ore and 20 obsidian.
Blueprint 7: Each ore robot costs 3 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 9 clay. Each geode robot costs 2 ore and 9 obsidian.
Blueprint 8: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 12 clay. Each geode robot costs 3 ore and 8 obsidian.
Blueprint 9: Each ore robot costs 2 ore. Each clay robot costs 2 ore. Each obsidian robot costs 2 ore and 8 clay. Each geode robot costs 2 ore and 14 obsidian.
Blueprint 10: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 2 ore and 12 clay. Each geode robot costs 3 ore and 15 obsidian.
Blueprint 11: Each ore robot costs 2 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 19 clay. Each geode robot costs 2 ore and 18 obsidian.
Blueprint 12: Each ore robot costs 2 ore. Each clay robot costs 4 ore. Each obsidian robot costs 2 ore and 16 clay. Each geode robot costs 2 ore and 9 obsidian.
Blueprint 13: Each ore robot costs 2 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 18 clay. Each geode robot costs 2 ore and 11 obsidian.
Blueprint 14: Each ore robot costs 3 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 18 clay. Each geode robot costs 3 ore and 13 obsidian.
Blueprint 15: Each ore robot costs 3 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 9 clay. Each geode robot costs 3 ore and 7 obsidian.
Blueprint 16: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 2 ore and 7 clay. Each geode robot costs 3 ore and 10 obsidian.
Blueprint 17: Each ore robot costs 3 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 6 clay. Each geode robot costs 2 ore and 20 obsidian.
Blueprint 18: Each ore robot costs 4 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 19 clay. Each geode robot costs 3 ore and 13 obsidian.
Blueprint 19: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 2 ore and 14 clay. Each geode robot costs 4 ore and 15 obsidian.
Blueprint 20: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 2 ore and 9 clay. Each geode robot costs 3 ore and 15 obsidian.
Blueprint 21: Each ore robot costs 3 ore. Each clay robot costs 4 ore. Each obsidian robot costs 3 ore and 10 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 22: Each ore robot costs 3 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 16 clay. Each geode robot costs 3 ore and 14 obsidian.
Blueprint 23: Each ore robot costs 3 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 20 clay. Each geode robot costs 2 ore and 12 obsidian.
Blueprint 24: Each ore robot costs 3 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 6 clay. Each geode robot costs 2 ore and 16 obsidian.
Blueprint 25: Each ore robot costs 4 ore. Each clay robot costs 3 ore. Each obsidian robot costs 4 ore and 20 clay. Each geode robot costs 2 ore and 15 obsidian.
Blueprint 26: Each ore robot costs 4 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 20 clay. Each geode robot costs 3 ore and 9 obsidian.
Blueprint 27: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 13 clay. Each geode robot costs 3 ore and 15 obsidian.
Blueprint 28: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 2 ore and 11 clay. Each geode robot costs 3 ore and 14 obsidian.
Blueprint 29: Each ore robot costs 4 ore. Each clay robot costs 3 ore. Each obsidian robot costs 4 ore and 15 clay. Each geode robot costs 4 ore and 9 obsidian.
Blueprint 30: Each ore robot costs 4 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 7 clay. Each geode robot costs 3 ore and 8 obsidian.
`.trim().split('\n').map(parse)

console.log(sumQualityLevel(test))
console.log(multiplyGeodes(test.slice(0, 3)))
