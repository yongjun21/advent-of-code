const load = require('../loader')

function getExecutionOrder (dependency) {
  const steps = []
  while (steps.length < Object.keys(dependency).length) {
    const available = Object.keys(dependency).filter(dep => {
      if (steps.includes(dep)) return false
      return dependency[dep].every(d => steps.includes(d))
    }).sort()
    steps.push(available[0])
  }
  return steps.join('')
}

function getCompletionTime (dependency, nWorkers = 5) {
  const requiredTime = getRequiredTime()
  const completed = []
  let timer = 0

  const workers = []
  for (let i = 0; i < nWorkers; i++) {
    workers.push(getWorker(completed, requiredTime))
  }

  do {
    const available = Object.keys(dependency).filter(dep => {
      if (completed.includes(dep)) return false
      if (workers.some(w => w.job && w.job.step === dep)) return false
      return dependency[dep].every(d => completed.includes(d))
    }).sort()

    workers.forEach(w => {
      w.work(available)
    })
    timer++
  } while (completed.length < Object.keys(dependency).length)

  return timer
}

function getDependency (input) {
  return input.reduce((dependency, line) => {
    const match = line.match(/^Step ([A-Z]) must be finished before step ([A-Z]) can begin\.$/)
    const dependsOn = match[1]
    const dependent = match[2]
    dependency[dependsOn] = dependency[dependsOn] || []
    dependency[dependent] = dependency[dependent] || []
    dependency[dependent].push(dependsOn)
    return dependency
  }, {})
}

function getWorker (completed, requiredTime) {
  return {
    job: null,
    work (available) {
      if (this.job == null && available.length > 0) {
        const step = available.shift()
        this.job = {step, finish: requiredTime[step]}
      }
      if (this.job == null) return
      this.job.finish--
      if (this.job.finish <= 0) {
        completed.push(this.job.step)
        this.job = null
      }
    }
  }
}

function getRequiredTime (base = 60) {
  return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    .reduce((obj, step, i) => Object.assign(obj, {[step]: base + i + 1}), {})
}

const test = load('day7', __dirname).trim().split('\n')

const dependency = getDependency(test)
console.log(getExecutionOrder(dependency))
console.log(getCompletionTime(dependency))
