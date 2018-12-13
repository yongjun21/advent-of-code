function getPower (x, y, serial) {
  const rackId = x + 10
  let power = rackId * y
  power += serial
  power *= rackId
  power = Math.floor((power % 1000) / 100)
  power -= 5
  return power
}

function getTotalPower (input) {
  const power = []
  for (let j = 1; j <= 300; j++) {
    const row = []
    for (let i = 1; i <= 300; i++) {
      row.push(getPower(i, j, input))
    }
    power.push(row)
  }

  const cumRow = power.map(row => {
    return row.map((v, i) => {
      let sum = 0
      return row.slice(i).map(v => {
        sum += v
        return sum
      })
    })
  })
  const cumCol = transpose(power).map(col => {
    return col.map((v, j) => {
      let sum = 0
      return col.slice(j).map(v => {
        sum += v
        return sum
      })
    })
  })

  return power.map((row, j) => {
    return row.map((v, i) => {
      const maxSize = Math.min(300 - i, 300 - j)
      const totalPower = []
      let prev = v
      totalPower.push(prev)
      for (let k = 1; k < maxSize; k++) {
        prev += cumRow[j + k][i][k - 1]
        prev += cumCol[i + k][j][k]
        totalPower.push(prev)
      }
      return totalPower
    })
  })
}

function findLargest (totalPower, sizeRange = [3, 3]) {
  let maxPower = -Infinity
  let maxX, maxY, maxSize
  for (let j = 0; j < 300; j++) {
    for (let i = 0; i < 300; i++) {
      for (let k = sizeRange[0] - 1; k <= sizeRange[1] - 1; k++) {
        if (i + k + 1 > 300 || j + k + 1 > 300) continue
        if (totalPower[j][i][k] > maxPower) {
          maxPower = totalPower[j][i][k]
          maxX = i + 1
          maxY = j + 1
          maxSize = k + 1
        }
      }
    }
  }
  return [maxX, maxY, maxSize].join(',')
}

function transpose (matrix) {
  return matrix[0].map((v, i) => matrix.map(row => row[i]))
}

const test = 8141

const totalPower = getTotalPower(test)

console.log(findLargest(totalPower))
console.log(findLargest(totalPower, [1, 300]))
