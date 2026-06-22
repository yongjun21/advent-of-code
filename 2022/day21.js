const load = require('../loader')

const OPERATIONS = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b
}

function resolveRoot (input) {
  const nodes = getNodes(input)
  Object.values(nodes).forEach(node => node.prime())
  Object.values(nodes).forEach(node => node.resolve())
  return nodes.root.value
}

function resolveHumn (input) {
  const nodes = getNodes(input)
  delete nodes.humn.value
  nodes.root.value = 0
  nodes.root.operation = '-'

  Object.values(nodes).forEach(node => node.prime())
  Object.values(nodes).forEach(node => node.resolve())

  const regeneratedNodes = {}
  Object.values(nodes).forEach(node => {
    node.onResolve = []
    if (!node.upstreams) return
    const [a, b] = node.upstreams
    if (nodes[a].resolved && !nodes[b].resolved) {
      const clone = nodes[b].clone()
      regeneratedNodes[clone.key] = clone
      if (node.operation === '+') {
        clone.upstreams = [node.key, a]
        clone.operation = '-'
      } else if (node.operation === '-') {
        clone.upstreams = [a, node.key]
        clone.operation = '-'
      } else if (node.operation === '*') {
        clone.upstreams = [node.key, a]
        clone.operation = '/'
      } else if (node.operation === '/') {
        clone.upstreams = [a, node.key]
        clone.operation = '/'
      }
    }
    if (!nodes[a].resolved && nodes[b].resolved) {
      const clone = nodes[a].clone()
      regeneratedNodes[clone.key] = clone
      if (node.operation === '+') {
        clone.upstreams = [node.key, b]
        clone.operation = '-'
      } else if (node.operation === '-') {
        clone.upstreams = [b, node.key]
        clone.operation = '+'
      } else if (node.operation === '*') {
        clone.upstreams = [node.key, b]
        clone.operation = '/'
      } else if (node.operation === '/') {
        clone.upstreams = [b, node.key]
        clone.operation = '*'
      }
    }
  })
  delete regeneratedNodes.humn.value
  Object.assign(nodes, regeneratedNodes)

  Object.values(nodes).forEach(node => node.prime())
  Object.values(nodes).forEach(node => node.resolve())
  return nodes.humn.value
}

function getNodes (input) {
  const state = {}
  class Node {
    constructor (line) {
      const [lhs, rhs] = line.split(': ')
      this.key = lhs
      this.onResolve = []
      this.resolved = false

      const matched = rhs.match(/^([a-z]{4}) ([+\-*/]) ([a-z]{4})$/)
      if (!matched) {
        this.value = +rhs
      } else {
        this.upstreams = [matched[1], matched[3]]
        this.operation = matched[2]
      }
    }

    prime () {
      if (!this.upstreams) return
      this.upstreams.forEach(key => {
        state[key].onResolve.push(() => this.resolve())
      })
    }

    resolve () {
      if (this.resolved) return
      if (this.value != null) {
        this.onResolve.forEach(fn => fn(this.value))
        this.resolved = true
      } else if (this.upstreams) {
        const upstreamValues = this.upstreams.map(key => state[key].value)
        if (upstreamValues.every(v => v != null)) {
          this.value = OPERATIONS[this.operation](...upstreamValues)
          this.onResolve.forEach(fn => fn(this.value))
          this.resolved = true
        }
      }
    }

    clone () {
      if (this.upstreams) {
        return new Node(`${this.key}: ${this.upstreams[0]} ${this.operation} ${this.upstreams[1]}`)
      } else {
        return new Node(`${this.key}: ${this.value ?? 0}`)
      }
    }
  }
  input.forEach(line => {
    const node = new Node(line)
    state[node.key] = node
  })
  return state
}

const test = load('day21', __dirname).trim().split('\n')

console.log(resolveRoot(test))
console.log(resolveHumn(test))
