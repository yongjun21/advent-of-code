const load = require('../loader')

const HEX_BASES = [8, 4, 2, 1]

function getVersionSum (input) {
  const iter = hex2bin(input)
  const parsed = parse(iter)
  return sumVersion(parsed)
}

function evaluate (input) {
  const iter = hex2bin(input)
  const parsed = parse(iter)
  return parsed.value
}

function sumVersion (packet) {
  return (
    packet.version + packet.sub.reduce((sum, sub) => sum + sumVersion(sub), 0)
  )
}

function parse (iter) {
  const reader = getReader(iter)
  const version = reader.read(3)
  const type = reader.read(3)
  if (type === 4) {
    let isLast
    let value = 0
    do {
      value *= 16
      isLast = reader.read() === 0
      value += reader.read(4)
    } while (!isLast)
    return {
      version,
      type,
      value,
      sub: [],
      bitLength: reader.bits
    }
  } else {
    const lengthType = reader.read()
    const sub = []
    let length = reader.read(lengthType === 0 ? 15 : 11)
    while (length > 0) {
      const next = parse(iter)
      sub.push(next)
      length -= lengthType === 0 ? next.bitLength : 1
    }
    return {
      version,
      type,
      value: getValueFromSubPackets(type, sub),
      sub,
      bitLength: reader.bits + sub.reduce((sum, packet) => sum + packet.bitLength, 0)
    }
  }
}

function getValueFromSubPackets (type, sub) {
  switch (type) {
    case 0:
      return sub.reduce((sum, packet) => sum + packet.value, 0)
    case 1:
      return sub.reduce((product, packet) => product * packet.value, 1)
    case 2:
      return Math.min(...sub.map(packet => packet.value))
    case 3:
      return Math.max(...sub.map(packet => packet.value))
    case 5:
      return sub[0].value > sub[1].value ? 1 : 0
    case 6:
      return sub[0].value < sub[1].value ? 1 : 0
    case 7:
      return sub[0].value === sub[1].value ? 1 : 0
  }
}

function getReader (iter) {
  return {
    read (n = 1) {
      this.bits += n
      let value = ''
      while (n > 0) {
        const next = iter.next()
        if (next.done) break
        value += next.value
        n--
      }
      this.bits -= n
      return parseInt(value, 2)
    },
    bits: 0
  }
}

function * hex2bin (input) {
  for (const char of input) {
    let v = parseInt(char, 16)
    for (const base of HEX_BASES) {
      if (v >= base) {
        yield '1'
        v -= base
      } else {
        yield '0'
      }
    }
  }
}

const test = load('day16', __dirname)

console.log(getVersionSum(test))
console.log(evaluate(test))
