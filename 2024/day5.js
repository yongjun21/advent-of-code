const load = require('../loader')

function countRightOrder(updates, rules) {
  const wrong = new Set();
  rules.forEach(([before, after]) => wrong.add(after * 100 + before));
  return updates.reduce((sum, pages) => {
    for (let i = 0; i < pages.length - 1; i++) {
      for (let j = i + 1; j < pages.length; j++) {
        if (wrong.has(pages[i] * 100 + pages[j])) return sum;
      }
    }
    const middle = pages[(pages.length - 1) / 2];
    return sum + middle;
  }, 0);
}

function fixWrongOrder(updates, rules) {
  const wrong = new Set();
  rules.forEach(([before, after]) => wrong.add(after * 100 + before));
  return updates.reduce((sum, pages) => {
    let reordered = false;
    for (let i = 0; i < pages.length - 1; i++) {
      let j = i + 1;
      while (j < pages.length) {
        if (wrong.has(pages[i] * 100 + pages[j])) {
          [pages[i], pages[j]] = [pages[j], pages[i]];
          reordered = true;
          j = i + 1;
        } else {
          j++;
        }
      }
    }
    if (!reordered) return sum;
    const middle = pages[(pages.length - 1) / 2];
    return sum + middle;
  }, 0);
}

const [rulesInput, testInput] = load('day5', __dirname).trim().split('\n\n')
const rules = rulesInput.split('\n').map(line => line.split('|').map(Number))
const test = testInput.split('\n').map(line => line.split(',').map(Number))

console.log(countRightOrder(test, rules));
console.log(fixWrongOrder(test, rules));
