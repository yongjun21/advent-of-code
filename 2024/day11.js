function countStones(input, blinks = 25) {
  const memo = new Map();
  function count(start, times = blinks) {
    if (times <= 0) return 1;
    const key = start * (blinks + 1) + times;
    const memorized = memo.get(key);
    if (memorized != null) return memorized;

    if (start === 0) {
      const result = count(1, times - 1);
      memo.set(key, result);
      return result;
    }

    const k = Math.log10(start);
    if ((k & 1) === 0) {
      const result = count(start * 2024, times - 1);
      memo.set(key, result);
      return result;
    }

    const part = Math.floor(k) / 2 + 0.5;
    const mod = Math.pow(10, part);
    const left = Math.floor(start / mod);
    const right = start % mod;
    const result = count(left, times - 1) + count(right, times - 1);
    memo.set(key, result);
    return result;
  }

  return input.reduce((sum, v) => sum + count(v), 0);
}

const test = [6571, 0, 5851763, 526746, 23, 69822, 9, 989];

console.log(countStones(test));
console.log(countStones(test, 75));
