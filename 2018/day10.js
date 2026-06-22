const load = require('../loader')

function printMessage (input) {
  const points = input.map(row => ([...row.position]))
  points.bbox = bbox
  let timer = 0
  let last = entrophy(points.bbox())
  while (true) {
    points.forEach((pt, i) => {
      pt[0] += input[i].velocity[0]
      pt[1] += input[i].velocity[1]
    })
    const current = entrophy(points.bbox())
    if (current > last) break
    last = current
    timer++
  }
  points.forEach((pt, i) => {
    pt[0] -= input[i].velocity[0]
    pt[1] -= input[i].velocity[1]
  })
  print(points)
  return timer
}

function parse (line) {
  const match = line.match(/^position=<(.+)> velocity=<(.+)>$/)
  const position = match[1].replace(/ /g, '').split(',').map(v => +v)
  const velocity = match[2].replace(/ /g, '').split(',').map(v => +v)
  return {
    position,
    velocity
  }
}

function print (points) {
  const bbox = points.bbox()
  for (let j = bbox[1]; j <= bbox[3]; j++) {
    let line = ''
    for (let i = bbox[0]; i <= bbox[2]; i++) {
      if (points.some(pt => pt[0] === i && pt[1] === j)) line += '.'
      else line += ' '
    }
    console.log(line)
  }
}

function bbox () {
  return [
    this.reduce((min, pt) => pt[0] < min ? pt[0] : min, Infinity),
    this.reduce((min, pt) => pt[1] < min ? pt[1] : min, Infinity),
    this.reduce((max, pt) => pt[0] > max ? pt[0] : max, -Infinity),
    this.reduce((max, pt) => pt[1] > max ? pt[1] : max, -Infinity)
  ]
}

function entrophy (bbox) {
  return (bbox[2] - bbox[0]) * (bbox[3] - bbox[1])
}

const test = load('day10', __dirname).trim().split('\n').map(parse)

console.log(printMessage(test))
