'use strict'

const alphabet = 'abcdefghijklmnopqrstuvwxyz'

const straights = []
for (let i = 0; i < alphabet.length - 2; i++) {
  straights.push(alphabet.slice(i, i + 3))
}

const requirements = [
  test => straights.some(straight => test.indexOf(straight) > -1),
  test => !test.match(/(i|o|l)/),
  test => {
    const match = test.match(/(.)\1.*(.)\2/)
    return match && match[1] !== match[2]
  }
]

function nextPassword (current) {
  let next = current.split('')
  let i = next.length - 1
  while (i >= 0) {
    if (next[i] === 'z') {
      next[i--] = 'a'
    } else {
      next[i] = alphabet[alphabet.indexOf(next[i]) + 1]
      break
    }
  }

  next = next.join('')

  if (requirements.every(req => req(next))) return next
  return nextPassword(next)
}

const test = 'hepxcrrq'

const reset = nextPassword(test)
const resetAgain = nextPassword(reset)

console.log(reset)
console.log(resetAgain)
