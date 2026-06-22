const { ascii } = require('./common')
const { getAssignments } = require('../helpers')

const load = require('../loader')

const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const ITEMS = [
  'dark matter',
  'astronaut ice cream',
  'pointer',
  'mutex',
  'festive hat',
  'whirled peas',
  'coin'
]

function findPassword (input, shortcuts = {}) {
  const program = ascii([...input])
  const commands = []

  function resume () {
    while (true) {
      if (program.mode === 'o') rl.output.write(program.next().value)
      else if (commands.length > 0) rl.write(commands.shift() + '\n')
      else break
    }
    rl.prompt()
  }
  rl.on('line', line => {
    if (line in shortcuts) {
      shortcuts[line](commands)
    } else {
      program.next(line)
    }
    resume()
  })
  resume()
}

const shortcuts = {
  skip (commands) {
    const cmds = [
      'south',
      'take whirled peas',
      'south',
      'south',
      'south',
      'take festive hat',
      'north',
      'north',
      'north',
      'north',
      'west',
      'take pointer',
      'east',
      'north',
      'take coin',
      'north',
      'take astronaut ice cream',
      'north',
      'west',
      'take dark matter',
      'south',
      'west',
      'take mutex',
      'west',
      'south'
    ]
    for (const c of cmds) {
      commands.push(c)
    }
    ITEMS.forEach(item => {
      commands.push('drop ' + item)
    })
  },
  test: (function () {
    const assignments = getAssignments(ITEMS.length)
    let i = 0
    let prev = [...ITEMS].fill(0)
    return function (commands) {
      const next = assignments[i++]
      ITEMS.forEach((item, i) => {
        if (next[i] && !prev[i]) commands.push('take ' + item)
        else if (!next[i] && prev[i]) commands.push('drop ' + item)
      })
      commands.push('inv')
      commands.push('east')
      prev = next
    }
  })()
}

const test = load('day25', __dirname).split(',').map(Number)

findPassword(test, shortcuts)
