const load = require('../loader')

function process (input) {
  const records = []
  let record
  for (let line of input) {
    const match = line.match(/^\[\d{4}-\d{2}-\d{2} \d{2}:(\d{2})] (Guard #(\d+) begins shift|falls asleep|wakes up)$/)
    if (match[2].startsWith('Guard')) {
      record = {
        id: match[3],
        sleep: [],
        last: 0
      }
      records.push(record)
    } else {
      const minute = +match[1]
      if (match[2] === 'falls asleep') {
        while (record.last < minute) {
          record.sleep[record.last++] = 0
        }
      } else if (match[2] === 'wakes up') {
        while (record.last < minute) {
          record.sleep[record.last++] = 1
        }
      }
    }
  }
  records.forEach(record => {
    while (record.last < 60) {
      record.sleep[record.last++] = 0
    }
  })
  return records
}

function strategyOne (processed) {
  const guards = {}
  processed.forEach(row => {
    guards[row.id] = guards[row.id] || 0
    guards[row.id] += row.sleep.reduce((sum, v) => sum + v, 0)
  })
  const laziest = getMax(guards)

  const filtered = processed.filter(row => row.id === laziest)
  const totalled = filtered[0].sleep.map((v, i) =>
    filtered.reduce((sum, row) => sum + row.sleep[i], 0))
  const sleepiest = getMax(totalled)
  return laziest * sleepiest
}

function strategyTwo (processed) {
  const totalled = processed[0].sleep.map((v, i) => {
    return processed.reduce((guards, row) => {
      guards[row.id] = guards[row.id] || 0
      guards[row.id] += row.sleep[i]
      return guards
    }, {})
  })

  const laziest = totalled.map(getMax)
  const slept = totalled.map((guards, i) => guards[laziest[i]])
  const sleepiest = getMax(slept)
  return laziest[sleepiest] * sleepiest
}

function getMax (obj) {
  let id
  let max = -Infinity
  Object.keys(obj).forEach(key => {
    if (obj[key] > max) {
      id = key
      max = obj[key]
    }
  })
  return id
}

const test = load('day4', __dirname).trim().split('\n').sort()

const processed = process(test)
console.log(strategyOne(processed))
console.log(strategyTwo(processed))
