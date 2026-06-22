const load = require('../loader')

const alphabet = 'abcdefghijklmnopqrstuvwxyz'

function dance (input, order = alphabet.slice(0, 16)) {
  order = order.split('')

  input.trim().split(',').forEach(block => {
    let a, b, i, j, n
    switch (block[0]) {
      case 's':
        n = +block.slice(1)
        order = order.slice(-n).concat(order.slice(0, -n))
        break
      case 'x':
        [i, j] = block.slice(1).split('/')
        a = order[i]
        b = order[j]
        order[i] = b
        order[j] = a
        break
      case 'p':
        [a, b] = block.slice(1).split('/')
        i = order.indexOf(a)
        j = order.indexOf(b)
        order[i] = b
        order[j] = a
        break
    }
  })

  return order.join('')
}

function repeatDance (times, input, order = alphabet.slice(0, 16)) {
  const initialOrder = order
  let cycle = 1
  const cache = []
  while (times - cycle >= 0) {
    cache.push(order)
    order = dance(input, order)
    if (order === initialOrder) break
    cycle++
  }
  if (cycle < times) order = cache[times % cycle]
  return order
}

const test = load('day16', __dirname)

console.log(dance(test))
console.log(repeatDance(1000000000, test))
