function computeNumberOfWays(time, distance) {
  let product = 1
  for (let i = 0; i < time.length; i++) {
    const A = 1
    const B = -time[i]
    const C = distance[i]
    const center = -B / 2 / A
    const spread = Math.sqrt(B ** 2 - 4 * A * C) / 2 / A
    const min = Math.ceil(center - spread)
    const max = Math.floor(center + spread)
    product *= max - min + 1
  }
  return product
}

const time = [55, 82, 64, 90]
const distance = [246, 1441, 1012, 1111]

const time2 = [Number(time.map(v => v.toFixed()).join(''))]
const distance2 = [Number(distance.map(v => v.toFixed()).join(''))]

console.log(computeNumberOfWays(time, distance))
console.log(computeNumberOfWays(time2, distance2))
