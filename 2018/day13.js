const fs = require('fs')

function predictFirstCrash (input) {
  const carts = mapCartsAndTracks(input)
  let collision
  while (!collision) {
    carts.sort()
    collision = carts.find(cart => {
      cart.next()
      return cart.collide()
    })
  }
  return collision.location
}

function predictLastCar (input) {
  const carts = mapCartsAndTracks(input)
  do {
    carts.sort()
    carts.forEach(cart => {
      if (cart.removed) return
      cart.next()
      const collision = cart.collide()
      if (collision) {
        cart.removed = true
        collision.removed = true
      }
    })
  } while (carts.filter(cart => !cart.removed).length > 1)
  return carts.find(cart => !cart.removed).location
}

function mapCartsAndTracks (input) {
  const tracks = input.split('\n').map(line => line.split(''))
  const carts = []

  tracks.forEach((row, y) => {
    row.forEach((type, x) => {
      if (type === '>' || type === '<') {
        row[x] = '-'
        carts.push({
          direction: type === '>' ? 1 : 3,
          location: [x, y],
          decision: -1,
          collide,
          next
        })
      } else if (type === '^' || type === 'v') {
        row[x] = '|'
        carts.push({
          direction: type === '^' ? 0 : 2,
          location: [x, y],
          decision: -1,
          collide,
          next
        })
      }
    })
  })

  const OFFSET = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0]
  ]

  function collide () {
    return carts.find(cart => {
      if (cart.removed) return false
      return cart !== this &&
        cart.location[0] === this.location[0] &&
        cart.location[1] === this.location[1]
    })
  }

  function next () {
    const type = tracks[this.location[1]][this.location[0]]
    if (type === '+') {
      this.direction += this.decision
      if (this.direction < 0) this.direction += 4
      else if (this.direction > 3) this.direction -= 4
      this.decision++
      if (this.decision > 1) this.decision = -1
    } else if (type === '/' && this.direction === 0) {
      this.direction = 1
    } else if (type === '/' && this.direction === 1) {
      this.direction = 0
    } else if (type === '/' && this.direction === 2) {
      this.direction = 3
    } else if (type === '/' && this.direction === 3) {
      this.direction = 2
    } else if (type === '\\' && this.direction === 0) {
      this.direction = 3
    } else if (type === '\\' && this.direction === 1) {
      this.direction = 2
    } else if (type === '\\' && this.direction === 2) {
      this.direction = 1
    } else if (type === '\\' && this.direction === 3) {
      this.direction = 0
    }
    this.location[0] += OFFSET[this.direction][0]
    this.location[1] += OFFSET[this.direction][1]
    return this.location
  }

  function sort () {
    Array.prototype.sort.call(this, (a, b) => {
      if (a.location[1] < b.location[1]) return -1
      if (a.location[1] > b.location[1]) return 1
      return a.location[0] < b.location[0]
    })
  }

  carts.sort = sort
  return carts
}

const test = fs.readFileSync('2018/input/day13.txt', {encoding: 'utf8'})

console.log(predictFirstCrash(test))
console.log(predictLastCar(test))
