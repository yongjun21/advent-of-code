const load = require('../loader')

function mostCommon (freq) {
  return Object.keys(freq).sort((a, b) => freq[b] - freq[a])[0]
}

function leastCommon (freq) {
  return Object.keys(freq).sort((a, b) => freq[a] - freq[b])[0]
}

function errorCorrect (input, decodeFromFreq = mostCommon) {
  const matrix = input.trim().split('\n').map(line => line.split(''))
  let message = ''
  for (let j = 0; j < 8; j++) {
    const frequencies = {}
    matrix.forEach(row => {
      const letter = row[j]
      frequencies[letter] = frequencies[letter] || 0
      frequencies[letter]++
    })
    message += decodeFromFreq(frequencies)
  }
  return message
}

const test = load('day6', __dirname)

console.log(errorCorrect(test))
console.log(errorCorrect(test, leastCommon))
