function findLargestArea (input) {
  const xs = input.map(coord => coord[0]).sort((a, b) => a - b)
  const ys = input.map(coord => coord[1]).sort((a, b) => a - b)

  const tally = {}

  for (let x = xs[0]; x <= xs[xs.length - 1]; x++) {
    for (let y = ys[0]; y <= ys[ys.length - 1]; y++) {
      const distance = getDistance(input, x, y)
      const minD = distance.reduce((min, d) => d < min ? d : min, Infinity)
      if (distance.filter(d => d === minD).length > 1) continue
      const closest = distance.findIndex(d => d === minD)
      tally[closest] = tally[closest] || 0
      tally[closest]++
    }
  }

  Object.keys(tally).forEach(key => {
    if (
      xs.filter(x => x < input[key][0]).length <= 0 ||
      ys.filter(y => y < input[key][1]).length <= 0 ||
      xs.filter(x => x > input[key][0]).length <= 0 ||
      ys.filter(y => y > input[key][1]).length <= 0
    ) tally[key] = Infinity
  })

  return Object.values(tally).filter(n => n < Infinity)
    .reduce((max, n) => n > max ? n : max, -Infinity)
}

function findRegionNearAll (input, cutoff = 10000) {
  const xs = input.map(coord => coord[0]).sort((a, b) => a - b)
  const ys = input.map(coord => coord[1]).sort((a, b) => a - b)

  const middle = Math.floor((input.length - 1) / 2)
  const cx = xs[middle]
  const cy = ys[middle]

  let count = 0

  const distance = getDistance(input, cx, cy)
  let repeat = distance.reduce((sum, d) => sum + d, 0) <= cutoff
  if (repeat) count++

  const traverse = spiral([cx, cy], 1)

  while (true) {
    const next = traverse.next(repeat)
    if (next.done) break
    const distance = getDistance(input, next.value[0], next.value[1])
    repeat = distance.reduce((sum, d) => sum + d, 0) <= cutoff
    if (repeat) count++
  }

  return count
}

function * spiral (topleft, length) {
  let current = [...topleft]
  let repeat = true
  while (true) {
    current[1]++
    repeat = (yield current) || repeat
    if (!repeat) break
    repeat = false

    for (let i = 0; i < length; i++) {
      current[0]++
      repeat = (yield current) || repeat
    }
    for (let i = 0; i < length + 1; i++) {
      current[1]--
      repeat = (yield current) || repeat
    }
    for (let i = 0; i < length + 1; i++) {
      current[0]--
      repeat = (yield current) || repeat
    }
    for (let i = 0; i < length + 1; i++) {
      current[1]++
      repeat = (yield current) || repeat
    }
    length += 2
  }
}

function getDistance (points, x, y) {
  return points.map(coord => Math.abs(coord[0] - x) + Math.abs(coord[1] - y))
}

function parse (line) {
  return line.split(', ').map(v => +v)
}

const test = `
154, 159
172, 84
235, 204
181, 122
161, 337
305, 104
128, 298
176, 328
146, 71
210, 87
341, 195
50, 96
225, 151
86, 171
239, 68
79, 50
191, 284
200, 122
282, 240
224, 282
327, 74
158, 289
331, 244
154, 327
317, 110
272, 179
173, 175
187, 104
44, 194
202, 332
249, 197
244, 225
52, 127
299, 198
123, 198
349, 75
233, 72
284, 130
119, 150
172, 355
147, 314
58, 335
341, 348
236, 115
185, 270
173, 145
46, 288
214, 127
158, 293
237, 311
`.trim().split('\n').map(parse)

console.log(findLargestArea(test))
console.log(findRegionNearAll(test))
