function knot (input, hashLength = 256) {
  let output = []
  for (let i = 0; i < hashLength; i++) output.push(i)

  let current = 0
  let skip = 0

  input.forEach(length => {
    const section = output.concat(output).slice(current, current + length)
    for (let i = current; i < current + length; i++) {
      output[i % hashLength] = section.pop()
    }
    current = (current + length + skip++) % hashLength
  })

  return output
}

function knotHash (input, secretKey = [17, 31, 73, 47, 23]) {
  const ascii = input.split('').map(char => char.charCodeAt(0))
  const lengthSeq = []
  for (let i = 0; i < 64; i++) {
    lengthSeq.push(...ascii)
    lengthSeq.push(...secretKey)
  }
  const sparseHash = knot(lengthSeq)
  const denseHash = []
  for (let i = 0; i < 256; i += 16) {
    denseHash.push(sparseHash.slice(i, i + 16).reduce((xor, v) => xor ^ v, 0))
  }
  return denseHash
    .map(v => v.toString(16))
    .map(v => v.length < 2 ? ('0' + v) : v)
    .join('')
}

module.exports = {knot, knotHash}
