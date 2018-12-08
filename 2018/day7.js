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

const test = `
Step P must be finished before step G can begin.
Step X must be finished before step V can begin.
Step H must be finished before step R can begin.
Step O must be finished before step W can begin.
Step C must be finished before step F can begin.
Step U must be finished before step M can begin.
Step E must be finished before step W can begin.
Step F must be finished before step J can begin.
Step W must be finished before step K can begin.
Step R must be finished before step M can begin.
Step I must be finished before step K can begin.
Step D must be finished before step B can begin.
Step Z must be finished before step A can begin.
Step A must be finished before step N can begin.
Step T must be finished before step J can begin.
Step B must be finished before step N can begin.
Step Y must be finished before step M can begin.
Step Q must be finished before step N can begin.
Step G must be finished before step V can begin.
Step J must be finished before step N can begin.
Step M must be finished before step V can begin.
Step N must be finished before step V can begin.
Step K must be finished before step S can begin.
Step V must be finished before step L can begin.
Step S must be finished before step L can begin.
Step W must be finished before step D can begin.
Step A must be finished before step V can begin.
Step T must be finished before step Y can begin.
Step H must be finished before step W can begin.
Step O must be finished before step C can begin.
Step P must be finished before step S can begin.
Step Z must be finished before step N can begin.
Step G must be finished before step K can begin.
Step I must be finished before step T can begin.
Step D must be finished before step M can begin.
Step A must be finished before step Q can begin.
Step O must be finished before step S can begin.
Step N must be finished before step L can begin.
Step V must be finished before step S can begin.
Step M must be finished before step N can begin.
Step A must be finished before step B can begin.
Step H must be finished before step B can begin.
Step H must be finished before step G can begin.
Step Q must be finished before step M can begin.
Step U must be finished before step E can begin.
Step C must be finished before step S can begin.
Step M must be finished before step L can begin.
Step T must be finished before step L can begin.
Step I must be finished before step N can begin.
Step Y must be finished before step N can begin.
Step K must be finished before step V can begin.
Step U must be finished before step B can begin.
Step H must be finished before step Z can begin.
Step H must be finished before step Y can begin.
Step E must be finished before step F can begin.
Step F must be finished before step Q can begin.
Step R must be finished before step G can begin.
Step T must be finished before step S can begin.
Step T must be finished before step Q can begin.
Step X must be finished before step H can begin.
Step Q must be finished before step S can begin.
Step Q must be finished before step J can begin.
Step G must be finished before step S can begin.
Step D must be finished before step S can begin.
Step A must be finished before step J can begin.
Step I must be finished before step Y can begin.
Step U must be finished before step K can begin.
Step P must be finished before step R can begin.
Step A must be finished before step T can begin.
Step J must be finished before step K can begin.
Step Z must be finished before step J can begin.
Step Z must be finished before step V can begin.
Step P must be finished before step X can begin.
Step E must be finished before step I can begin.
Step G must be finished before step L can begin.
Step G must be finished before step N can begin.
Step J must be finished before step L can begin.
Step I must be finished before step Q can begin.
Step Q must be finished before step K can begin.
Step B must be finished before step J can begin.
Step R must be finished before step T can begin.
Step Z must be finished before step K can begin.
Step J must be finished before step V can begin.
Step R must be finished before step L can begin.
Step R must be finished before step N can begin.
Step W must be finished before step Q can begin.
Step U must be finished before step W can begin.
Step Y must be finished before step V can begin.
Step C must be finished before step T can begin.
Step X must be finished before step B can begin.
Step M must be finished before step S can begin.
Step B must be finished before step K can begin.
Step D must be finished before step N can begin.
Step P must be finished before step U can begin.
Step N must be finished before step K can begin.
Step M must be finished before step K can begin.
Step C must be finished before step A can begin.
Step W must be finished before step B can begin.
Step C must be finished before step Y can begin.
Step T must be finished before step V can begin.
Step W must be finished before step M can begin.
`.trim().split('\n')

const dependency = getDependency(test)
console.log(getExecutionOrder(dependency))
console.log(getCompletionTime(dependency))
