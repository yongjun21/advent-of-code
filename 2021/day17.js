function findHighestY (targetX, targetY) {
  const maxVY = -targetY[0] - 1
  return maxVY * (maxVY + 1) / 2
}

function findEveryInitial (targetX, targetY) {
  const maxVX = targetX[1]
  const minVY = targetY[0]
  const maxVY = -targetY[0]
  let count = 0
  for (let vx = 0; vx <= maxVX; vx++) {
    for (let vy = minVY; vy <= maxVY; vy++) {
      if (testV0([vx, vy], targetX, targetY)) count++
    }
  }
  return count
}

function testV0 (v0, targetX, targetY) {
  const s = [0, 0]
  const v = [...v0]
  while (s[0] <= targetX[1] && s[1] >= targetY[0]) {
    if (s[0] >= targetX[0] && s[1] <= targetY[1]) return true
    s[0] += v[0]
    s[1] += v[1]
    v[0] = Math.max(v[0] - 1, 0)
    v[1] -= 1
  }
  return false
}

const targetX = [102, 157]
const targetY = [-146, -90]

console.log(findHighestY(targetX, targetY))
console.log(findEveryInitial(targetX, targetY))
