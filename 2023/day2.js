const load = require('../loader')

function sumPossibleGames(input) {
  return input.reduce((sum, row) => {
    const max = getMinimumSet(row);
    const possible = max.red <= 12 && max.green <= 13 && max.blue <= 14;
    return possible ? sum + row.game : sum;
  }, 0);
}

function sumPower(input) {
  return input.reduce((sum, row) => {
    const max = getMinimumSet(row);
    return sum + max.red * max.green * max.blue;
  }, 0);
}

function getMinimumSet(row) {
  const max = {
    red: 0,
    green: 0,
    blue: 0
  };
  row.draws.forEach(tally => {
    Object.keys(max).forEach(type => {
      max[type] = Math.max(max[type], tally[type] ?? 0);
    });
  });
  return max;
}

function parse(line) {
  let [game, draws] = line.split(': ');
  game = Number(game.split(' ')[1]);
  draws = draws.split('; ').map(draw => {
    const tally = {};
    draw.split(', ').forEach(item => {
      const [count, type] = item.split(' ');
      tally[type] = Number(count);
    });
    return tally;
  });
  return { game, draws };
}

const test = load('day2', __dirname).trim()  .split('\n')  .map(parse)

console.log(sumPossibleGames(test));
console.log(sumPower(test));
