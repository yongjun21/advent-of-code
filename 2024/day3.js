const load = require('../loader');

function sumMul(input) {
  const re = /mul\(([1-9][0-9]{0,2}),([1-9][0-9]{0,2})\)/g;
  let sum = 0;
  let matched;
  while ((matched = re.exec(input)) !== null) {
    sum += Number(matched[1]) * Number(matched[2]); 
  }
  return sum;
}

function sumMul2(input) {
  const re = /(mul\(([1-9][0-9]{0,2}),([1-9][0-9]{0,2})\)|do\(\)|don't\(\))/g;
  let enabled = true;
  let sum = 0;
  let matched;
  while ((matched = re.exec(input)) !== null) {
    if (matched[1] === 'do()') {
      enabled = true;
    } else if (matched[1] === "don't()") {
      enabled = false;
    } else if (enabled) {
      sum += Number(matched[2]) * Number(matched[3]); 
    }
  }
  return sum;
}

const test = load('day3', __dirname);

console.log(sumMul(test));
console.log(sumMul2(test));
