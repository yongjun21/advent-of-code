function simulate (moves, input, handicap = 0) {
  let mana = 500
  let player = 50
  let boss = input.hp

  const executed = []

  function execute () {
    let mana = 0
    let damage = 0
    let armor = 0
    let hp = 0
    const disabled = []

    executed.forEach(effect => {
      const next = effect.next()
      if (next.done) return
      mana += next.value.mana || 0
      damage += next.value.damage || 0
      armor += next.value.armor || 0
      hp += next.value.hp || 0
      if (next.value.disabled) disabled.push(next.value.disabled)
    })

    return {mana, damage, armor, hp, disabled}
  }

  for (let move of moves) {
    player -= handicap
    if (player <= 0) return 'lose'

    executed.push(move())
    const playerTurn = execute()
    if (playerTurn.disabled.includes(move)) return 'lose'
    mana -= playerTurn.mana
    if (mana < 0) return 'lose'
    boss -= playerTurn.damage
    if (boss <= 0) return 'win'
    player += playerTurn.hp

    const bossTurn = execute()
    mana -= bossTurn.mana
    boss -= bossTurn.damage
    if (boss <= 0) return 'win'
    player -= Math.max(input.damage - bossTurn.armor, 1)
    if (player <= 0) return 'lose'
  }

  return 'undecided'
}

function manaUsed (moves) {
  return moves.reduce((sum, move) => {
    return sum + move().next().value.mana
  }, 0)
}

function findLeastMana (input, handicap) {
  let best = Infinity

  const unvisited = []
  unvisited.push([])
  while (unvisited.length > 0) {
    const moves = unvisited.pop()
    const mana = manaUsed(moves)
    if (mana >= best) continue
    const outcome = simulate(moves, input, handicap)
    if (outcome === 'win') best = mana
    if (outcome === 'undecided') {
      spells.forEach(spell => {
        unvisited.push(moves.concat(spell))
      })
    }
  }

  return best
}

const spells = [
  function* recharge () {
    yield {mana: 229}
    for (let i = 0; i < 4; i++) yield {mana: -101, disabled: spells[0]}
    yield {mana: -101}
  },
  function* poison () {
    yield {mana: 173}
    for (let i = 0; i < 5; i++) yield {damage: 3, disabled: spells[1]}
    yield {damage: 3}
  },
  function* shield () {
    yield {mana: 113}
    for (let i = 0; i < 5; i++) yield {armor: 7, disabled: spells[2]}
    yield {armour: 7}
  },
  function* drain () {
    yield {mana: 73, damage: 2, hp: 2}
  },
  function* missle () {
    yield {mana: 53, damage: 4}
  }
]

const test = {hp: 55, damage: 8}

// console.log(findLeastMana(test))
console.log(findLeastMana(test, 1))
