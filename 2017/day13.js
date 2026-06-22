const load = require('../loader')

function * scanner (range) {
  let y = 0
  let delta = 1
  while (true) {
    if (y + delta < 1 || y + delta > range) delta *= -1
    y += delta
    yield y
  }
}

function getScanners (input) {
  const scanners = []
  input.trim().split('\n').forEach(line => {
    const match = line.match(/^([0-9]+): ([0-9]+)$/)
    scanners[+match[1]] = {
      depth: +match[1],
      range: +match[2],
      scan: scanner(+match[2])
    }
  })
  return scanners
}

function getSeverity (positions, scanners, delay = 0) {
  while (positions.length < scanners.length + delay) {
    positions.push(scanners.map(layer => layer.scan.next().value))
  }

  return scanners.reduce((sum, layer, i) => {
    if (positions[i + delay][i] > 1) return sum
    return (sum || 0) + layer.depth * layer.range
  }, null)
}

function noDelay (input) {
  const scanners = getScanners(input)
  return getSeverity([], scanners)
}

function bypassFirewall (input) {
  const scanners = getScanners(input)
  const positions = []
  let delay = 0
  while (getSeverity(positions, scanners, delay) != null) {
    positions[delay++] = undefined
  }
  return delay
}

const test = load('day13', __dirname)

console.log(noDelay(test))
console.log(bypassFirewall(test))
