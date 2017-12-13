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

const test = `
Vixen can fly 8 km/s for 8 seconds, but then must rest for 53 seconds.
Blitzen can fly 13 km/s for 4 seconds, but then must rest for 49 seconds.
Rudolph can fly 20 km/s for 7 seconds, but then must rest for 132 seconds.
Cupid can fly 12 km/s for 4 seconds, but then must rest for 43 seconds.
Donner can fly 9 km/s for 5 seconds, but then must rest for 38 seconds.
Dasher can fly 10 km/s for 4 seconds, but then must rest for 37 seconds.
Comet can fly 3 km/s for 37 seconds, but then must rest for 76 seconds.
Prancer can fly 9 km/s for 12 seconds, but then must rest for 97 seconds.
Dancer can fly 37 km/s for 1 seconds, but then must rest for 36 seconds.
`

race(test, 2503).forEach(reindeer => {
  console.log(reindeer.name, reindeer.distance, reindeer.score)
})
