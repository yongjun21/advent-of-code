const load = require('../loader')

const {getSplitCombinations} = require('../helpers')

function getCookieProperties (input) {
  const ingredients = input.trim().split('\n').map(line => {
    const match = line.match(/^(.+): capacity (-?[0-9]+), durability (-?[0-9]+), flavor (-?[0-9]+), texture (-?[0-9]+), calories (-?[0-9]+)$/)
    return {
      label: match[1],
      capacity: match[2],
      durability: match[3],
      flavor: match[4],
      texture: match[5],
      calories: match[6]
    }
  })

  const combinations = getSplitCombinations(100, ingredients.length)

  return combinations.map(c => {
    const capacity = c.reduce((sum, n, i) => sum + n * ingredients[i].capacity, 0)
    const durability = c.reduce((sum, n, i) => sum + n * ingredients[i].durability, 0)
    const flavor = c.reduce((sum, n, i) => sum + n * ingredients[i].flavor, 0)
    const texture = c.reduce((sum, n, i) => sum + n * ingredients[i].texture, 0)
    const calories = c.reduce((sum, n, i) => sum + n * ingredients[i].calories, 0)
    const score =
      Math.max(capacity, 0) *
      Math.max(durability, 0) *
      Math.max(flavor, 0) *
      Math.max(texture, 0)
    return {proportion: c, capacity, durability, flavor, texture, calories, score}
  })
}

function findPerfectCookie (input, filter = v => true) {
  const properties = getCookieProperties(input)
  return properties
    .filter(filter)
    .reduce((max, cookie) => cookie.score > max ? cookie.score : max, 0)
}

const test = load('day15', __dirname)

console.log(findPerfectCookie(test))
console.log(findPerfectCookie(test, cookie => cookie.calories === 500))
