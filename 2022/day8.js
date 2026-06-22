const load = require('../loader')

function countVisible (input) {
  const [data, w, h] = encodeData(input)
  let visibleCount = w * h
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const height = data[j * w + i]
      let visible = true
      for (let ii = i - 1; ii >= 0; ii--) {
        if (data[j * w + ii] >= height) {
          visible = false
          break
        }
      }
      if (visible) continue
      else visible = true
      for (let ii = i + 1; ii < w; ii++) {
        if (data[j * w + ii] >= height) {
          visible = false
          break
        }
      }
      if (visible) continue
      else visible = true
      for (let jj = j - 1; jj >= 0; jj--) {
        if (data[jj * w + i] >= height) {
          visible = false
          break
        }
      }
      if (visible) continue
      else visible = true
      for (let jj = j + 1; jj < h; jj++) {
        if (data[jj * w + i] >= height) {
          visible = false
          break
        }
      }
      if (visible) continue
      else visibleCount--
    }
  }
  return visibleCount
}

function findHighestScenicScore (input) {
  const [data, w, h] = encodeData(input)
  let highestScore = 0
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const height = data[j * w + i]
      let leftCount = 0
      for (let ii = i - 1; ii >= 0; ii--) {
        leftCount++
        if (data[j * w + ii] >= height) break
      }
      let rightCount = 0
      for (let ii = i + 1; ii < w; ii++) {
        rightCount++
        if (data[j * w + ii] >= height) break
      }
      let upCount = 0
      for (let jj = j - 1; jj >= 0; jj--) {
        upCount++
        if (data[jj * w + i] >= height) break
      }
      let downCount = 0
      for (let jj = j + 1; jj < h; jj++) {
        downCount++
        if (data[jj * w + i] >= height) break
      }
      const score = leftCount * rightCount * upCount * downCount
      highestScore = Math.max(highestScore, score)
    }
  }
  return highestScore
}

function encodeData (input) {
  const w = input[0].length
  const h = input.length
  const data = new Uint8Array(w * h)
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      data[j * w + i] = Number(input[j][i])
    }
  }
  return [data, w, h]
}

const test = load('day8', __dirname).trim().split('\n')

console.log(countVisible(test))
console.log(findHighestScenicScore(test))
