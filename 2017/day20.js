const load = require('../loader')

const {getCombinations} = require('../helpers')

function parseInput (input) {
  return input.trim().split('\n').map(line => {
    const particle = {}
    line.split(', ').forEach(variable => {
      let [key, value] = variable.split('=')
      value = value.slice(1, -1).split(',').map(v => +v)
      particle[key] = value
    })
    return particle
  })
}

function findClosest (input) {
  const particles = parseInput(input)

  const sorted = [...particles].sort((a, b) => {
    const aA = sumContribution(a, 'a')
    const bA = sumContribution(b, 'a')
    if (aA !== bA) return aA - bA
    const aV = sumContribution(a, 'v')
    const bV = sumContribution(b, 'v')
    if (aV !== bV) return aV - bV
    const aP = sumContribution(a, 'p')
    const bP = sumContribution(b, 'p')
    return aP - bP
  })

  return particles.indexOf(sorted[0])
}

function sumContribution (particle, key) {
  return particle[key].reduce((sum, v) => sum + Math.abs(v), 0)
}

function willCollide (pair) {
  const [p1, p2] = pair

  let time
  for (let i = 0; i < 3; i++) {
    const A = p1.a[i] / 2 - p2.a[i] / 2
    const B = p1.a[i] / 2 - p2.a[i] / 2 + p1.v[i] - p2.v[i]
    const C = p1.p[i] - p2.p[i]

    let solution
    if (A !== 0) {
      const discriminant = Math.pow(B, 2) - 4 * A * C
      if (discriminant < 0) return null
      solution = [(-B - Math.sqrt(discriminant)) / 2 / A, (-B + Math.sqrt(discriminant)) / 2 / A]
    } else if (B !== 0) {
      solution = [-C / B]
    } else if (C !== 0) {
      return null
    } else {
      continue
    }

    time = time || solution
    time = time.filter(t => solution.includes(t))
  }

  time = time.filter(t => t >= 0)
  return time.length > 0 ? {pair, time: time[0]} : null
}

function removeCollision (input) {
  const particles = parseInput(input)

  while (true) {
    const pairs = getCombinations(particles, 2)
    const collisions = pairs.map(willCollide).filter(collision => collision != null)
    if (collisions.length === 0) return particles.length

    const earliest = collisions
      .reduce((min, collision) => collision.time < min ? collision.time : min, Infinity)

    collisions.filter(collision => collision.time === earliest).forEach(collision => {
      collision.pair.forEach(particle => {
        const index = particles.indexOf(particle)
        if (index > -1) particles.splice(index, 1)
      })
    })
  }
}

const test = load('day20', __dirname)

console.log(findClosest(test))
console.log(removeCollision(test))
