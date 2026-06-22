const load = require('../loader')

function getPowerConsumption (input) {
  return parseInt(getGammaRate(input), 2) * parseInt(getEpsilonRate(input), 2)
}

function getLifeSupportRating (input) {
  return parseInt(getO2Rating(input), 2) * parseInt(getCO2Rating(input), 2)
}

function getGammaRate (input) {
  let combined = ''
  for (let i = 0; i < input[0].length; i++) {
    let tally = 0
    input.forEach(line => {
      tally += line[i] === '1' ? 1 : -1
    })
    combined += tally > 0 ? '1' : '0'
  }
  return combined
}

function getEpsilonRate (input) {
  let combined = ''
  for (let i = 0; i < input[0].length; i++) {
    let tally = 0
    input.forEach(line => {
      tally += line[i] === '1' ? 1 : -1
    })
    combined += tally <= 0 ? '1' : '0'
  }
  return combined
}

function getO2Rating (input) {
  for (let i = 0; i < input[0].length; i++) {
    let tally = 0
    input.forEach(line => {
      tally += line[i] === '1' ? 1 : -1
    })
    const bit = tally >= 0 ? '1' : '0'
    input = input.filter(line => line[i] === bit)
    if (input.length === 1) return input[0]
  }
}

function getCO2Rating (input) {
  for (let i = 0; i < input[0].length; i++) {
    let tally = 0
    input.forEach(line => {
      tally += line[i] === '1' ? 1 : -1
    })
    const bit = tally < 0 ? '1' : '0'
    input = input.filter(line => line[i] === bit)
    if (input.length === 1) return input[0]
  }
}

const test = load('day3', __dirname).trim().split('\n')

console.log(getPowerConsumption(test))
console.log(getLifeSupportRating(test))
