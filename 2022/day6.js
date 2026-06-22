const load = require('../loader')

function getStartMarker (input, distinct = 4) {
  for (let index = distinct; index <= input.length; index++) {
    const marker = new Set(input.slice(index - distinct, index))
    if (marker.size === distinct) return index
  }
  return -1
}

const test = load('day6', __dirname)

console.log(getStartMarker(test))
console.log(getStartMarker(test, 14))
