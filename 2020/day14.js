const load = require('../loader')

const BIT16 = 2 ** 16

function emulate (input) {
  let mask
  const registers = {}
  input.forEach(row => {
    if (row.type === 'mask') {
      mask = decodeMask(row.value)
    } else if (row.type === 'mem') {
      registers[row.address] = bitOR(mask.or, bitAND(mask.and, row.value))
    }
  })
  return Object.values(registers).reduce((sum, v) => sum + v, 0)
}

function emulate2 (input) {
  let mask
  const registers = {}
  input.forEach(row => {
    if (row.type === 'mask') {
      mask = decodeMask(row.value)
    } else if (row.type === 'mem') {
      const address = bitAND(mask.reset, bitOR(mask.or, row.address))
      mask.combi.forEach(v => {
        registers[address + v] = row.value
      })
    }
  })
  return Object.values(registers).reduce((sum, v) => sum + v, 0)
}

function decodeMask (str) {
  const bits = str.split('').reverse()
  let base = 1
  let and = 0
  let or = 0
  let reset = 0
  let combi = [0]
  bits.forEach(char => {
    if (char === '1') or += base
    if (char !== '0') and += base
    if (char !== 'X') reset += base
    if (char === 'X') {
      combi = [...combi, ...combi.map(v => v + base)]
    }
    base *= 2
  })
  return { and, or, reset, combi }
}

function bitAND (a, b) {
  if (a > b) [a, b] = [b, a]
  a = decompose(a)
  b = decompose(b)
  const out = a.map((v, i) => v & b[i])
  return recompose(out)
}

function bitOR (a, b) {
  if (a < b) [a, b] = [b, a]
  a = decompose(a)
  b = decompose(b)
  const out = a.map((v, i) => b[i] ? (v | b[i]) : v)
  return recompose(out)
}

function decompose (v) {
  const decomposed = []
  while (v >= BIT16) {
    decomposed.push(v % BIT16)
    v = Math.floor(v / BIT16)
  }
  decomposed.push(v)
  return decomposed
}

function recompose (v) {
  return v.reduce((sum, v, i) => sum + v * BIT16 ** i, 0)
}

function parse (line) {
  const matched = line.match(/^(mask|mem)(?:\[(\d+)])? = (.+)$/)
  if (matched[1] === 'mask') {
    return {
      type: 'mask',
      value: matched[3]
    }
  } else if (matched[1] === 'mem') {
    return {
      type: 'mem',
      address: matched[2],
      value: +matched[3]
    }
  }
}

const test = load('day14', __dirname).trim().split('\n').map(parse)

console.log(emulate(test))
console.log(emulate2(test))
