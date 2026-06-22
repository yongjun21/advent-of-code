const load = require('../loader')

function checksum (parsed) {
  return parsed.reduce((sum, node) => {
    return sum + node.meta.reduce((s, d) => s + d, 0)
  }, 0)
}

function getValues (parsed) {
  const values = {}

  parsed.forEach(node => {
    if (node.children.length > 0) {
      values[node.id] = node.meta.reduce((s, i) => {
        if (i < 1 || i > node.children.length) return s
        return s + values[node.children[i - 1]]
      }, 0)
    } else {
      values[node.id] = node.meta.reduce((s, d) => s + d, 0)
    }
  })

  return values
}

function parse (input) {
  let id = 0
  let pointer = 0

  const nodes = []
  const stack = []
  stack.push({type: 'header', id: id++})

  while (stack.length > 0) {
    const task = stack.pop()
    if (task.type === 'header') {
      const children = []
      for (let i = 0; i < input[pointer]; i++) {
        children.push(id++)
      }
      stack.push({
        type: 'node',
        id: task.id,
        children,
        size: input[pointer + 1]
      })
      stack.push(...children.map(id => ({type: 'header', id})).reverse())
      pointer += 2
    } else if (task.type === 'node') {
      nodes.push({
        id: task.id,
        children: task.children,
        meta: input.slice(pointer, pointer + task.size)
      })
      pointer += task.size
    }
  }

  return nodes
}

const test = load('day8', __dirname).split(' ').map(v => +v)

const parsed = parse(test)
console.log(checksum(parsed))
console.log(getValues(parsed)[0])
