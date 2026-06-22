const load = require('../loader')

const { parseBatch } = require('./common')

const REQUIRED = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']
const EYE_COLORS = new Set(['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'])

function countValid (input, test) {
  const parsed = parseBatch(input, (line, datum) => {
    line.split(' ').forEach(pair => {
      const [key, value] = pair.split(':')
      datum[key] = value
    })
  })
  return parsed.filter(test).length
}

function hasRequired (datum) {
  return REQUIRED.every(key => key in datum)
}

function validFields (datum) {
  if (!hasRequired(datum)) return false
  if (datum.byr.length !== 4 || datum.byr < '1920' || datum.byr > '2002') return false
  if (datum.iyr.length !== 4 || datum.iyr < '2010' || datum.iyr > '2020') return false
  if (datum.eyr.length !== 4 || datum.eyr < '2020' || datum.eyr > '2030') return false
  const matchedHeight = datum.hgt.match(/^(\d+)(cm|in)$/)
  if (!matchedHeight) return false
  matchedHeight[1] = +matchedHeight[1]
  if (matchedHeight[2] === 'cm') {
    if (matchedHeight[1] < 150 || matchedHeight[1] > 193) return false
  } else if (matchedHeight[2] === 'in') {
    if (matchedHeight[1] < 59 || matchedHeight[1] > 76) return false
  }
  if (!/^#[0-9a-f]{6}$/.test(datum.hcl)) return false
  if (!EYE_COLORS.has(datum.ecl)) return false
  if (!/^\d{9}$/.test(datum.pid)) return false
  return true
}

const test = load('day4', __dirname)

console.log(countValid(test, hasRequired))
console.log(countValid(test, validFields))
