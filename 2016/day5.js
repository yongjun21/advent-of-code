const md5 = require('md5')

function findPassword (str) {
  let password = ''
  let i = 0
  while (password.length < 8) {
    const hash = md5(str + i++)
    if (hash.slice(0, 5) === '00000') {
      password += hash[5]
      console.log(password, i - 1)
    }
  }
  return password
}

function findPassword2 (str) {
  let password = []
  let found = 0
  let i = 0
  while (found < 8) {
    const hash = md5(str + i++)
    if (hash.slice(0, 5) === '00000') {
      if (hash[5].match(/[0-7]/)) {
        if (hash[5] in password) continue
        password[hash[5]] = hash[6]
        found++
        console.log(password.join(''), i - 1)
      }
    }
  }
  return password.join('')
}

const test = 'ugkcyxxp'

console.log(findPassword(test))
console.log(findPassword2(test))
