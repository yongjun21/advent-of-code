const load = require('../loader')

function sumSecretNumbers(input, n = 2000) {
  return input.reduce((sum, num) => {
    for (let i = 0; i < n; i++) {
      num = (num ^ (num << 6)) & 16777215;
      num = (num ^ (num >>> 5)) & 16777215;
      num = (num ^ (num << 11)) & 16777215;
    }
    return sum + num;
  }, 0);
}

function mostBananas(input, n = 2000) {
  const tally = new Map();
  input.forEach(num => {
    const ones = new Int8Array(n);
    const delta = new Int8Array(n);
    let prevOne = num % 10;
    for (let i = 0; i < n; i++) {
      num = (num ^ (num << 6)) & 16777215;
      num = (num ^ (num >>> 5)) & 16777215;
      num = (num ^ (num << 11)) & 16777215;
      const currOne = num % 10;
      delta[i] = currOne - prevOne;
      ones[i] = currOne;
      prevOne = num % 10;
    }
    const r0 = n % 4;
    const r1 = r0 < 1 ? r0 + 3 : r0 - 1;
    const r2 = r0 < 2 ? r0 + 2 : r0 - 2;
    const r3 = r0 < 3 ? r0 + 1 : r0 - 3;
    const offset0 = delta.slice(0, n - r0);
    const offset1 = delta.slice(1, n - r1);
    const offset2 = delta.slice(2, n - r2);
    const offset3 = delta.slice(3, n - r3);
    const sequence0 = new Uint32Array(offset0.buffer);
    const sequence1 = new Uint32Array(offset1.buffer);
    const sequence2 = new Uint32Array(offset2.buffer);
    const sequence3 = new Uint32Array(offset3.buffer);
    const sequences = [sequence0, sequence1, sequence2, sequence3];
    const visited = new Set();
    for (let i = 0; i < n - 3; i += 1) {
      const key = sequences[i % 4][Math.floor(i / 4)];
      if (visited.has(key)) continue;
      visited.add(key);
      tally.set(key, (tally.get(key) || 0) + ones[i + 3]);
    }
  });
  let max = -1;
  for (const value of tally.values()) {
    if (value > max) max = value;
  }
  return max;
}

const test = load('day22', __dirname).trim()  .split('\n')  .map(Number)

console.log(sumSecretNumbers(test));
console.log(mostBananas(test));
