const load = require('../loader')

function getManhattenDistance (input, terminateEarly) {
  const visited = {}
  const location = [0, 0]
  const offsets = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
  ]
  let direction = 0
  for (const step of input) {
    const turn = step[0]
    const blocks = +step.slice(1)
    direction += turn === 'R' ? 1 : -1
    direction = (direction + 4) % 4
    const offset = offsets[direction]
    for (let n = blocks; n > 0; n--) {
      visited[location.join('.')] = true
      location[0] += offset[0]
      location[1] += offset[1]
      if (terminateEarly && location.join('.') in visited) {
        return Math.abs(location[0]) + Math.abs(location[1])
      }
    }
  }
  return Math.abs(location[0]) + Math.abs(location[1])
}

const test = load('day1', __dirname).split('\n')

console.log(getManhattenDistance(test))
console.log(getManhattenDistance(test, true))
