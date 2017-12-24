function buildBridge (components) {
  const bridges = []

  function extend (port, bridge) {
    const filtered = components
      .filter(component => !bridge.includes(component))
      .filter(component => component[0] === port || component[1] === port)
    if (filtered.length > 0) {
      filtered.forEach(component => {
        extend(component[0] === port ? component[1] : component[0], [...bridge, component])
      })
    } else {
      bridges.push(bridge)
    }
  }

  extend(0, [])

  return bridges
}

function findStrongestBridge (input) {
  const components = input.trim().split('\n')
    .map(line => line.split('/').map(pin => +pin))
  const bridges = buildBridge(components)

  const strength = bridges.map(bridge =>
    bridge.reduce((sum, component) => sum + component[0] + component[1], 0))

  return strength.reduce((max, s) => s > max ? s : max, 0)
}

function findLongestBridge (input) {
  const components = input.trim().split('\n')
    .map(line => line.split('/').map(pin => +pin))
  const bridges = buildBridge(components)

  const maxLength = bridges.reduce((max, bridge) => bridge.length > max ? bridge.length : max, 0)

  const strength = bridges.filter(bridge => bridge.length === maxLength).map(bridge =>
    bridge.reduce((sum, component) => sum + component[0] + component[1], 0))

  return strength.reduce((max, s) => s > max ? s : max, 0)
}

const test = `
50/41
19/43
17/50
32/32
22/44
9/39
49/49
50/39
49/10
37/28
33/44
14/14
14/40
8/40
10/25
38/26
23/6
4/16
49/25
6/39
0/50
19/36
37/37
42/26
17/0
24/4
0/36
6/9
41/3
13/3
49/21
19/34
16/46
22/33
11/6
22/26
16/40
27/21
31/46
13/2
24/7
37/45
49/2
32/11
3/10
32/49
36/21
47/47
43/43
27/19
14/22
13/43
29/0
33/36
2/6
`

console.log(findStrongestBridge(test))
console.log(findLongestBridge(test))
