const load = require('../loader')

function sumTotalSize (sizeList) {
  return [...sizeList.values()]
    .filter(size => size <= 100000)
    .reduce((sum, size) => sum + size, 0)
}

function findSmallestToDelete (sizeList) {
  const sorted = [...sizeList.values()].sort((a, b) => a - b)
  const unusedSpace = 70000000 - sorted[sorted.length - 1]
  const requiredToFree = 30000000 - unusedSpace
  return sorted.find(size => size >= requiredToFree)
}

function listDirSize (root) {
  const list = new Map()
  function getSize (dir) {
    const size = Object.keys(dir).reduce((sum, key) => {
      if (key === '..') return sum
      return sum + (typeof dir[key] === 'number' ? dir[key] : getSize(dir[key]))
    }, 0)
    list.set(dir, size)
    return size
  }
  getSize(root)
  return list
}

function populateFileSystem (input) {
  const root = { '..': null }
  let curr = root
  let stdout = false
  input.forEach(line => {
    const tokens = line.split(' ')
    if (tokens[0] === '$') stdout = false
    if (stdout) {
      const key = tokens[1]
      const value = tokens[0] === 'dir' ? { '..': curr } : +tokens[0]
      curr[key] = value
    } else {
      const command = tokens[1]
      if (command === 'ls') {
        stdout = true
      } else if (command === 'cd') {
        const dest = tokens[2]
        if (dest === '/') curr = root
        else curr = curr[dest]
      }
    }
  })
  return root
}

const test = load('day7', __dirname).trim().split('\n')

const root = populateFileSystem(test)
const dirSizeList = listDirSize(root)

console.log(sumTotalSize(dirSizeList))
console.log(findSmallestToDelete(dirSizeList))
