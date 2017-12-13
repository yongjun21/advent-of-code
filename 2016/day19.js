function whiteElephant (n) {
  const arr = Array(n).fill(1)
  let k = 0
  let i = 1
  let skip = false
  while (k < n - 1) {
    if (arr[i] === 1) {
      if (skip) {
        skip = false
      } else {
        arr[i] = 0
        k++
        skip = true
      }
    }
    i = (i + 1) % n
  }
  return arr.indexOf(1) + 1
}

function whiteElephant2 (n) {
  const arr = Array(n).fill(1)
  let k = 0
  let i = Math.floor(n / 2)
  let skip = false
  while (k < n - 1) {
    if (arr[i] === 1) {
      if (skip) {
        skip = false
      } else {
        arr[i] = 0
        k++
        skip = (n + k) % 2 === 0
      }
    }
    i = (i + 1) % n
  }
  return arr.indexOf(1) + 1
}

const test = 3012210

console.log(whiteElephant(test))
console.log(whiteElephant2(test))
