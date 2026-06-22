const load = require('../loader')

function followCourse (input) {
  let x = 0
  let y = 0
  input.forEach(([dx, dy]) => {
    x += dx
    y += dy
  })
  return x * y
}

function followCourse2 (input) {
  let x = 0
  let y = 0
  let aim = 0
  input.forEach(([dx, dy]) => {
    x += dx
    y += dx * aim
    aim += dy
  })
  return x * y
}

function parse (line) {
  let [command, step] = line.split(' ')
  step = Number(step)
  switch (command) {
    case 'forward':
      return [step, 0]
    case 'up':
      return [0, -step]
    case 'down':
      return [0, step]
  }
}

const test = load('day2', __dirname).trim().split('\n').map(parse)

console.log(followCourse(test))
console.log(followCourse2(test))
