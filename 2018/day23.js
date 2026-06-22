const load = require('../loader')

function inRangeOfLargestR (input) {
  const largest = input.reduce((max, bot) => {
    return bot.r > max.r ? bot : max
  }, {r: -Infinity})
  return input.filter(bot => inRange(bot.pos, largest)).length
}

function inRangeOfMost (input) {
  const planes = [
    [1, 1, 1],
    [-1, 1, 1],
    [1, -1, 1],
    [1, 1, -1]
  ]

  const scans = planes.map(plane => {
    const layers = []
    input.forEach((bot, i) => {
      const k = bot.pos.reduce((sum, v, i) => sum + plane[i] * v, 0)
      layers.push({k: k - bot.r, bot: i, enter: true})
      layers.push({k: k + bot.r + 1, bot: i, enter: false})
    })
    layers.sort((a, b) => a.k - b.k)
    const scan = {}
    const state = input.map(bot => false)
    layers.forEach(layer => {
      state[layer.bot] = layer.enter
      scan[layer.k] = {
        k: layer.k,
        state: [...state],
        count: sum(state)
      }
    })
    return Object.values(scan)
  })
  scans.forEach(scan => {
    scan.sort((a, b) => a.k - b.k)
    scan.forEach((layer, i) => {
      if (i === scan.length - 1) return
      layer.dk = scan[i + 1].k - layer.k
    })
    scan.pop()
    scan.sort((a, b) => b.count - a.count)
  })

  const max = {count: -Infinity, distance: Infinity}
  for (let layer1 of scans[1]) {
    if (layer1.count < max.count) break
    for (let layer2 of scans[2]) {
      if (layer2.count < max.count) break
      for (let layer3 of scans[3]) {
        if (layer3.count < max.count) break
        const distance = layer1.k + layer2.k + layer3.k
        const dk = layer1.dk + layer2.dk + layer3.dk - 3
        scans[0].forEach(layer0 => {
          if (distance <= layer0.k && layer0.k <= distance + dk) {
            const count = boundedCount([layer0, layer1, layer2, layer3], input)
            if (count > max.count || (count === max.count && distance < max.distance)) {
              max.count = count
              max.distance = layer0.k
            }
          }
        })
      }
    }
  }
  return max.distance
}

function boundedCount (layers, input) {
  return sum(input.map((bot, i) => and(layers.map(layer => layer.state[i]))))
}

function countInRange (target, input) {
  return input.filter(bot => inRange(target, bot)).length
}

function inRange (target, bot) {
  return manhatten(target, bot.pos) <= bot.r
}

function manhatten (src, dest) {
  return src.reduce((sum, v, i) => sum + Math.abs(v - dest[i]), 0)
}

function and (arr) {
  return arr.reduce((and, v) => and && v, true)
}

function sum (arr) {
  return arr.reduce((sum, v) => sum + v, 0)
}

function parse (line) {
  const match = line.match(/^pos=<(.+?)>, r=(\d+)$/)
  return {
    pos: match[1].split(',').map(Number),
    r: +match[2]
  }
}

const test = load('day23', __dirname).trim().split('\n').map(parse)

console.log(inRangeOfLargestR(test))
console.log(inRangeOfMost(test))
