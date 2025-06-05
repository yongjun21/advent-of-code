/**
 * bst: B = A & 111
 * bxl: B = B ^ 101
 * cdv: C = A >> B
 * adv: A = A >> 11
 * bxl: B = B ^ 110
 * bxc: B = B ^ C
 * out: out = B & 111
 * jnz: pointer = A not zero then 0
 */

function* runProgram(registers, instructions) {
  let pointer = 0;

  function getOperand(pointer, isCombo = false) {
    const operand = instructions[pointer + 1];
    return isCombo && operand > 3 ? registers[operand - 4] : operand;
  }

  while (pointer < instructions.length) {
    const opcode = instructions[pointer];

    if (opcode === 0) { // adv instruction
      registers[0] = registers[0] >>> getOperand(pointer, true);
      pointer += 2;
    } else if (opcode === 1) { // bxl instruction
      registers[1] = registers[1] ^ getOperand(pointer, false);
      pointer += 2;
    } else if (opcode === 2) { // bst instruction
      registers[1] = getOperand(pointer, true) & 7;
      pointer += 2;
    } else if (opcode === 3) { // jnz instruction
      if (registers[0] !== 0) {
        pointer = getOperand(pointer, false);
      } else {
        pointer += 2;
      }
    } else if (opcode === 4) { // bxc instruction
      registers[1] = registers[1] ^ registers[2];
      pointer += 2;
    } else if (opcode === 5) { // out instruction
      yield getOperand(pointer, true) & 7;
      pointer += 2;
    } else if (opcode === 6) { // bdv instruction
      registers[1] = registers[0] >>> getOperand(pointer, true);
      pointer += 2;
    } else if (opcode === 7) { // cdv instruction
      registers[2] = registers[0] >>> getOperand(pointer, true);
      pointer += 2;
    }
  }
}

const BITS = ["000", "001", "010", "011", "100", "101", "110", "111"];

function outputSelf(instructions) {
  const b1 = BITS.map((_, i) => i ^ 5);
  const b2 = BITS.map((_, i) => i ^ 5 ^ 6);
  function search(index, constraints = "0000000") {
    if (index < 0) return constraints;
    let searchResult = "";
    for (let i = 0; i < BITS.length; i++) {
      const test = constraints + BITS[i];
      const rightShift = b1[i];
      const c = b2[i] ^ instructions[index];
      const compare = test.slice(-3 - rightShift).slice(0, 3);
      if (compare === BITS[c]) {
        searchResult = search(index - 1, test);
        if (searchResult) return searchResult;
      }
    }
    return searchResult;
  }
  return parseInt(search(instructions.length - 1), 2);
}

const OPCODES = [
  { label: "adv", op: ">>", in1: "A", in2: "[combo]", out: "A" },
  { label: "bxl", op: "^", in1: "B", in2: "[literal]", out: "B" },
  { label: "bst", op: "&", in1: "[combo]", in2: "111", out: "B" },
  { label: "jnz", op: "not zero then", in1: "A", in2: "[literal]", out: "pointer" },
  { label: "bxc", op: "^", in1: "B", in2: "C", out: "B" },
  { label: "out", op: "&", in1: "[combo]", in2: "111", out: "out" },
  { label: "bdv", op: ">>", in1: "A", in2: "[combo]", out: "B" },
  { label: "cdv", op: ">>", in1: "A", in2: "[combo]", out: "C" },
]

function analyze(instructions) {
  function parse(representation, value) {
    return representation.replace("[literal]", value.toString(2)).replace("[combo]", value > 3 ? "ABC"[value - 4] : value.toString(2));
  }
  for (let i = 0; i < instructions.length; i += 2) {
    const opcode = instructions[i];
    const operand = instructions[i + 1];
    const op = OPCODES[opcode];
    const in1 = parse(op.in1, operand);
    const in2 = parse(op.in2, operand);

    console.log(`${op.label}: ${op.out} = ${in1} ${op.op} ${in2}`);
  }
}
const registers = [59590048, 0, 0];
const instructions = [2, 4, 1, 5, 7, 5, 0, 3, 1, 6, 4, 3, 5, 5, 3, 0];

console.log([...runProgram(registers, instructions)].join(","));
analyze(instructions);
console.log(outputSelf(instructions));
