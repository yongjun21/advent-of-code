const load = require('../loader')

function fight (armyA, armyB) {
  armyA = armyA.map((u, i) => new Group(u, i))
  armyB = armyB.map((u, i) => new Group(u, i))
  const combined = [...armyA, ...armyB]
  sort(combined, u => -u.initiative)
  const state = {
    totalA: armyA.reduce((sum, u) => sum + u.units, 0),
    totalB: armyB.reduce((sum, u) => sum + u.units, 0)
  }
  while (armyA.some(u => u.canAttack) && armyB.some(u => u.canAttack)) {
    sort(armyA, u => -u.pow, u => -u.initiative)
    armyA.forEach(u => {
      if (u.canAttack) u.selectTarget(armyB)
    })
    sort(armyB, u => -u.pow, u => -u.initiative)
    armyB.forEach(u => {
      if (u.canAttack) u.selectTarget(armyA)
    })
    combined.forEach(u => {
      if (u.targeting) u.attack()
    })
    const totalA = armyA.reduce((sum, u) => sum + u.units, 0)
    const totalB = armyB.reduce((sum, u) => sum + u.units, 0)
    if (totalA === state.totalA && totalB === state.totalB) break
    state.totalA = totalA
    state.totalB = totalB
  }

  return {
    wins: state.totalB === 0,
    units: state.totalA + state.totalB,
    inspect () {
      return this.units
    }
  }
}

function boost (armyA, armyB) {
  let result
  do {
    armyA.forEach(u => {
      u.atk++
    })
    result = fight(armyA, armyB)
  } while (!result.wins)
  return result
}

class Group {
  constructor (initial, id) {
    Object.assign(this, initial)
    this.id = id
    this.targeting = null
    this.targeted = false
  }

  get pow () {
    return this.units * this.atk
  }

  get canAttack () {
    return this.units > 0
  }

  selectTarget (enemy) {
    const filtered = enemy.filter(target => {
      return target.canAttack && !target.targeted && !target.immune.includes(this.type)
    })
    if (filtered.length === 0) return null
    const expectedDamage = {}
    filtered.forEach(target => {
      let damage = this.pow
      if (target.weak.includes(this.type)) damage *= 2
      expectedDamage[target.id] = damage
    })
    sort(
      filtered,
      t => -expectedDamage[t.id],
      t => -t.pow,
      t => -t.initiative
    )
    this.targeting = filtered[0]
    this.targeting.targeted = true
    return this.targeting
  }

  attack () {
    const target = this.targeting
    let damage = this.pow
    if (target.weak.includes(this.type)) damage *= 2
    target.units = Math.max(target.units - Math.floor(damage / target.hp), 0)
    this.targeting = null
    target.targeted = false
  }
}

function sort (array, ...getters) {
  return array.sort((a, b) => {
    for (const getter of getters) {
      if (getter(a) < getter(b)) return -1
      if (getter(a) > getter(b)) return 1
    }
    return 0
  })
}

function parse (line) {
  const matchStart = line.match(/^(\d+) units each with (\d+) hit points/)
  const matchEnd = line.match(/with an attack that does (\d+) (\D+) damage at initiative (\d+)$/)
  const matchExtra = line.match(/\((.+)\)/)

  const group = {
    units: +matchStart[1],
    hp: +matchStart[2],
    atk: +matchEnd[1],
    type: matchEnd[2],
    initiative: +matchEnd[3],
    immune: [],
    weak: []
  }

  if (matchExtra) {
    matchExtra[1].split('; ').forEach(part => {
      const match = part.match(/(immune|weak) to (.+)/)
      group[match[1]] = match[2].split(', ')
    })
  }

  return group
}

const test = load('day24', __dirname)
const parts = test.split('\n\n')
const immune = parts[0].split('\n').map(parse)
const infection = parts[1].split('\n').map(parse)

console.log(fight(immune, infection))
console.log(boost(immune, infection))
