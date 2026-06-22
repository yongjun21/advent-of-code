const load = require('../loader')

function buildBridge (components) {
  const bridges = []

  function extend (port, bridge) {
    const filtered = components
      .filter(component => !bridge.includes(component))
      .filter(component => component[0] === port || component[1] === port)
    if (filtered.length > 0) {
      filtered.forEach(component => {
        extend(component[0] === port ? component[1] : component[0], [...bridge, component])
      })
    } else {
      bridges.push(bridge)
    }
  }

  extend(0, [])

  return bridges
}

function findStrongestBridge (input) {
  const components = input.trim().split('\n')
    .map(line => line.split('/').map(pin => +pin))
  const bridges = buildBridge(components)

  const strength = bridges.map(bridge =>
    bridge.reduce((sum, component) => sum + component[0] + component[1], 0))

  return strength.reduce((max, s) => s > max ? s : max, 0)
}

function findLongestBridge (input) {
  const components = input.trim().split('\n')
    .map(line => line.split('/').map(pin => +pin))
  const bridges = buildBridge(components)

  const maxLength = bridges.reduce((max, bridge) => bridge.length > max ? bridge.length : max, 0)

  const strength = bridges.filter(bridge => bridge.length === maxLength).map(bridge =>
    bridge.reduce((sum, component) => sum + component[0] + component[1], 0))

  return strength.reduce((max, s) => s > max ? s : max, 0)
}

const test = load('day24', __dirname)

console.log(findStrongestBridge(test))
console.log(findLongestBridge(test))
