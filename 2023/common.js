function findLCM(...numbers) {
  const combined = new Map();
  numbers.forEach(n => {
    const tally = new Map();
    for (const prime of getPrimeFactors(n)) {
      const count = tally.get(prime) ?? 0;
      tally.set(prime, count + 1);
    };
    for (const [prime, count] of tally) {
      const maxCount = combined.get(prime) ?? count;
      combined.set(prime, Math.max(maxCount, count))
    }
  });
  return [...combined].reduce((product, [prime, count]) => {
    return product * Math.pow(prime, count);
  }, 1);
}

function* getPrimeFactors(number) {
  let found;
  for (let f = 2; f <= Math.floor(Math.sqrt(number)); f++) {
    if (number % f === 0) {
      yield f;
      found = f;
      break;
    }
  }
  if (found == null) yield number;
  else yield* getPrimeFactors(number / found);
}

function* getFactors(number) {
  if (number === 1) {
    yield 1;
    return;
  }

  const tally = new Map();
  for (const prime of getPrimeFactors(number)) {
    const count = tally.get(prime) ?? 0;
    tally.set(prime, count + 1);
  }
  const tallyEntries = [...tally.entries()];

  const unvisited = [];
  unvisited.push([]);

  while (unvisited.length > 0) {
    const next = unvisited.pop();
    if (next.length >= tallyEntries.length) {
      yield tallyEntries.reduce(
        (product, [prime], i) => product * Math.pow(prime, next[i]),
        1
      );
    } else {
      for (let k = tallyEntries[next.length][1]; k >= 0; k--) {
        unvisited.push([...next, k]);
      }
    }
  }
}

module.exports = { findLCM, getPrimeFactors, getFactors };
