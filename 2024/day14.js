const load = require('../loader')

function safetyFactor(input, width, height, elapsed = 100) {
  let topleft = 0;
  let topright = 0;
  let bottomleft = 0;
  let bottomright = 0;
  input.forEach(row => {
    let finalX = (row.position[0] + elapsed * row.velocity[0]) % width;
    let finalY = (row.position[1] + elapsed * row.velocity[1]) % height;
    if (finalX < 0) finalX += width;
    if (finalY < 0) finalY += height;
    if (finalX < (width - 1) / 2 && finalY < (height - 1) / 2) topleft++;
    if (finalX > (width - 1) / 2 && finalY < (height - 1) / 2) topright++;
    if (finalX < (width - 1) / 2 && finalY > (height - 1) / 2) bottomleft++;
    if (finalX > (width - 1) / 2 && finalY > (height - 1) / 2) bottomright++;
  });
  return topleft * topright * bottomleft * bottomright;
}

function findEasterEgg(input, width, height, maxElapsed) {
  let elapsed = 0;
  while (true) {
    const unique = new Set();
    input.forEach(row => {
      let finalX = (row.position[0] + elapsed * row.velocity[0]) % width;
      let finalY = (row.position[1] + elapsed * row.velocity[1]) % height;
      if (finalX < 0) finalX += width;
      if (finalY < 0) finalY += height;
      unique.add(finalY * width + finalX);
    });
    if (unique.size === input.length) {
      renderEasterEgg(input, width, height, elapsed);
      return elapsed;
    }
    elapsed++;
  }
}

function renderEasterEgg(input, width, height, elapsed) {
  const screen = new Uint8Array(width * height);

  input.forEach(row => {
    let finalX = (row.position[0] + elapsed * row.velocity[0]) % width;
    let finalY = (row.position[1] + elapsed * row.velocity[1]) % height;
    if (finalX < 0) finalX += width;
    if (finalY < 0) finalY += height;
    screen[finalY * width + finalX]++;
  });
  const lines = [];
  for (let j = 0; j < height; j++) {
    const line = [];
    const offset = j * width;
    for (let i = 0; i < width; i++) {
      line.push(screen[offset + i] || ' ');
    }
    lines.push(line.join(''));
  }
  console.log(lines.join('\n'));
}

function parse(line) {
  const [position, velocity] = line
    .split(' ')
    .map(part => part.slice(2).split(',').map(Number));
  return { position, velocity };
}

const test = load('day14', __dirname).trim()  .split('\n')  .map(parse)

console.log(safetyFactor(test, 101, 103));
console.log(findEasterEgg(test, 101, 103));
