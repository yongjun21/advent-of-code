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

const test = `
Faerun to Tristram = 65
Faerun to Tambi = 129
Faerun to Norrath = 144
Faerun to Snowdin = 71
Faerun to Straylight = 137
Faerun to AlphaCentauri = 3
Faerun to Arbre = 149
Tristram to Tambi = 63
Tristram to Norrath = 4
Tristram to Snowdin = 105
Tristram to Straylight = 125
Tristram to AlphaCentauri = 55
Tristram to Arbre = 14
Tambi to Norrath = 68
Tambi to Snowdin = 52
Tambi to Straylight = 65
Tambi to AlphaCentauri = 22
Tambi to Arbre = 143
Norrath to Snowdin = 8
Norrath to Straylight = 23
Norrath to AlphaCentauri = 136
Norrath to Arbre = 115
Snowdin to Straylight = 101
Snowdin to AlphaCentauri = 84
Snowdin to Arbre = 96
Straylight to AlphaCentauri = 107
Straylight to Arbre = 14
AlphaCentauri to Arbre = 46
`

console.log(findShortestRoute(test))
console.log(findLongestRoute(test))
