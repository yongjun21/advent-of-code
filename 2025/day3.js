const load = require('../loader')

function totalOutputJoltage(input, digits = 2) {
  let sum = 0;
  for (const bank of input) {
    const n = bank.length;
    let output = 0;
    let currIndex = 0;
    let k = digits;
    while (k > 0) {
      output = output * 10;
      let pick = 1;
      const maxIndex = n - k;
      for (let i = currIndex; i <= maxIndex; i++) {
        if (bank[i] > pick) {
          pick = bank[i];
          currIndex = i + 1;
        }    
        if (pick >= 9) break;
      }
      output += pick;
      k--;
    }
    sum += output;
  }
  return sum;
}

const test = load('day3', __dirname).trim().split('\n').map(line => line.split('').map(Number))

console.log(totalOutputJoltage(test));
console.log(totalOutputJoltage(test, 12));
