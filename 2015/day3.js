const load = require('../loader')

function oneSanta (directions) {
  const visited = {}
  const santa = new Santa(visited)
  directions.split('').forEach(direction => {
    santa.walk(direction)
  })
  return Object.keys(visited).length
}

function twoSantas (directions) {
  const visited = {}
  const santaOne = new Santa(visited)
  const santaTwo = new Santa(visited)
  directions = directions.split('').reverse()
  while (directions.length > 0) {
    santaOne.walk(directions.pop())
    santaTwo.walk(directions.pop())
  }
  return Object.keys(visited).length
}

class Santa {
  constructor (visited) {
    this.current = [0, 0]
    this.visited = visited
    this.record()
  }

  walk (direction) {
    switch (direction) {
      case '>':
        this.current[0]++
        break
      case '<':
        this.current[0]--
        break
      case '^':
        this.current[1]++
        break
      case 'v':
        this.current[1]--
        break
    }
    this.record()
  }

  record () {
    const address = this.current.join('.')
    this.visited[address] = this.visited[address] || 0
    this.visited[address]++
  }
}

const test = load('day3', __dirname)

console.log(oneSanta(test))
console.log(twoSantas(test))
