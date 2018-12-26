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
    for (let getter of getters) {
      if (getter(a) < getter(b)) return -1
      if (getter(a) > getter(b)) return 1
    }
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

const immune = `
2667 units each with 9631 hit points (immune to cold; weak to radiation) with an attack that does 33 radiation damage at initiative 3
6889 units each with 7044 hit points (immune to cold, slashing) with an attack that does 8 cold damage at initiative 11
8030 units each with 8956 hit points (weak to bludgeoning) with an attack that does 8 fire damage at initiative 5
9278 units each with 9654 hit points (weak to slashing; immune to radiation) with an attack that does 10 radiation damage at initiative 9
3472 units each with 9606 hit points with an attack that does 26 cold damage at initiative 14
2971 units each with 4601 hit points (weak to cold, radiation) with an attack that does 14 fire damage at initiative 16
2455 units each with 6330 hit points (immune to slashing, radiation) with an attack that does 20 bludgeoning damage at initiative 20
1896 units each with 9385 hit points (weak to slashing, cold) with an attack that does 48 slashing damage at initiative 19
303 units each with 10428 hit points with an attack that does 328 radiation damage at initiative 13
4380 units each with 7040 hit points (weak to slashing) with an attack that does 16 slashing damage at initiative 8
`.trim().split('\n').map(parse)

const infection = `
3122 units each with 52631 hit points (immune to slashing, cold) with an attack that does 29 slashing damage at initiative 2
4257 units each with 52159 hit points with an attack that does 22 bludgeoning damage at initiative 17
721 units each with 25099 hit points (weak to radiation, cold) with an attack that does 60 slashing damage at initiative 15
1772 units each with 44946 hit points (weak to cold) with an attack that does 49 slashing damage at initiative 7
886 units each with 22310 hit points (weak to slashing, radiation) with an attack that does 36 cold damage at initiative 12
2804 units each with 45281 hit points (weak to bludgeoning; immune to fire) with an attack that does 30 slashing damage at initiative 10
8739 units each with 43560 hit points (weak to bludgeoning; immune to radiation, slashing) with an attack that does 9 cold damage at initiative 1
1734 units each with 30384 hit points (weak to cold, bludgeoning) with an attack that does 34 cold damage at initiative 4
5525 units each with 14091 hit points (weak to cold) with an attack that does 4 bludgeoning damage at initiative 18
1975 units each with 15393 hit points with an attack that does 15 fire damage at initiative 6
`.trim().split('\n').map(parse)

/*
const immune = `
17 units each with 5390 hit points (weak to radiation, bludgeoning) with an attack that does 4507 fire damage at initiative 2
989 units each with 1274 hit points (immune to fire; weak to bludgeoning, slashing) with an attack that does 25 slashing damage at initiative 3
`.trim().split('\n').map(parse)

const infection = `
801 units each with 4706 hit points (weak to radiation) with an attack that does 116 bludgeoning damage at initiative 1
4485 units each with 2961 hit points (immune to radiation; weak to fire, cold) with an attack that does 12 slashing damage at initiative 4
`.trim().split('\n').map(parse)
*/

console.log(fight(immune, infection))
console.log(boost(immune, infection))
