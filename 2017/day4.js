const load = require('../loader')

function checkPassphase (doc, tokenizer = word => word) {
  const rows = doc.trim().split('\n').map(r => r.split(' '))
  return rows.reduce((sum, row) => {
    const wordlist = {}
    row.forEach(word => {
      const token = tokenizer(word)
      wordlist[token] = wordlist[token] || 0
      wordlist[token]++
    })
    if (Object.keys(wordlist).length === row.length) return sum + 1
    return sum
  }, 0)
}

function normalizeAnagram (word) {
  return word.split('').sort().join('')
}

const test = load('day4', __dirname)

console.log(checkPassphase(test))
console.log(checkPassphase(test, normalizeAnagram))
