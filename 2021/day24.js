/* eslint-disable no-multi-spaces */

const assert = require('assert')

const ASCENDING = '123456789'.split('').map(Number)
const DESCENDING = '123456789'.split('').map(Number).reverse()

function findModelNumber (instructions, iter) {
  const [A, B, C] = getABC(instructions)
  let mapping = new Map()
  mapping.set(0, 0)
  for (let k = 0; k < instructions.length / 18; k++) {
    const newMapping = new Map()
    const zs = new Set()
    for (const [w0, z0] of mapping) {
      for (const w of iter) {
        let z = z0
        const cond = (z % 26 + A[k]) === w
        z = Math.floor(z / C[k])
        z = cond ? z : 26 * z + w + B[k]
        if (zs.has(z)) continue
        newMapping.set(w0 * 10 + w, z)
        zs.add(z)
      }
    }
    mapping = newMapping
  }
  for (const [w, z] of mapping) {
    if (z === 0) {
      assert(executeMonad(w.toFixed(), instructions))
      return w
    }
  }
}

function executeMonad (input, instructions) {
  const registers = { w: 0, x: 0, y: 0, z: 0 }
  let pointer = 0
  instructions.forEach((line, i) => {
    let matched
    matched = line.match(/^inp (w|x|y|z)$/)
    if (matched) {
      registers[matched[1]] = Number(input[pointer++])
      return
    }
    matched = line.match(/^(add|mul|div|mod|eql) (w|x|y|z) (w|x|y|z|-?\d+)/)
    const value =
      matched[3] in registers ? registers[matched[3]] : Number(matched[3])
    switch (matched[1]) {
      case 'add':
        registers[matched[2]] += value
        break
      case 'mul':
        registers[matched[2]] *= value
        break
      case 'div':
        registers[matched[2]] = Math.floor(registers[matched[2]] / value)
        break
      case 'mod':
        registers[matched[2]] %=  value
        break
      case 'eql':
        registers[matched[2]] = registers[matched[2]] === value ? 1 : 0
        break
    }
  })
  return registers.z === 0
}

function getABC (instructions) {
  const A = []
  const B = []
  const C = []
  for (let i = 0; i < instructions.length; i += 18) {
    const a = +instructions[i + 5].split(' ').pop()
    const b = +instructions[i + 15].split(' ').pop()
    const c = +instructions[i + 4].split(' ').pop()
    A.push(a)
    B.push(b)
    C.push(c)
  }
  return [A, B, C]
}

const test = [
  'inp w',     // 0  >  w = input
  'mul x 0',   // 1  >  x = 0
  'add x z',   // 2  >  x = z
  'mod x 26',  // 3  >  x = z % 26
  'div z 1',   // 4  >  Z = z // C
  'add x 11',  // 5  >  x = z % 26 + A
  'eql x w',   // 6  >  x = (z % 26 + A) === input ? 1 : 0
  'eql x 0',   // 7  >  x = (z % 26 + A) === input ? 0 : 1
  'mul y 0',   // 8  >  y = 0
  'add y 25',  // 9  >  y = 25
  'mul y x',   // 10  >  y = (z % 26 + A) === input ? 0 : 25
  'add y 1',   // 11  >  y = (z % 26 + A) === input ? 1 : 26
  'mul z y',   // 12  >  Z = (z % 26 + A) === input ? Z : 26 * Z
  'mul y 0',   // 13  >  y = 0
  'add y w',   // 14  >  y = input
  'add y 16',  // 15  >  y = input + B
  'mul y x',   // 16  >  y = (z % 26 + A) === input ? 0 : input + B
  'add z y',   // 17  >  Z = (z % 26 + A) === input ? Z : 26 * Z + input + B
  'inp w',
  'mul x 0',
  'add x z',
  'mod x 26',
  'div z 1',
  'add x 12',
  'eql x w',
  'eql x 0',
  'mul y 0',
  'add y 25',
  'mul y x',
  'add y 1',
  'mul z y',
  'mul y 0',
  'add y w',
  'add y 11',
  'mul y x',
  'add z y',
  'inp w',
  'mul x 0',
  'add x z',
  'mod x 26',
  'div z 1',
  'add x 13',
  'eql x w',
  'eql x 0',
  'mul y 0',
  'add y 25',
  'mul y x',
  'add y 1',
  'mul z y',
  'mul y 0',
  'add y w',
  'add y 12',
  'mul y x',
  'add z y',
  'inp w',
  'mul x 0',
  'add x z',
  'mod x 26',
  'div z 26',
  'add x -5',
  'eql x w',
  'eql x 0',
  'mul y 0',
  'add y 25',
  'mul y x',
  'add y 1',
  'mul z y',
  'mul y 0',
  'add y w',
  'add y 12',
  'mul y x',
  'add z y',
  'inp w',
  'mul x 0',
  'add x z',
  'mod x 26',
  'div z 26',
  'add x -3',
  'eql x w',
  'eql x 0',
  'mul y 0',
  'add y 25',
  'mul y x',
  'add y 1',
  'mul z y',
  'mul y 0',
  'add y w',
  'add y 12',
  'mul y x',
  'add z y',
  'inp w',
  'mul x 0',
  'add x z',
  'mod x 26',
  'div z 1',
  'add x 14',
  'eql x w',
  'eql x 0',
  'mul y 0',
  'add y 25',
  'mul y x',
  'add y 1',
  'mul z y',
  'mul y 0',
  'add y w',
  'add y 2',
  'mul y x',
  'add z y',
  'inp w',
  'mul x 0',
  'add x z',
  'mod x 26',
  'div z 1',
  'add x 15',
  'eql x w',
  'eql x 0',
  'mul y 0',
  'add y 25',
  'mul y x',
  'add y 1',
  'mul z y',
  'mul y 0',
  'add y w',
  'add y 11',
  'mul y x',
  'add z y',
  'inp w',
  'mul x 0',
  'add x z',
  'mod x 26',
  'div z 26',
  'add x -16',
  'eql x w',
  'eql x 0',
  'mul y 0',
  'add y 25',
  'mul y x',
  'add y 1',
  'mul z y',
  'mul y 0',
  'add y w',
  'add y 4',
  'mul y x',
  'add z y',
  'inp w',
  'mul x 0',
  'add x z',
  'mod x 26',
  'div z 1',
  'add x 14',
  'eql x w',
  'eql x 0',
  'mul y 0',
  'add y 25',
  'mul y x',
  'add y 1',
  'mul z y',
  'mul y 0',
  'add y w',
  'add y 12',
  'mul y x',
  'add z y',
  'inp w',
  'mul x 0',
  'add x z',
  'mod x 26',
  'div z 1',
  'add x 15',
  'eql x w',
  'eql x 0',
  'mul y 0',
  'add y 25',
  'mul y x',
  'add y 1',
  'mul z y',
  'mul y 0',
  'add y w',
  'add y 9',
  'mul y x',
  'add z y',
  'inp w',
  'mul x 0',
  'add x z',
  'mod x 26',
  'div z 26',
  'add x -7',
  'eql x w',
  'eql x 0',
  'mul y 0',
  'add y 25',
  'mul y x',
  'add y 1',
  'mul z y',
  'mul y 0',
  'add y w',
  'add y 10',
  'mul y x',
  'add z y',
  'inp w',
  'mul x 0',
  'add x z',
  'mod x 26',
  'div z 26',
  'add x -11',
  'eql x w',
  'eql x 0',
  'mul y 0',
  'add y 25',
  'mul y x',
  'add y 1',
  'mul z y',
  'mul y 0',
  'add y w',
  'add y 11',
  'mul y x',
  'add z y',
  'inp w',
  'mul x 0',
  'add x z',
  'mod x 26',
  'div z 26',
  'add x -6',
  'eql x w',
  'eql x 0',
  'mul y 0',
  'add y 25',
  'mul y x',
  'add y 1',
  'mul z y',
  'mul y 0',
  'add y w',
  'add y 6',
  'mul y x',
  'add z y',
  'inp w',
  'mul x 0',
  'add x z',
  'mod x 26',
  'div z 26',
  'add x -11',
  'eql x w',
  'eql x 0',
  'mul y 0',
  'add y 25',
  'mul y x',
  'add y 1',
  'mul z y',
  'mul y 0',
  'add y w',
  'add y 15',
  'mul y x',
  'add z y'
]

console.log(findModelNumber(test, DESCENDING))
console.log(findModelNumber(test, ASCENDING))
