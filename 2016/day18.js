function findSafeTiles (input, rows) {
  let safe = input.split('').reduce((sum, tile) => sum + (tile === '.' ? 1 : 0), 0)
  let row = 1
  let prevRow = input

  const isTrap = [
    '..^',
    '.^^',
    '^^.',
    '^..'
  ]

  while (row++ < rows) {
    let nextRow = ''
    for (let i = 0; i < prevRow.length; i++) {
      const center = prevRow[i]
      const left = prevRow[i - 1] || '.'
      const right = prevRow[i + 1] || '.'
      nextRow += isTrap.includes(left + center + right) ? '^' : '.'
    }
    prevRow = nextRow
    safe += nextRow.split('').reduce((sum, tile) => sum + (tile === '.' ? 1 : 0), 0)
  }

  return safe
}

const test = '.^^..^...^..^^.^^^.^^^.^^^^^^.^.^^^^.^^.^^^^^^.^...^......^...^^^..^^^.....^^^^^^^^^....^^...^^^^..^'

console.log(findSafeTiles(test, 40))
console.log(findSafeTiles(test, 400000))
