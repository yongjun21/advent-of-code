function bootMachine (input) {
  let current = [1, 1]
  let code = 20151125

  while ((current[0] !== input[0]) || (current[1] !== input[1])) {
    if (current[1] > 1) current = [current[0] + 1, current[1] - 1]
    else current = [1, current[0] + 1]
    code = (code * 252533) % 33554393
  }

  return code
}

const test = [3083, 2978]

console.log(bootMachine(test))
