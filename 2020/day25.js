function calculateEncryptionKey (input) {
  let value = 1
  let n = 0
  while (value !== input[0]) {
    value = (value * 7) % 20201227
    n++
  }

  value = 1
  while (n-- > 0) {
    value = (value * input[1]) % 20201227
  }
  return value
}

const test = [10943862, 12721030]

console.log(calculateEncryptionKey(test))
