const load = require('../loader')

const {getPermutations} = require('../helpers')

function parseInput (input) {
  const distance = {}
  const locations = {}
  input.trim().split('\n').forEach(line => {
    const match = line.match(/^(.*) to (.*) = ([0-9]*)$/)
    distance[[match[1], match[2]].join('.')] = +match[3]
    distance[[match[2], match[1]].join('.')] = +match[3]
    locations[match[1]] = 1
    locations[match[2]] = 1
  })
  return {distance, locations: Object.keys(locations)}
}

function findTotalDistance (input) {
  const {distance: distanceMatrix, locations} = parseInput(input)

  const paths = getPermutations(locations)

  return paths.map(path => {
    let distance = 0
    for (let i = 1; i < path.length; i++) {
      distance += distanceMatrix[[path[i - 1], path[i]].join('.')]
    }
    return {path, distance}
  })
}

function findShortestRoute (input) {
  return Math.min(...findTotalDistance(input).map(route => route.distance))
}

function findLongestRoute (input) {
  return Math.max(...findTotalDistance(input).map(route => route.distance))
}

const test = load('day9', __dirname)

console.log(findShortestRoute(test))
console.log(findLongestRoute(test))
