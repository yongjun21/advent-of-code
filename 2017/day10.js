const load = require('../loader')

const {knot, knotHash} = require('./common')

const test = load('day10', __dirname)

console.log(knot(test.split(',').map(v => +v)).slice(0, 2))
console.log(knotHash(test))
