function * scanner (range) {
  let y = 0
  let delta = 1
  while (true) {
    if (y + delta < 1 || y + delta > range) delta *= -1
    y += delta
    yield y
  }
}

function getScanners (input) {
  const scanners = []
  input.trim().split('\n').forEach(line => {
    const match = line.match(/^([0-9]+): ([0-9]+)$/)
    scanners[+match[1]] = {
      depth: +match[1],
      range: +match[2],
      scan: scanner(+match[2])
    }
  })
  return scanners
}

function getSeverity (positions, scanners, delay = 0) {
  while (positions.length < scanners.length + delay) {
    positions.push(scanners.map(layer => layer.scan.next().value))
  }

  return scanners.reduce((sum, layer, i) => {
    if (positions[i + delay][i] > 1) return sum
    return (sum || 0) + layer.depth * layer.range
  }, null)
}

function noDelay (input) {
  const scanners = getScanners(input)
  return getSeverity([], scanners)
}

function bypassFirewall (input) {
  const scanners = getScanners(input)
  const positions = []
  let delay = 0
  while (getSeverity(positions, scanners, delay) != null) {
    positions[delay++] = undefined
  }
  return delay
}

const test = `
0: 3
1: 2
2: 4
4: 4
6: 5
8: 6
10: 8
12: 8
14: 6
16: 6
18: 8
20: 8
22: 6
24: 12
26: 9
28: 12
30: 8
32: 14
34: 12
36: 8
38: 14
40: 12
42: 12
44: 12
46: 14
48: 12
50: 14
52: 12
54: 10
56: 14
58: 12
60: 14
62: 14
66: 10
68: 14
74: 14
76: 12
78: 14
80: 20
86: 18
92: 14
94: 20
96: 18
98: 17
`

console.log(noDelay(test))
console.log(bypassFirewall(test))
