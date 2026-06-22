const load = require('../loader')

function fewestToken(input, error = 0) {
  return input.reduce((sum, row) => {
    const dis = row.a * row.d - row.b * row.c;
    if (dis === 0) return sum;
    const A = (row.d * (row.e + error) - row.b * (row.f + error)) / dis;
    const B = (row.a * (row.f + error) - row.c * (row.e + error)) / dis;
    if (A > Math.floor(A) || B > Math.floor(B)) return sum;
    return sum + 3 * A + B
  }, 0);
}

function parse(block) {
  const matrix = block.split('\n').map(line =>
    line
      .split(': ')[1]
      .split(', ')
      .map(part => Number(part.slice(2)))
  );
  return {
    a: matrix[0][0],
    b: matrix[1][0],
    c: matrix[0][1],
    d: matrix[1][1],
    e: matrix[2][0],
    f: matrix[2][1]
  };
}

const test = load('day13', __dirname).trim()  .split('\n\n')  .map(parse)

console.log(fewestToken(test));
console.log(fewestToken(test, 10000000000000));
