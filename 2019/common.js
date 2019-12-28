const { getDigits } = require('../helpers')

exports.intcode = intcode
exports.ascii = ascii

function ascii (program) {
  const generator = ASCII(program)
  let pending = generator.next()
  return {
    mode: pending.value == null ? 'i' : 'o',
    next (value) {
      const next = pending
      pending = generator.next(value)
      this.mode = pending.value == null ? 'i' : 'o'
      return next
    },
    [Symbol.iterator] () {
      return this
    }
  }
}

function intcode (program) {
  const generator = Intcode(program)
  let pending = generator.next()
  return {
    mode: pending.value == null ? 'i' : 'o',
    next (value) {
      const next = pending
      pending = generator.next(value)
      this.mode = pending.value == null ? 'i' : 'o'
      return next
    },
    [Symbol.iterator] () {
      return this
    }
  }
}

function * ASCII (program) {
  program = intcode(program)
  const buffer = []
  let index = 0
  while (true) {
    if (program.mode === 'o') {
      const next = program.next()
      buffer.push(next.value)
    } else if (buffer.length > index) {
      let message = ''
      while (buffer.length > index) {
        const v = buffer[index++]
        if (v >= 0 && v < 128) {
          message += String.fromCodePoint(v)
        } else {
          if (message.length > 0) yield message
          message = ''
          yield v
        }
      }
      if (message.length > 0) yield message
    } else {
      const command = yield
      for (let i = 0; i < command.length; i++) {
        program.next(command.codePointAt(i))
      }
      program.next(10)
    }
  }
}

function * Intcode (program) {
  let pointer = 0
  let base = 0
  while (true) {
    const instruction = getDigits(program[pointer])
    const opcode = (instruction[1] || 0) * 10 + instruction[0]
    if (opcode === 99) break
    const p1 = program[pointer + 1]
    const m1 = instruction[2]
    const a1 = m1 === 2 ? base + p1 : p1
    const v1 = (m1 === 1 ? p1 : program[a1]) || 0
    if (opcode === 3) {
      program[a1] = yield
      pointer += 2
    } else if (opcode === 4) {
      yield v1
      pointer += 2
    } else if (opcode === 9) {
      base += v1
      pointer += 2
    } else {
      const p2 = program[pointer + 2]
      const m2 = instruction[3]
      const a2 = m2 === 2 ? base + p2 : p2
      const v2 = (m2 === 1 ? p2 : program[a2] || 0)
      const p3 = program[pointer + 3]
      const m3 = instruction[4]
      const a3 = m3 === 2 ? base + p3 : p3
      if (opcode === 1) {
        program[a3] = v1 + v2
      } else if (opcode === 2) {
        program[a3] = v1 * v2
      } else if (opcode === 7) {
        program[a3] = +(v1 < v2)
      } else if (opcode === 8) {
        program[a3] = +(v1 === v2)
      } else if (opcode === 5) {
        pointer = v1 ? v2 : pointer + 3
        continue
      } else if (opcode === 6) {
        pointer = v1 ? pointer + 3 : v2
        continue
      }
      pointer += 4
    }
  }
}

exports.printState = function (state, pixels) {
  const coordinates = Object.keys(state).map(k => k.split(',').map(Number))
  const bbox = [
    coordinates.reduce((min, xy) => xy[0] < min ? xy[0] : min, Infinity),
    coordinates.reduce((min, xy) => xy[1] < min ? xy[1] : min, Infinity),
    coordinates.reduce((max, xy) => xy[0] > max ? xy[0] : max, -Infinity),
    coordinates.reduce((max, xy) => xy[1] > max ? xy[1] : max, -Infinity)
  ]
  for (let y = bbox[1]; y <= bbox[3]; y++) {
    let line = ''
    for (let x = bbox[0]; x <= bbox[2]; x++) {
      const pixel = state[[x, y]]
      line += pixel in pixels ? pixels[pixel] : ' '
    }
    console.log(line)
  }
}

exports.runCommands = function (program, commands, verbose) {
  for (const command of commands) {
    if (program.mode === 'o') {
      const output = program.next().value
      if (verbose) process.stdout.write(output)
    }
    if (verbose) console.log(command)
    program.next(command)
  }
}
