const {knot, knotHash} = require('./common')

const test = '18,1,0,161,255,137,254,252,14,95,165,33,181,168,2,188'

console.log(knot(test.split(',').map(v => +v)).slice(0, 2))
console.log(knotHash(test))
