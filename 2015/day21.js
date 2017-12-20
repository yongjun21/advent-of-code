const {getAssignments} = require('../helpers')

function findLeastGold (input) {
  const combinations = getAssignments(equipments.length)

  const simulations = combinations
    .filter(combi => constraints.every(constraint => constraint(combi)))
    .map(combi => simulate(combi, input))

  return simulations
    .filter(result => result.win)
    .reduce((min, result) => result.cost < min ? result.cost : min, Infinity)
}

function findMostGold (input) {
  const combinations = getAssignments(equipments.length)

  const simulations = combinations
    .filter(combi => constraints.every(constraint => constraint(combi)))
    .map(combi => simulate(combi, input))

  return simulations
    .filter(result => !result.win)
    .reduce((max, result) => result.cost > max ? result.cost : max, 0)
}

function simulate (combination, input) {
  const cost = equipments.reduce((sum, equipment, i) => sum + combination[i] * equipment.cost, 0)
  const damage = equipments.reduce((sum, equipment, i) => sum + combination[i] * equipment.damage, 0)
  const armor = equipments.reduce((sum, equipment, i) => sum + combination[i] * equipment.armor, 0)

  let player = 100
  let boss = input.hp

  while (true) {
    boss -= Math.max(damage - input.armor, 1)
    if (boss <= 0) return {cost, combination, win: true}
    player -= Math.max(input.damage - armor, 1)
    if (player <= 0) return {cost, combination, win: false}
  }
}

const equipments = [
  {cost: 8, damage: 4, armor: 0},
  {cost: 10, damage: 5, armor: 0},
  {cost: 25, damage: 6, armor: 0},
  {cost: 40, damage: 7, armor: 0},
  {cost: 74, damage: 8, armor: 0},
  {cost: 13, damage: 0, armor: 1},
  {cost: 31, damage: 0, armor: 2},
  {cost: 53, damage: 0, armor: 3},
  {cost: 75, damage: 0, armor: 4},
  {cost: 102, damage: 0, armor: 5},
  {cost: 25, damage: 1, armor: 0},
  {cost: 50, damage: 2, armor: 0},
  {cost: 100, damage: 3, armor: 0},
  {cost: 20, damage: 0, armor: 1},
  {cost: 40, damage: 0, armor: 2},
  {cost: 80, damage: 0, armor: 3}
]

const constraints = [
  combi => combi.slice(0, 5).reduce((sum, v) => sum + v, 0) === 1,
  combi => combi.slice(5, 10).reduce((sum, v) => sum + v, 0) <= 1,
  combi => combi.slice(10).reduce((sum, v) => sum + v, 0) <= 2
]

const test = {hp: 104, damage: 8, armor: 1}

console.log(findLeastGold(test))
console.log(findMostGold(test))
