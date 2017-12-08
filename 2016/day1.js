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
  for (let step of input) {
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

const test = ['L1', 'L5', 'R1', 'R3', 'L4', 'L5', 'R5', 'R1', 'L2', 'L2', 'L3', 'R4', 'L2', 'R3', 'R1', 'L2', 'R5', 'R3', 'L4', 'R4', 'L3', 'R3', 'R3', 'L2', 'R1', 'L3', 'R2', 'L1', 'R4', 'L2', 'R4', 'L4', 'R5', 'L3', 'R1', 'R1', 'L1', 'L3', 'L2', 'R1', 'R3', 'R2', 'L1', 'R4', 'L4', 'R2', 'L189', 'L4', 'R5', 'R3', 'L1', 'R47', 'R4', 'R1', 'R3', 'L3', 'L3', 'L2', 'R70', 'L1', 'R4', 'R185', 'R5', 'L4', 'L5', 'R4', 'L1', 'L4', 'R5', 'L3', 'R2', 'R3', 'L5', 'L3', 'R5', 'L1', 'R5', 'L4', 'R1', 'R2', 'L2', 'L5', 'L2', 'R4', 'L3', 'R5', 'R1', 'L5', 'L4', 'L3', 'R4', 'L3', 'L4', 'L1', 'L5', 'L5', 'R5', 'L5', 'L2', 'L1', 'L2', 'L4', 'L1', 'L2', 'R3', 'R1', 'R1', 'L2', 'L5', 'R2', 'L3', 'L5', 'L4', 'L2', 'L1', 'L2', 'R3', 'L1', 'L4', 'R3', 'R3', 'L2', 'R5', 'L1', 'L3', 'L3', 'L3', 'L5', 'R5', 'R1', 'R2', 'L3', 'L2', 'R4', 'R1', 'R1', 'R3', 'R4', 'R3', 'L3', 'R3', 'L5', 'R2', 'L2', 'R4', 'R5', 'L4', 'L3', 'L1', 'L5', 'L1', 'R1', 'R2', 'L1', 'R3', 'R4', 'R5', 'R2', 'R3', 'L2', 'L1', 'L5']

console.log(getManhattenDistance(test))
console.log(getManhattenDistance(test, true))
