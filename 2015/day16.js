const load = require('../loader')

function findAuntSue (input, ref, compare = {}) {
  const aunts = input.trim().split('\n').map(line => {
    const cut = line.indexOf(':')
    const label = line.slice(0, cut)
    const characteristics = {}
    line.slice(cut + 2).split(', ').forEach(item => {
      const keyValue = item.split(': ')
      characteristics[keyValue[0]] = +keyValue[1]
    })
    return {label, characteristics}
  })

  return aunts.filter(aunt => {
    return Object.keys(aunt.characteristics).every(key => {
      if (compare[key] === 1) return aunt.characteristics[key] > ref[key]
      if (compare[key] === -1) return aunt.characteristics[key] < ref[key]
      return aunt.characteristics[key] === ref[key]
    })
  })
}

const test = load('day16', __dirname)

const ref = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1
}

const compare = {
  cats: 1,
  trees: 1,
  pomeranians: -1,
  goldfish: -1
}

console.log(findAuntSue(test, ref))
console.log(findAuntSue(test, ref, compare))
