const load = require('../loader')

function parseInstructions (input) {
  return input.trim().split('\n').map(line => {
    const match = line.match(/^(bot [0-9]+) gives low to ((bot|output) [0-9]+) and high to ((bot|output) ([0-9]+))$/)
    const match2 = line.match(/^value ([0-9]+) goes to (bot [0-9]+)$/)
    if (match) {
      return {
        bot: match[1],
        low: match[2],
        high: match[4],
        in: []
      }
    } else if (match2) {
      return {
        bot: match2[2],
        push: +match2[1]
      }
    }
  })
}

function runBotInstructions (input) {
  const instructions = parseInstructions(input)

  const state = {}
  instructions.forEach(line => {
    if (line.in) state[line.bot] = line
  })
  instructions.forEach(line => {
    if (line.push) {
      state[line.bot].in.push(line.push)
      line.executed = true
    }
  })

  while (instructions.filter(line => !line.executed).length > 0) {
    instructions.forEach(line => {
      if (line.executed) return
      if (line.in.length > 1) {
        const min = Math.min(...line.in)
        const max = Math.max(...line.in)
        if (line.low.match(/^bot/)) state[line.low].in.push(min)
        else state[line.low] = {output: line.low, out: min}
        if (line.high.match(/^bot/)) state[line.high].in.push(max)
        else state[line.high] = {output: line.high, out: min}
        line.executed = true
      }
    })
  }

  return state
}

const test = load('day10', __dirname)

console.log(runBotInstructions(test))
