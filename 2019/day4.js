function findPasswords (input, meetsCriteria) {
  const passwords = []
  for (let n = input[0]; n <= input[1]; n++) {
    const digits = getDigits(n).reverse()
    if (meetsCriteria(digits)) passwords.push(n)
  }
  return passwords
}

function meetsCriteria (digits) {
  let prev = digits[0]
  let meet = false
  for (let i = 1; i < digits.length; i++) {
    if (digits[i] < prev) return false
    meet = meet || digits[i] === prev
    prev = digits[i]
  }
  return meet
}

function meetsCriteria2 (digits) {
  let prev = digits[0]
  let run = 1
  let meet = false
  for (let i = 1; i < digits.length; i++) {
    if (digits[i] < prev) return false
    if (digits[i] === prev) run++
    else if (run === 2) meet = true
    else run = 1
    prev = digits[i]
  }
  return meet || run === 2
}

function getDigits (n) {
  const digits = []
  while (n >= 1) {
    const d = n % 10
    digits.push(d)
    n = (n - d) / 10
  }
  if (digits.length === 0) digits.push(0)
  return digits
}

const test = [271973, 785961]

console.log(findPasswords(test, meetsCriteria).length)
console.log(findPasswords(test, meetsCriteria2).length)
