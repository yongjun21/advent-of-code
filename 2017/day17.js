function spinlock (input, loops = 2017) {
  let buffer = [0]
  while (buffer.length <= loops) {
    const current = input % buffer.length
    buffer = [].concat(buffer.length, buffer.slice(current + 1), buffer.slice(0, current + 1))
  }
  return buffer
}

function spinlock2 (input, loops = 50000000) {
  let zeroIndex = 0
  let afterZero = 0
  let bufferLength = 1
  while (bufferLength <= loops) {
    const current = input % bufferLength
    afterZero = current === zeroIndex ? bufferLength : afterZero
    zeroIndex = zeroIndex > current ? (zeroIndex - current) : (bufferLength + zeroIndex - current)
    bufferLength++
  }
  return afterZero
}

const test = 386

console.log(spinlock(test)[1])
console.log(spinlock2(test))
