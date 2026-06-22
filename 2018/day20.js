const load = require('../loader')

function furthestRoom (rooms) {
  return Object.values(rooms)
    .reduce((max, moves) => moves > max ? moves : max, -Infinity)
}

function roomsFurtherThan (rooms, n) {
  return Object.values(rooms).filter(moves => moves >= n).length
}

function reachRooms (input) {
  const tree = buildTree(input)

  const doors = {}

  const DIRECTIONS = {
    N: [0, 1],
    S: [0, -1],
    E: [1, 0],
    W: [-1, 0]
  }

  function explore ([x, y], moves) {
    moves.forEach(move => {
      const [dx, dy] = DIRECTIONS[move]
      doors[[x + dx, y + dy]] = true
      x += 2 * dx
      y += 2 * dy
    })
    return [x, y]
  }

  traverseTree(tree, explore, [0, 0])

  const directions = Object.values(DIRECTIONS)

  const visited = {}
  const unvisited = []
  unvisited.push([[0, 0], 0])
  while (unvisited.length > 0) {
    const [room, moves] = unvisited.shift()
    if (room in visited) continue
    visited[room] = moves
    directions.forEach(direction => {
      const door = [room[0] + direction[0], room[1] + direction[1]]
      if (door in doors) {
        unvisited.push([
          [room[0] + 2 * direction[0], room[1] + 2 * direction[1]],
          moves + 1
        ])
      }
    })
  }

  return visited
}

function buildTree (input) {
  let index = 1
  const root = new Node(index, null)
  let current = root
  do {
    if (input[index] === '(') {
      current = current.addChild(index)
    } else if (input[index] === '|') {
      current = current.addSibling(index)
    } else if (input[index] === ')') {
      current = current.parent.addNext(index)
    } else {
      current.addMove(input[index])
    }
  } while (++index < input.length - 1)
  return root
}

function traverseTree (root, cb, init) {
  const visited = {}
  const stack = []
  stack.push([init, root, []])
  while (stack.length > 0) {
    const [input, node, nextNodes] = stack.pop()
    const key = [input, node]
    if (key in visited) continue
    visited[key] = true
    const output = cb(input, node.moves)
    if (node.children.length > 0) {
      node.children.forEach(child => {
        stack.push([output, child, nextNodes.concat(node.next)])
      })
    } else {
      const next = nextNodes.pop()
      if (next) {
        stack.push([output, next, nextNodes])
      }
    }
  }
}

class Node {
  constructor (id, parent) {
    this.id = id
    this.parent = parent
    this.children = []
    this.moves = []
  }

  addMove (move) {
    this.moves.push(move)
  }

  addChild (id) {
    const child = new Node(id, this)
    this.children.push(child)
    return child
  }

  addSibling (id) {
    return this.parent.addChild(id)
  }

  addNext (id) {
    const next = new Node(id, this.parent)
    this.next = next
    return next
  }

  toString () {
    return this.id
  }
}

const test = load('day20', __dirname)

const rooms = reachRooms(test)
console.log(furthestRoom(rooms))
console.log(roomsFurtherThan(rooms, 1000))
