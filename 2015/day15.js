function generateCombinations (total, items, combinations, division = []) {
  if (division.length === items - 1) {
    division = [0, ...division, total]
    const combination = []
    for (let i = 1; i < division.length; i++) {
      combination.push(division[i] - division[i - 1])
    }
    combinations.push(combination)
    return
  }
  const lastBreak = division.length > 0 ? division[division.length - 1] : 0
  for (let i = lastBreak; i <= total; i++) {
    generateCombinations(total, items, combinations, [...division, i])
  }
}

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

  const combinations = []
  generateCombinations(100, ingredients.length, combinations)

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

const test = `
Sprinkles: capacity 5, durability -1, flavor 0, texture 0, calories 5
PeanutButter: capacity -1, durability 3, flavor 0, texture 0, calories 1
Frosting: capacity 0, durability -1, flavor 4, texture 0, calories 6
Sugar: capacity -1, durability 0, flavor 0, texture 2, calories 8
`

console.log(findPerfectCookie(test))
console.log(findPerfectCookie(test, cookie => cookie.calories === 500))
