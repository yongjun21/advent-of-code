function * dragonCurve (input) {
  let spacers = []
  let spacerIndex = 0
  const original = input.split('').map(char => +char)
  const mirror = original.map(bit => +(!bit)).reverse()
  while (true) {
    const sequence = spacerIndex % 2 === 0 ? original : mirror
    for (let i = 0; i < input.length; i++) {
      yield sequence[i]
    }
    if (spacerIndex > spacers.length - 1) {
      const spacerMirror = spacers.map(bit => +(!bit)).reverse()
      spacers.push(0)
      spacerMirror.forEach(spacer => {
        spacers.push(spacer)
      })
    }
    yield spacers[spacerIndex++]
  }
}

function dragonChecksum (input, diskLength) {
  const data = dragonCurve(input)
  let blockSize = 1
  let checksumLength = diskLength
  while (checksumLength % 2 === 0) {
    blockSize *= 2
    checksumLength /= 2
  }
  let output = ''
  for (let i = 0; i < checksumLength; i++) {
    const block = []
    for (let i = 0; i < blockSize; i++) block.push(data.next().value)
    output += block.reduce((sum, bit) => sum + bit, 0) % 2 === 0 ? '1' : '0'
  }
  return output
}

// function dragonCurve (str, length) {
//   if (str.length >= length) return str.slice(0, length)
//   let pad = '0'
//   for (let i = str.length; i > 0; i--) {
//     pad += str[i - 1] === '0' ? '1' : '0'
//   }
//   return dragonCurve(str + pad, length)
// }

// function shrink (str) {
//   if (str.length % 2 === 1) return str
//   let shrunk = ''
//   for (let i = 0; i < str.length; i += 2) {
//     shrunk += str[i] === str[i + 1] ? '1' : '0'
//   }
//   return shrink(shrunk)
// }

// function dragonChecksum (input, diskLength) {
//   return shrink(dragonCurve(input, diskLength))
// }

const test = '10111100110001111'

console.log(dragonChecksum(test, 272))
console.log(dragonChecksum(test, 35651584))
