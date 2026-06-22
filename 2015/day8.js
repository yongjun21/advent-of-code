const load = require('../loader')

function readWriteString (input) {
  const lines = input.trim().split('\n')
  return lines.map(line => {
    const decoded = line
      .replace(/\\\\/g, '/')
      .replace(/\\"/g, '"')
      .replace(/\\x(..)/g, (match, p1) => String.fromCharCode(parseInt(p1, 16)))
      .match(/^"(.*)"$/)[1]
    const encoded = '"' + line.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'
    return {original: line, decoded, encoded}
  })
}

const test = load('day8', __dirname)

const manipulated = readWriteString(test)

const decodedDiff = manipulated.reduce((sum, item) => sum + item.original.length - item.decoded.length, 0)
const encodedDiff = manipulated.reduce((sum, item) => sum + item.encoded.length - item.original.length, 0)

console.log(decodedDiff, encodedDiff)
