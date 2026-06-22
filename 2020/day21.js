const load = require('../loader')

function countAllergenFree (input) {
  const [ingredients, allergens] = prepare(input)
  const free = new Set()
  for (const [i, s] of ingredients) {
    if (s.size === allergens.size) free.add(i)
  }
  return input.reduce((sum, row) => {
    for (const i of row.ingredients) {
      if (free.has(i)) sum++
    }
    return sum
  }, 0)
}

function listDangerous (input) {
  const [ingredients, allergens] = prepare(input)
  const dangerous = []
  while (allergens.size > 0) {
    for (const a of allergens) {
      const possible = []
      for (const [i, s] of ingredients) {
        if (!s.has(a)) possible.push(i)
      }
      if (possible.length === 1) {
        const i = possible[0]
        dangerous.push({ ingredient: i, allergen: a })
        ingredients.set(i, allergens)
        allergens.delete(a)
      }
    }
  }
  dangerous.sort((a, b) => {
    if (a.allergen < b.allergen) return -1
    if (a.allergen > b.allergen) return 1
    return 0
  })
  return dangerous.map(row => row.ingredient).join(',')
}

function prepare (input) {
  const ingredients = new Set()
  const allergens = new Set()
  input.forEach(row => {
    for (const i of row.ingredients) ingredients.add(i)
    for (const a of row.allergens) allergens.add(a)
  })
  const safe = new Map()
  for (const i of ingredients) safe.set(i, new Set())
  input.forEach(row => {
    for (const i of ingredients) {
      if (!row.ingredients.has(i)) {
        for (const a of row.allergens) safe.get(i).add(a)
      }
    }
  })
  return [safe, allergens]
}

function parse (line) {
  const [ingredients, allergens] = line.split(' (contains ')
  return {
    ingredients: new Set(ingredients.split(' ')),
    allergens: new Set(allergens.slice(0, -1).split(', '))
  }
}

const test = load('day21', __dirname).trim().split('\n').map(parse)

const test2 = `
mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)
`.trim().split('\n').map(parse)

console.log(countAllergenFree(test))
console.log(listDangerous(test))
