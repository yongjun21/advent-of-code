const load = require('../loader')

const { intcode } = require('./common')
const { getPermutations } = require('../helpers')

function findHighest (input) {
  return getPermutations([0, 1, 2, 3, 4]).reduce((max, settings) => {
    let signal = 0
    settings.forEach(setting => {
      const program = intcode([...input])
      program.next(setting)
      program.next(signal)
      signal = program.next().value
    })
    return signal > max ? signal : max
  }, -Infinity)
}

function findHighestWithFeedback (input) {
  return getPermutations([5, 6, 7, 8, 9]).reduce((max, settings) => {
    let signal = 0
    let outSignal
    let i = 0
    const programs = settings.map(setting => {
      const program = intcode([...input])
      program.next(setting)
      return program
    })

    while (true) {
      programs[i].next(signal)
      const next = programs[i].next()
      if (next.done) break
      signal = next.value
      if (i === 4) {
        outSignal = signal
        i = 0
      } else {
        i++
      }
    }

    return outSignal > max ? outSignal : max
  }, -Infinity)
}

const test = load('day7', __dirname).split(',').map(Number)

console.log(findHighest(test))
console.log(findHighestWithFeedback(test))
