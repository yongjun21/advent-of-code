const load = require('../loader')

const STRENGTH_ORDER = '23456789TJQKA';

function getTotalWinning(input, withJoker = false) {
  const sorted = input.sort((a, b) => {
    const tallyA = readHand(a.tally, withJoker)
    const tallyB = readHand(b.tally, withJoker)
    try {
      if (tallyA[0][1] !== tallyB[0][1]) return tallyA[0][1] - tallyB[0][1]
      if (tallyA[1] && tallyB[1] && tallyA[1][1] !== tallyB[1][1]) {
        return tallyA[1][1] - tallyB[1][1];
      }
    } catch(err) {
      console.log(tallyA, tallyB)
      throw err
    }

    for (let i = 0; i < a.hand.length; i++) {
      if (a.hand[i] !== b.hand[i]) {
        const strengthA =
          (withJoker && a.hand[i]) === 'J'
            ? -1
            : STRENGTH_ORDER.indexOf(a.hand[i]);
        const strengthB =
          (withJoker && b.hand[i]) === 'J'
            ? -1
            : STRENGTH_ORDER.indexOf(b.hand[i]);
        return strengthA - strengthB;
      }
    }
    return 0;
  });
  return sorted.reduce((sum, hand, i) => sum + hand.bid * (i + 1), 0);
}

function readHand(tally, withJoker = false) {
  if (!withJoker) return tally;
  if (tally.length === 1) return tally 
  const index = tally.findIndex(([card]) => card === 'J')
  if (index < 0) return tally;
  const jokers = tally[index][1];
  tally = [...tally]
  tally.splice(index, 1)
  tally[0] = [...tally[0]]
  tally[0][1] += jokers
  return tally
}

function parse(line) {
  const [hand, bid] = line.split(' ');
  const tally = {};
  for (const card of hand) {
    tally[card] = tally[card] || 0;
    tally[card]++;
  }
  return {
    hand,
    tally: Object.entries(tally).sort((a, b) => b[1] - a[1]),
    bid: Number(bid)
  };
}

const test = load('day7', __dirname).trim()  .split('\n')  .map(parse)

console.log(getTotalWinning(test));
console.log(getTotalWinning(test, true));
