const ADJACENTS = [
  [0, -1],
  [-1, 0],
  [1, 0],
  [0, 1]
]

function getOutcome (input, attackPower) {
  input = input.map(row => [...row])
  const units = getUnits(input, attackPower)
  let completedRound = 0
  while (true) {
    const exit = units.sort().some(unit => {
      if (unit.removed) return
      if (units.wins(unit.type)) return true
      unit.move()
      unit.attack()
      // print(input)
    })
    if (exit) break
    // print(input)
    completedRound++
  }
  // print(input)
  const unitsRemaining = units.filter(u => !u.removed)
  return {
    completedRound,
    wins: unitsRemaining[0].type,
    unitsLeft: unitsRemaining.length,
    totalHP: unitsRemaining.reduce((sum, u) => sum + u.hp, 0),
    inspect () {
      return this.completedRound * this.totalHP
    }
  }
}

function changeOutcome (input) {
  const ATK = {E: 4, G: 3}

  const initialForce = input.reduce((sum, row) =>
    sum + row.filter(type => type === 'E').length, 0)

  let outcome
  do {
    outcome = getOutcome(input, ATK)
    ATK['E']++
  } while (outcome.wins !== 'E' || outcome.unitsLeft < initialForce)
  return outcome
}

function getUnits (input, attackPower = {E: 3, G: 3}) {
  const units = []
  input.forEach((row, y) => {
    row.forEach((type, x) => {
      if (type === '#' || type === '.') return
      const unit = {
        type,
        atk: attackPower[type],
        hp: 200,
        location: [x, y],
        move,
        attack
      }
      row[x] = unit
      units.push(unit)
    })
  })
  units.sort = sort
  units.wins = wins
  return units

  function sort () {
    return Array.prototype.sort.call(this, (a, b) => {
      if (a.location[1] < b.location[1]) return -1
      if (a.location[1] > b.location[1]) return 1
      return a.location[0] - b.location[0]
    })
  }

  function wins (type) {
    return this.filter(u => !u.removed && u.type !== type).length === 0
  }

  function move () {
    const targets = []
    targets.sort = sort

    let nearest = Infinity
    const unvisited = []
    const visited = {}
    unvisited.push([this.location])
    while (unvisited.length > 0) {
      const trace = unvisited.shift()
      if (trace.length - 1 > nearest) break
      const last = trace[trace.length - 1]
      const key = last.join('.')
      if (key in visited) continue
      visited[key] = true
      if (_inRange(last, this.type).length > 0) {
        nearest = trace.length - 1
        targets.push({location: last, firstStep: trace[1]})
      }
      _getAdjacents(last).forEach(loc => {
        if (_get(loc) === '.') unvisited.push([...trace, loc])
      })
    }

    const target = targets.sort()[0]
    if (target && target.firstStep) {
      _set(this.location, '.')
      _set(target.firstStep, this)
      this.location = target.firstStep
    }
  }

  function attack () {
    const inRange = _inRange(this.location, this.type)
    if (inRange.length === 0) return null
    const target = inRange.reduce((min, u) => u.hp < min.hp ? u : min, {hp: Infinity})
    target.hp -= this.atk
    if (target.hp <= 0) {
      _set(target.location, '.')
      target.removed = true
    }
  }

  function _get (location) {
    return input[location[1]][location[0]]
  }

  function _set (location, value) {
    input[location[1]][location[0]] = value
  }

  function _getAdjacents (location) {
    return ADJACENTS.map(offset => ([
      location[0] + offset[0],
      location[1] + offset[1]
    ]))
  }

  function _inRange (location, type) {
    return _getAdjacents(location).map(_get).filter(adj => {
      return typeof adj === 'object' && adj.type !== type
    })
  }
}

function print (input) {
  input.forEach(row => {
    const line = row.map(v => typeof v === 'string' ? v : v.type).join('')
    console.log(line)
  })
}

const test = `
################################
##################G..###########
#################.....##########
################...##..#########
#####..#####..#######..#########
#####.######....#####....#######
#####.######GG.G.##G.....#######
#####..#####..G.G#...G#.######.#
######.######.......G.#..####..#
####...G######.......EE..E.##..#
####......####.....#.E.........#
#####.....#...G................#
###....####...#####G..........##
##.GG....##..#######.......#..##
##......###.#########.........##
#.....G...#.#########.........##
#...G#......#########.......####
#..G.#......#########.....######
#.G..##.....#########....##.####
#............#######......#E####
#.....#.......#####.......G.####
#...###............G.E...E.#####
#..######...................####
#########.................######
#########...............########
#########..........#.....E######
#########....###...###......####
#########....#####.###......####
#######....#######.....##E.#####
######.....########E.#####.#####
#######..##########...##########
################################
`.trim().split('\n').map(line => line.split(''))

console.log(getOutcome(test))
console.log(changeOutcome(test))
