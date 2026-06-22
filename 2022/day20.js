const load = require('../loader')

const DECRYPTION_KEY = 811589153

function getGroveCoordinates (input, times = 1) {
  const nodes = input.map(value => ({ value }))
  for (let i = 1; i < nodes.length; i++) {
    nodes[i - 1].next = nodes[i]
    nodes[i].prev = nodes[i - 1]
  }
  nodes[0].prev = nodes[nodes.length - 1]
  nodes[nodes.length - 1].next = nodes[0]

  while (times-- > 0) {
    nodes.forEach(node => {
      let cursor = node.prev
      node.prev.next = node.next
      node.next.prev = node.prev
      let n = node.value % (nodes.length - 1)
      if (n < 0) n += nodes.length - 1
      while (n-- > 0) cursor = cursor.next
      const next = cursor.next
      cursor.next = node
      next.prev = node
      node.prev = cursor
      node.next = next
    })
  }

  let cursor = nodes.find(node => node.value === 0)
  let sum = 0
  let n = 0
  ;[1000, 2000, 3000].forEach(index => {
    while (n++ < index) cursor = cursor.next
    sum += cursor.value
    n--
  })
  return sum
}

function getGroveCoordinates2 (input) {
  return getGroveCoordinates(input.map(v => v * DECRYPTION_KEY), 10)
}

const test = load('day20', __dirname).trim().split('\n').map(Number)

console.log(getGroveCoordinates(test))
console.log(getGroveCoordinates2(test))
