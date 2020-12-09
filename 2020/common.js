exports.parseBatch = function (input, fn, d = () => ({})) {
  const data = []
  let datum = d()
  data.push(datum)
  input.trim().split('\n').forEach(line => {
    line = line.trim()
    if (line.length === 0) {
      datum = d()
      data.push(datum)
    } else {
      fn(line, datum)
    }
  })
  return data
}
