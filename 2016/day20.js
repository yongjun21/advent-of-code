const load = require('../loader')

function findNotBlocked (input) {
  const blocked = input.trim().split('\n').map(line => {
    return line.split('-').map(v => +v)
  })

  const notBlocked = []
  let i = 0

  const bit32 = Math.pow(2, 32)
  while (true) {
    let repeat
    do {
      repeat = false
      blocked.forEach(range => {
        if (i >= range[0] && i <= range[1]) {
          i = range[1] + 1
          repeat = true
        }
      })
    } while (repeat)
    if (i < bit32) notBlocked.push(i++)
    else break
  }

  return notBlocked
}

const test = load('day20', __dirname)

console.log(findNotBlocked(test)[0])
console.log(findNotBlocked(test).length)
