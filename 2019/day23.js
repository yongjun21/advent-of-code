const load = require('../loader')

const { intcode } = require('./common')

function address255 (input) {
  const { computers, network } = boot()
  const nat = getNat(computers, network)
  return nat.next().value[1]
}

function monitorNat (input) {
  const { computers, network } = boot()
  const nat = getNat(computers, network)
  let pending, lastY
  while (true) {
    const next = nat.next().value
    if (next) pending = next
    else {
      if (pending[1] === lastY) return lastY
      network[0].push(pending)
      lastY = pending[1]
      pending = null
    }
  }
}

function * getNat (computers, network) {
  while (true) {
    for (let i = 0; i < 50; i++) {
      const c = computers[i]
      if (c.mode === 'i') {
        const incoming = network[i].shift() || [-1]
        incoming.forEach(v => c.next(v))
      } else {
        const address = c.next().value
        const x = c.next().value
        const y = c.next().value
        if (address === 255) yield [x, y]
        else network[address].push([x, y])
      }
    }
    if (computers.every(c => c.mode === 'i') && network.every(q => q.length === 0)) {
      yield
    }
  }
}

function boot (input) {
  const computers = []
  const network = []
  for (let i = 0; i < 50; i++) {
    const c = intcode([...test])
    c.next(i)
    computers.push(c)
    network.push([])
  }
  return { computers, network }
}

const test = load('day23', __dirname).split(',').map(Number)

console.log(address255(test))
console.log(monitorNat(test))
