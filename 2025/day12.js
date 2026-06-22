const load = require('../loader')

function countFit({ shapes, regions }) {
  const areas = shapes.map(shape => {
    let area = 0;
    while (shape > 0) {
      area += shape & 1;
      shape >>= 1;
    }
    return area;
  });

  let fit = 0;
  const undetermined = [];
  regions.forEach((region, index) => {
    const trivial = trivialFit(region, shapes, areas);
    if (trivial > 0) fit += trivial;
    else if (trivial < 0) undetermined.push(index);
  });

  if (undetermined.length === 0) return fit;
  
  throw new Error('Unimplemented');
}

function trivialFit(region, shapes, areas) {
  const { w, h, quantities } = region;
  const minArea = shapes.reduce((sum, _, i) => sum + quantities[i] * areas[i], 0);
  if (minArea > w * h) return 0;

  const minQuantity = Math.floor(w / 3) * Math.floor(h / 3);
  const totalQuantity = quantities.reduce((sum, q) => sum + q, 0);
  if (minQuantity >= totalQuantity) return 1;

  return -1;
}


function parse(input) {
  const blocks = input.trim().split('\n\n');

  const shapes = blocks.slice(0, -1).map(block => {
    const flattened = block.split('\n').slice(1).join('');
    let bitValue = 1;
    let encoded = 0;
    for (const char of flattened) {
      if (char === '#') encoded += bitValue;
      bitValue <<= 1;
    }
    return encoded;
  });


  const regions = blocks[blocks.length - 1].split('\n').map(line => {
    const [left, right] = line.split(': ');
    const [w, h] = left.split('x').map(Number);
    const quantities = right.split(' ').map(Number);
    return { w, h, quantities };
  });

  return { shapes, regions };
}

const test = load('day12', __dirname)

console.log(countFit(parse(test)));
