function fft (input, phases = 100) {
  let output = [...input]
  while (phases-- > 0) {
    output = output.map((_, i) => {
      const pattern = patternGenerator(i + 1)
      pattern.next()
      const sum = output.reduce((sum, v) => sum + v * pattern.next().value, 0)
      return Math.abs(sum) % 10
    })
  }
  return output.slice(0, 8).join('')
}

function fft2 (input, phases = 100) {
  const offset = +input.slice(0, 7).join('')
  const working = Array(phases + 1).fill(input[input.length - 1])
  const message = []
  for (let i = input.length * 10000 - 2; i >= offset; i--) {
    working[0] = input[i % input.length]
    for (let j = 1; j < working.length; j++) {
      working[j] = (working[j - 1] + working[j]) % 10
    }
    if (i - offset < 8) message.unshift(working[working.length - 1])
  }
  return message.join('')
}

function * patternGenerator (n) {
  const base = [0, 1, 0, -1]
  let i = 0
  while (true) {
    for (let j = 0; j < n; j++) {
      yield base[i]
    }
    i++
    if (i === base.length) i = 0
  }
}

const test = '59740570066545297251154825435366340213217767560317431249230856126186684853914890740372813900333546650470120212696679073532070321905251098818938842748495771795700430939051767095353191994848143745556802800558539768000823464027739836197374419471170658410058272015907933865039230664448382679990256536462904281204159189130560932257840180904440715926277456416159792346144565015659158009309198333360851441615766440174908079262585930515201551023564548297813812053697661866316093326224437533276374827798775284521047531812721015476676752881281681617831848489744836944748112121951295833143568224473778646284752636203058705797036682752546769318376384677548240590'.split('').map(Number)

console.log(fft(test))
console.log(fft2(test))
