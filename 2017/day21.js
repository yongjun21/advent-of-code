const {getAssignments} = require('../helpers')

const eightBits = getAssignments(3)

function generatePatterns (input) {
  return eightBits.map(combi => flipNrotate(input, ...combi))
}

function flipNrotate (input, x2y, reverseX, reverseY) {
  const size = Math.sqrt(input.length)
  return function (i, j) {
    let [x, y] = [i, j]
    if (x2y) [x, y] = [y, x]
    if (reverseX) x = size - 1 - x
    if (reverseY) y = size - 1 - y
    return input[x * size + y]
  }
}

function enhanceImage (image, rules) {
  const size = image.length
  const enhanced = []

  let squareSize = size % 2 === 0 ? 2 : 3
  for (let i = 0; i < size / squareSize; i++) {
    for (let j = 0; j < size / squareSize; j++) {
      const match = rules.find(rule => {
        return generatePatterns(rule[0])
          .some(pattern => {
            for (let ii = 0; ii < squareSize; ii++) {
              for (let jj = 0; jj < squareSize; jj++) {
                if (pattern(ii, jj) !== image[i * squareSize + ii][j * squareSize + jj]) {
                  return false
                }
              }
            }
            return true
          })
      })

      for (let ii = 0; ii < squareSize + 1; ii++) {
        enhanced[i * (squareSize + 1) + ii] =
          enhanced[i * (squareSize + 1) + ii] || []
        for (let jj = 0; jj < squareSize + 1; jj++) {
          enhanced[i * (squareSize + 1) + ii][j * (squareSize + 1) + jj] =
            match[1][ii * (squareSize + 1) + jj]
        }
      }
    }
  }

  return enhanced
}

function generateArt (input, iterations = 5) {
  let image = [
    ['.', '#', '.'],
    ['.', '.', '#'],
    ['#', '#', '#']
  ]

  const rules = input.trim().split('\n')
    .map(line => line.replace(/\//g, '').split(' => '))

  while (iterations-- > 0) {
    image = enhanceImage(image, rules)
  }

  return image
    .reduce((sum, row) => sum + row.filter(pixel => pixel === '#').length, 0)
}

const test = `
../.. => ###/.##/#..
#./.. => #.#/..#/#..
##/.. => ###/.#./###
.#/#. => ##./###/...
##/#. => ##./###/#.#
##/## => #.#/#.#/###
.../.../... => #.#./#..#/#.##/#.#.
#../.../... => #.##/.##./#..#/.###
.#./.../... => #..#/#.#./.#../#.##
##./.../... => .#../...#/####/...#
#.#/.../... => ##.#/..#./...#/###.
###/.../... => #.#./#..#/####/##..
.#./#../... => ..##/..##/####/##.#
##./#../... => #.#./#.../..../##..
..#/#../... => .#.#/##.#/...#/####
#.#/#../... => .#../.###/.##./##.#
.##/#../... => ##../.#.#/#.../..##
###/#../... => ##.#/##.#/.###/##..
.../.#./... => ..#./..../##.#/#.#.
#../.#./... => ..##/.#.#/..#./###.
.#./.#./... => ...#/.#../.#.#/##..
##./.#./... => #..#/.###/##../#.#.
#.#/.#./... => ##.#/..#./.#../#..#
###/.#./... => #.#./####/#..#/#...
.#./##./... => ##../##.#/.###/##..
##./##./... => .#../####/.##./.#..
..#/##./... => ####/##.#/##.#/###.
#.#/##./... => .##./#.##/##.#/#...
.##/##./... => ..../#.##/##.#/##..
###/##./... => #.../.##./#.#./#...
.../#.#/... => #..#/..##/#.../#.##
#../#.#/... => ..##/..#./..#./..##
.#./#.#/... => ..##/####/####/....
##./#.#/... => ###./.#../##.#/#.#.
#.#/#.#/... => .##./#..#/..#./##..
###/#.#/... => ##.#/..#./#..#/...#
.../###/... => ..##/.#.#/#.../...#
#../###/... => ..##/#.##/#.#./..#.
.#./###/... => ##../..##/.##./...#
##./###/... => #.#./#.../#.../.##.
#.#/###/... => ##.#/..##/..##/.###
###/###/... => ..#./#..#/.#../.##.
..#/.../#.. => ###./#.#./#.##/#.##
#.#/.../#.. => ####/.##./#..#/.###
.##/.../#.. => #.#./..../..../##.#
###/.../#.. => .#.#/..../.#.#/###.
.##/#../#.. => ####/#..#/.##./####
###/#../#.. => ##../.#../..../###.
..#/.#./#.. => .###/##../#.##/...#
#.#/.#./#.. => ...#/####/#.../..#.
.##/.#./#.. => #.../####/.#.#/###.
###/.#./#.. => ####/..../.#../##..
.##/##./#.. => ..../###./##../.###
###/##./#.. => #.../#..#/#..#/###.
#../..#/#.. => ..../.###/.#../.#.#
.#./..#/#.. => .#.#/...#/#.#./##..
##./..#/#.. => .#../##.#/.#../.##.
#.#/..#/#.. => ##../#.##/.###/#.#.
.##/..#/#.. => #.#./..../.#.#/..##
###/..#/#.. => ...#/#.../...#/..#.
#../#.#/#.. => ##.#/..#./###./.###
.#./#.#/#.. => ..../##../.#.#/.###
##./#.#/#.. => ###./#.#./.#../.#.#
..#/#.#/#.. => ###./..../##.#/#..#
#.#/#.#/#.. => .#.#/#.##/#.../..#.
.##/#.#/#.. => .#.#/#.../##../####
###/#.#/#.. => #.##/..#./..##/....
#../.##/#.. => .#../.#../...#/#...
.#./.##/#.. => ##../#..#/###./##.#
##./.##/#.. => .#.#/#..#/..../#..#
#.#/.##/#.. => ##.#/..../##../##..
.##/.##/#.. => #.#./..#./#.../.#..
###/.##/#.. => #.#./##.#/####/....
#../###/#.. => ##../#.##/.#../.###
.#./###/#.. => #.../#.##/..../.#.#
##./###/#.. => ###./##../.#../..##
..#/###/#.. => ..#./.#../####/#..#
#.#/###/#.. => #.##/..#./..#./#.##
.##/###/#.. => .#../#.../####/#...
###/###/#.. => #.../..#./..../.##.
.#./#.#/.#. => .#.#/####/###./....
##./#.#/.#. => ##.#/###./#.##/#..#
#.#/#.#/.#. => ####/#.#./..../##..
###/#.#/.#. => ##.#/##../.###/..##
.#./###/.#. => .##./...#/##.#/.###
##./###/.#. => ..##/.#../..#./#...
#.#/###/.#. => ####/#.../..#./#.#.
###/###/.#. => #.../.###/..##/.#.#
#.#/..#/##. => ...#/###./#.#./#.##
###/..#/##. => ##../..#./###./##..
.##/#.#/##. => #.../#.#./#.#./#..#
###/#.#/##. => #.../##.#/#.#./....
#.#/.##/##. => ...#/#.#./...#/#...
###/.##/##. => .###/...#/#..#/###.
.##/###/##. => ###./.##./##.#/#..#
###/###/##. => #.../##../.###/.#..
#.#/.../#.# => #.../#..#/...#/#..#
###/.../#.# => .#../..##/.##./.#.#
###/#../#.# => ..../.#.#/###./#...
#.#/.#./#.# => ##.#/.#.#/#.##/...#
###/.#./#.# => ..../#.../#.../.###
###/##./#.# => ..##/.##./##.#/##.#
#.#/#.#/#.# => ..##/.#../..##/..#.
###/#.#/#.# => ..##/.###/...#/##..
#.#/###/#.# => ..#./.#.#/.###/####
###/###/#.# => #.#./##../#.#./##.#
###/#.#/### => #.#./..##/#.#./#...
###/###/### => ##../.###/###./#..#
`

console.log(generateArt(test))
console.log(generateArt(test, 18))
