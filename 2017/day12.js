const load = require('../loader')

function findConnectedGroup (input) {
  const groups = []

  const connections = input.trim().split('\n').map(line => {
    const [from, to] = line.split(' <-> ')
    return {
      from,
      to: to.split(', ')
    }
  })

  while (connections.length > 0) {
    const seed = connections[0].from
    const connected = {[seed]: 1}
    let size
    do {
      size = Object.keys(connected).length
      for (let i = 0, connection = connections[0]; i < connections.length; connection = connections[++i]) {
        if (connection.from in connected) {
          connection.to.forEach(item => {
            connected[item] = 1
          })
          connections.splice(i--, 1)
        } else if (connection.to.some(item => item in connected)) {
          connected[connection.from] = 1
        }
      }
    } while (Object.keys(connected).length > size)
    groups.push(Object.keys(connected))
  }

  return groups
}

const test = load('day12', __dirname)
const groups = findConnectedGroup(test)
console.log(groups.find(g => g.includes('0')).length)
console.log(groups.length)
