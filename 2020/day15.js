function play (input, turns) {
  let prev
  const memo = new Map()
  input.forEach((v, i) => {
    if (i < input.length - 1) memo.set(v, i + 1)
    else prev = v
  })
  for (let turn = input.length + 1; turn <= turns; turn++) {
    const last = memo.get(prev)
    const next = last ? (turn - 1 - last) : 0
    memo.set(prev, turn - 1)
    prev = next
  }
  return prev
}

const test = [11, 18, 0, 20, 1, 7, 16]

console.log(play(test, 2020))
console.log(play(test, 30000000))
