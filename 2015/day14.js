const load = require('../loader')

function * reindeer (speed, fly, rest) {
  let distance = 0
  while (true) {
    for (let i = 0; i < fly; i++) {
      distance += speed
      yield distance
    }
    for (let i = 0; i < rest; i++) {
      yield distance
    }
  }
}

function race (input, time) {
  const performance = input.trim().split('\n').map(line => {
    const match = line.match(/^(.+) can fly ([0-9]+) km\/s for ([0-9]+) seconds, but then must rest for ([0-9]+) seconds.$/)
    const iter = reindeer(+match[2], +match[3], +match[4])
    const progress = []
    for (let t = 0; t < time; t++) {
      progress.push(iter.next().value)
    }
    return {
      name: match[1],
      distance: progress[progress.length - 1],
      score: 0,
      progress
    }
  })

  const best = []
  for (let t = 0; t < time; t++) {
    best.push(Math.max(...performance.map(reindeer => reindeer.progress[t])))
  }

  performance.forEach(reindeer => {
    for (let t = 0; t < time; t++) {
      if (reindeer.progress[t] === best[t]) reindeer.score++
    }
  })

  return performance
}

const test = load('day14', __dirname)

race(test, 2503).forEach(reindeer => {
  console.log(reindeer.name, reindeer.distance, reindeer.score)
})
