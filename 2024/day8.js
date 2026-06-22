const load = require('../loader')

function countAntinode(input, iterDown, iterUp) {
  const width = input[0].length;
  const height = input.length;

  const grouped = {};
  for (let y = 0; y < height; y++) {
    const line = input[y];
    for (let x = 0; x < width; x++) {
      const char = line[x];
      if (char === '.') continue;
      grouped[char] = grouped[char] || [];
      grouped[char].push(y * width + x);
    }
  }

  const antinodes = new Set();
  Object.values(grouped).forEach(group => {
    if (group.length < 2) return;
    for (let i = 0; i < group.length - 1; i++) {
      const xi = group[i] % width;
      const yi = Math.trunc(group[i] / width);
      for (let j = i + 1; j < group.length; j++) {
        const xj = group[j] % width;
        const yj = Math.trunc(group[j] / width);
        for (const t of iterDown()) {
          const xt = (1 - t) * xi + t * xj;
          const yt = (1 - t) * yi + t * yj;
          if (xt >= 0 && xt < width && yt >= 0 && yt < height) {
            antinodes.add(yt * width + xt);
          } else {
            break;
          }
        }
        for (const t of iterUp()) {
          const xt = (1 - t) * xi + t * xj;
          const yt = (1 - t) * yi + t * yj;
          if (xt >= 0 && xt < width && yt >= 0 && yt < height) {
            antinodes.add(yt * width + xt);
          } else {
            break;
          }
        }
      }
    }
  });

  return antinodes.size;
}

function* countDownFrom(n) {
  while (true) {
    yield n;
    n--;
  }
}

function* countUpFrom(n) {
  while (true) {
    yield n;
    n++;
  }
}

const test = load('day8', __dirname).trim()  .split('\n')

console.log(countAntinode(test, () => [-1], () => [2]));
console.log(countAntinode(test, () => countDownFrom(0), () => countUpFrom(1)));
