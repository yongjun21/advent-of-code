function advanceGenerations (initial, patterns, generations) {
  let state = initial
  let offset = 0

  const memo = {}

  memo[state] = [generations, offset]
  while (generations > 0) {
    [state, offset] = advanceOneGeneration(state, offset, patterns)
    generations--
    if (state in memo) {
      const skip = memo[state][0] - generations
      const fastforward = Math.floor(generations / skip)
      generations -= fastforward * skip
      offset += fastforward * (offset - memo[state][1])
    } else {
      memo[state] = [generations, offset]
    }
  }
  return state.split('').reduce((sum, v, i) => sum + (v === '#' ? i + offset : 0), 0)
}

function advanceOneGeneration (state, offset, patterns) {
  const padded = '....' + state + '....'

  let next = ''
  for (let index = -2; index < state.length + 2; index++) {
    const pattern = padded.slice(index + 2, index + 7)
    next += patterns[pattern]
  }

  const head = next.indexOf('#')
  const tail = next.lastIndexOf('#')

  return [next.slice(head, tail + 1), offset - 2 + head]
}

function getPatterns (input) {
  return input.reduce((obj, line) => {
    obj[line.slice(0, 5)] = line.slice(-1)
    return obj
  }, {})
}

const initial = '###.#..#..##.##.###.#.....#.#.###.#.####....#.##..#.#.#..#....##..#.##...#.###.#.#..#..####.#.##.#'

const spread = `
#.... => .
#.##. => #
..#.. => .
#.#.# => .
.#.## => #
...## => #
##... => #
###.. => #
#..## => .
.###. => .
###.# => #
..... => .
#..#. => .
.#.#. => #
##..# => #
.##.. => .
...#. => .
#.### => .
..### => .
####. => .
#.#.. => #
.##.# => #
.#... => #
##.#. => #
....# => .
..#.# => #
#...# => #
..##. => .
.#..# => #
.#### => .
##### => #
##.## => #
`.trim().split('\n')

const patterns = getPatterns(spread)

console.log(advanceGenerations(initial, patterns, 20))
console.log(advanceGenerations(initial, patterns, 50000000000))
