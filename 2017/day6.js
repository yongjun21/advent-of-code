function reallocateMemory (arr) {
  arr = [...arr]
  let step = 0
  const states = {}
  while (!(arr.join('.') in states)) {
    states[arr.join('.')] = step++
    const max = Math.max(...arr)
    const maxIndex = arr.findIndex(v => v === max)
    const count = arr[maxIndex]
    arr[maxIndex] = 0
    for (let i = maxIndex + 1; i <= maxIndex + count; i++) {
      arr[i % arr.length]++
    }
  }
  return {step: step, loop: step - states[arr.join('.')]}
}

const test = [2, 8, 8, 5, 4, 2, 3, 1, 5, 5, 1, 2, 15, 13, 5, 14]

console.log(reallocateMemory(test))
