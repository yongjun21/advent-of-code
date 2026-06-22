const load = require('../loader')

function calculateFuel (input) {
  const cost = (xStar, x) => Math.abs(x - xStar)
  const cPrime = (xStar, x) => {
    if (x === xStar) return 0
    return x > xStar ? -1 : 1
  }
  const [xSeries] = gradientDescent(cost, cPrime, input)
  const xStar = xSeries.pop()
  const a = summation(input, cost.bind(null, Math.floor(xStar)))
  const b = summation(input, cost.bind(null, Math.ceil(xStar)))
  return Math.min(a, b)
}

function calculateFuel2 (input) {
  const cost = (xStar, x) => {
    const norm = Math.abs(x - xStar)
    return (norm * (norm + 1)) / 2
  }
  const cPrime = (xStar, x) => {
    if (x === xStar) return 0
    const dNorm = x > xStar ? -1 : 1
    const norm = Math.abs(x - xStar)
    return (norm + 0.5) * dNorm
  }
  const [xSeries] = gradientDescent(cost, cPrime, input, 0.0001)
  const xStar = xSeries.pop()
  const a = summation(input, cost.bind(null, Math.floor(xStar)))
  const b = summation(input, cost.bind(null, Math.ceil(xStar)))
  return Math.min(a, b)
}

function gradientDescent (cost, cPrime, input, alpha = 0.1, maxIter = 100) {
  const cSeries = []
  const xSeries = []
  let xStar = input[0]
  while (maxIter-- > 0) {
    const xOverride = breakCycle(xSeries, xStar)
    if (xOverride != null) {
      xStar = xOverride
      continue
    }
    const C = summation(input, cost.bind(null, xStar))
    const dC = summation(input, cPrime.bind(null, xStar))
    cSeries.push(C)
    xSeries.push(xStar)
    xStar -= alpha * dC
  }
  return [xSeries, cSeries]
}

function breakCycle (arr, v) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === v) {
      const cycle = arr.slice(i)
      return cycle.reduce((sum, v) => sum + v) / cycle.length
    }
  }
}

function summation (arr, f) {
  return arr.reduce((sum, x) => sum + f(x), 0)
}

const test = load('day7', __dirname).split(',').map(Number)

console.log(calculateFuel(test))
console.log(calculateFuel2(test))
