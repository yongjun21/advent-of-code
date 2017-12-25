function createTuringMachine (input, steps) {
  let cursor = 0
  let state = input['A']

  const tape = {}

  while (steps-- > 0) {
    const next = state[tape[cursor] || 0]
    tape[cursor] = next[0]
    cursor += next[1]
    state = input[next[2]]
  }

  return Object.keys(tape).reduce((sum, pointer) => sum + tape[pointer], 0)
}

const test = {
  A: [[1, 1, 'B'], [1, -1, 'E']],
  B: [[1, 1, 'C'], [1, 1, 'F']],
  C: [[1, -1, 'D'], [0, 1, 'B']],
  D: [[1, 1, 'E'], [0, -1, 'C']],
  E: [[1, -1, 'A'], [0, 1, 'D']],
  F: [[1, 1, 'A'], [1, 1, 'C']]
}

console.log(createTuringMachine(test, 12523873))

/*
Begin in state A.
Perform a diagnostic checksum after 12523873 steps.

In state A:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state B.
  If the current value is 1:
    - Write the value 1.
    - Move one slot to the left.
    - Continue with state E.

In state B:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state C.
  If the current value is 1:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state F.

In state C:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the left.
    - Continue with state D.
  If the current value is 1:
    - Write the value 0.
    - Move one slot to the right.
    - Continue with state B.

In state D:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state E.
  If the current value is 1:
    - Write the value 0.
    - Move one slot to the left.
    - Continue with state C.

In state E:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the left.
    - Continue with state A.
  If the current value is 1:
    - Write the value 0.
    - Move one slot to the right.
    - Continue with state D.

In state F:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state A.
  If the current value is 1:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state C.
*/
