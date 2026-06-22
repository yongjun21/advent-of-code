/* eslint-disable no-eval */
const load = require('../loader')

function monkeyBusiness (input, rounds = 20) {
  const monkeys = getMonkeys(input)
  while (rounds-- > 0) {
    Object.values(monkeys).forEach(monkey => monkey.turn())
  }
  const inspectedCount = monkeys.map(monkey => monkey.inspectedCount)
  const sorted = inspectedCount.sort((a, b) => b - a)
  return sorted[0] * sorted[1]
}

function monkeyBusiness2 (input, rounds = 10000) {
  const monkeys = getMonkeys(input)
  const commonMultiple = monkeys.reduce((product, monkey) => product * monkey.divisibleBy, 1)
  const relieve = (inspected) => inspected % commonMultiple
  while (rounds-- > 0) {
    Object.values(monkeys).forEach(monkey => monkey.turn(relieve))
  }
  const inspectedCount = monkeys.map(monkey => monkey.inspectedCount)
  const sorted = inspectedCount.sort((a, b) => b - a)
  return sorted[0] * sorted[1]
}

function getMonkeys (input) {
  const monkeys = {}

  class Monkey {
    constructor (input) {
      this.id = +/^Monkey (\d+):$/.exec(input[0])[1]
      monkeys[this.id] = this
      const holdingTokens = input[1].split(' ')
      this.holding = holdingTokens.slice(2).map(token => +token.replace(/,/g, ''))
      const operationString = input[2].split(' ').slice(1).join(' ')
      this.inspect = (old) => {
        let inspected = null // eslint-disable-line
        eval(operationString.replace(/\bnew\b/g, 'inspected'))
        this.inspectedCount++
        return inspected
      }
      const divisibleByTokens = input[3].split(' ')
      this.divisibleBy = +divisibleByTokens[divisibleByTokens.length - 1]
      this.test = (worry) => worry % this.divisibleBy === 0
      const ifTrueTokens = input[4].split(' ')
      this.ifTrue = +ifTrueTokens[ifTrueTokens.length - 1]
      const ifFalseTokens = input[5].split(' ')
      this.ifFalse = +ifFalseTokens[ifFalseTokens.length - 1]
      this.inspectedCount = 0
    }

    turn (relieve = (inspected) => Math.floor(inspected / 3)) {
      while (this.holding.length > 0) {
        const item = this.holding.shift()
        const inspected = relieve(this.inspect(item))
        if (this.test(inspected)) monkeys[this.ifTrue].holding.push(inspected)
        else monkeys[this.ifFalse].holding.push(inspected)
      }
    }
  }

  for (let i = 0; i < input.length; i += 7) {
    const monkey = new Monkey(input.slice(i, i + 6))
    monkeys[monkey.id] = monkey
  }

  return Object.values(monkeys)
}

const test = load('day11', __dirname).trim().split('\n').map(line => line.trim())

console.log(monkeyBusiness(test))
console.log(monkeyBusiness2(test))
