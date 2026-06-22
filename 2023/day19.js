const load = require('../loader')

function sumAccepted(workflows, parts) {
  return parts.reduce((sum, part) => {
    let workflow = 'in';
    while (workflow !== 'A' && workflow !== 'R') {
      const rules = workflows[workflow];
      for (const rule of rules) {
        if (rule.comparator) {
          if (rule.comparator === '<' && part[rule.attr] < rule.value) {
            workflow = rule.goto;
            break;
          }
          if (rule.comparator === '>' && part[rule.attr] > rule.value) {
            workflow = rule.goto;
            break;
          }
        } else {
          workflow = rule.goto;
        }
      }
    }
    return workflow === 'A' ? sum + part.x + part.m + part.a + part.s : sum;
  }, 0);
}

function countCombinations(
  workflows,
  subsets = { x: [], m: [], a: [], s: [] },
  goto = 'in'
) {
  if (goto === 'R') return 0;
  if (goto === 'A') {
    return (
      countSubset(subsets.x) *
      countSubset(subsets.m) *
      countSubset(subsets.a) *
      countSubset(subsets.s)
    );
  }
  const rules = workflows[goto];
  let ifSubsets = subsets;
  return rules.reduce((sum, rule) => {
    if (rule.comparator) {
      const [thenSubset, elseSubset] = applyRule(ifSubsets[rule.attr], rule);
      const thenSubsets = { ...ifSubsets, [rule.attr]: thenSubset };
      const elseSubsets = { ...ifSubsets, [rule.attr]: elseSubset };
      ifSubsets = elseSubsets;
      return sum + countCombinations(workflows, thenSubsets, rule.goto);
    } else {
      return sum + countCombinations(workflows, ifSubsets, rule.goto);
    }
  }, 0);
}

function applyRule(subset, rule) {
  const cut = rule.value + (rule.comparator === '<' ? 0 : 1);
  const index = subset.findLastIndex(v => v <= cut);
  let leftBranch, rightBranch;
  if (index <= 0) {
    leftBranch = [cut];
    rightBranch = [1, cut, ...subset];
  } else if (index % 2 === 0) {
    leftBranch = subset.slice(0, index + 1);
    rightBranch = [1, ...subset.slice(index + 1)];
  } else if (subset[index] === cut) {
    leftBranch = subset.slice(0, index);
    rightBranch = [1, ...subset.slice(index)];
  } else {
    leftBranch = [...subset.slice(0, index + 1), cut];
    rightBranch = [1, cut, ...subset.slice(index + 1)];
  }
  return rule.comparator === '<'
    ? [leftBranch, rightBranch]
    : [rightBranch, leftBranch];
}

function countSubset(subset) {
  if (subset.length === 0) return 4000;
  let count = 0;
  count += subset[0] - 1;
  for (let i = 1; i < subset.length - 1; i += 2) {
    count += subset[i + 1] - subset[i];
  }
  if (subset.length % 2 === 0) count += 4001 - subset[subset.length - 1];
  return count;
}

function parseWorkflow(line) {
  const [name, rest] = line.split('{');
  const rules = rest.slice(0, -1).split(',');
  return [
    name,
    rules.map(substr => {
      const splitted = substr.split(':');
      const rule = { goto: splitted[1] ?? splitted[0] };
      if (splitted.length > 1) {
        Object.assign(rule, {
          attr: splitted[0][0],
          comparator: splitted[0][1],
          value: Number(splitted[0].slice(2))
        });
      }
      return rule;
    })
  ];
}

function parsePart(line) {
  const attrs = line.slice(1, -1).split(',');
  return Object.fromEntries(
    attrs.map(attr => {
      const [cat, rating] = attr.split('=');
      return [cat, Number(rating)];
    })
  );
}

const input = load('day19', __dirname)
const sections = input.split('\n\n')
const test = Object.fromEntries(sections[0].split('\n').map(parseWorkflow))
const parts = sections[1].split('\n').map(parsePart);

console.log(sumAccepted(test, parts));
console.log(countCombinations(test));
