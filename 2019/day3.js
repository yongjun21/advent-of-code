const load = require('../loader')

function getNearestByManhatten (a, b) {
  const intersections = getIntersections(a, b)
  return intersections
    .map(i => Math.abs(i[0]) + Math.abs(i[1]))
    .reduce((min, d) => d < min ? d : min)
}

function getNearestBySteps (a, b) {
  const intersections = getIntersections(a, b)
  return intersections
    .map(i => i[2] + i[3])
    .reduce((min, d) => d < min ? d : min)
}

function getIntersections (a, b) {
  const aVisited = {}
  const bVisited = {}
  const offset = {
    U: [0, 1],
    R: [1, 0],
    D: [0, -1],
    L: [-1, 0]
  }
  function walk (seq, visited) {
    const xy = [0, 0]
    let d = 0
    seq.forEach(step => {
      const o = offset[step[0]]
      let n = +step.slice(1)
      while (n-- > 0) {
        xy[0] += o[0]
        xy[1] += o[1]
        d++
        if (visited[xy] == null) visited[xy] = d
      }
    })
  }
  walk(a, aVisited)
  walk(b, bVisited)
  const intersections = []
  Object.keys(aVisited).forEach(key => {
    if (key in bVisited) {
      const intersection = key.split(',').map(Number)
      intersection.push(aVisited[key], bVisited[key])
      intersections.push(intersection)
    }
  })
  return intersections
}

const [test1, test2] = load('day3', __dirname).split('\n').map(line => line.split(','))

console.log(getNearestByManhatten(test1, test2))
console.log(getNearestBySteps(test1, test2))
