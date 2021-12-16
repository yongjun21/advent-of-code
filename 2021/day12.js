function enumeratePaths (input, allowVisitTwice = false) {
  const graph = Object.create(null)
  input.forEach(([src, dest]) => {
    graph[src] = graph[src] || []
    graph[src].push(dest)
    graph[dest] = graph[dest] || []
    graph[dest].push(src)
  })

  const bigCaves = new Set(
    Object.keys(graph).filter(label => label.toUpperCase() === label)
  )

  let paths = 0
  const unvisited = []
  unvisited.push(['start', [], allowVisitTwice])
  while (unvisited.length > 0) {
    let [next, path, allowVisitTwice] = unvisited.pop()
    if (next === 'end') {
      paths++
      continue
    }
    if (next === 'start' && path.length > 0) continue
    if (!bigCaves.has(next) && path.includes(next)) {
      if (!allowVisitTwice) continue
      else allowVisitTwice = false
    }
    graph[next].forEach(node =>
      unvisited.push([node, path.concat(next), allowVisitTwice])
    )
  }
  return paths
}

const test = `
end-MY
MY-xc
ho-NF
start-ho
NF-xc
NF-yf
end-yf
xc-TP
MY-qo
yf-TP
dc-NF
dc-xc
start-dc
yf-MY
MY-ho
EM-uh
xc-yf
ho-dc
uh-NF
yf-ho
end-uh
start-NF
`
  .trim()
  .split('\n')
  .map(line => line.split('-'))

console.log(enumeratePaths(test))
console.log(enumeratePaths(test, true))
