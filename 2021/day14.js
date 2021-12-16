function diffMostLeastCommon (seed, rules, steps = 10) {
  let tally = Object.create(null)
  for (let i = 1; i < seed.length; i++) {
    const key = seed.slice(i - 1, i + 1)
    tally[key] = tally[key] || 0
    tally[key]++
  }

  while (steps-- > 0) {
    const updated = Object.create(null)
    Object.keys(tally).forEach(key => {
      let matched = false
      for (const rule of rules) {
        if (key.charAt(0) === rule[0] && key.charAt(1) === rule[1]) {
          const keyA = rule[0] + rule[2]
          const keyB = rule[2] + rule[1]
          updated[keyA] = updated[keyA] || 0
          updated[keyB] = updated[keyB] || 0
          updated[keyA] += tally[key]
          updated[keyB] += tally[key]
          matched = true
          break
        }
      }
      if (!matched) {
        updated[key] = updated[key] || 0
        updated[key] += tally[key]
      }
    })
    tally = updated
  }

  const count = Object.create(null)
  Object.keys(tally).forEach(key => {
    const el = key.charAt(1)
    count[el] = count[el] || 0
    count[el] += tally[key]
  })
  count[seed.charAt(0)] = count[seed.charAt(0)] || 0
  count[seed.charAt(0)]++
  const sorted = Object.values(count).sort((a, b) => a - b)
  return sorted[sorted.length - 1] - sorted[0]
}

const seed = 'VFHKKOKKCPBONFHNPHPN'

const rules = `
VS -> B
HK -> B
FO -> P
NC -> F
VN -> C
BS -> O
HS -> K
NS -> C
CV -> P
NV -> C
PH -> H
PB -> B
PK -> K
HF -> P
FV -> C
NN -> H
VO -> K
VP -> P
BC -> B
KK -> S
OK -> C
PN -> H
SB -> V
KO -> P
KH -> C
KS -> S
FP -> B
PV -> B
BO -> C
OS -> H
NB -> S
SP -> C
HN -> N
FN -> B
PO -> O
FS -> O
NH -> B
SO -> P
OB -> S
KC -> C
OO -> H
BB -> V
SC -> F
NP -> P
SH -> C
BH -> O
BP -> F
CC -> S
BN -> H
SS -> P
BF -> B
VK -> P
OV -> H
FC -> S
VB -> S
PF -> N
HH -> O
HC -> V
CH -> B
HP -> H
FF -> H
VF -> V
CS -> F
KP -> F
OP -> H
KF -> F
PP -> V
OC -> C
PS -> F
ON -> H
BK -> B
HV -> S
CO -> K
FH -> C
FB -> F
OF -> V
SN -> S
PC -> K
NF -> F
NK -> P
NO -> P
CP -> P
CK -> S
HB -> H
BV -> C
SF -> K
HO -> H
OH -> B
KV -> S
KN -> F
SK -> K
VH -> S
CN -> S
VC -> P
CB -> H
SV -> S
VV -> P
CF -> F
FK -> F
KB -> V
`
  .trim()
  .split('\n')
  .map(line => [line[0], line[1], line[6]])

console.log(diffMostLeastCommon(seed, rules))
console.log(diffMostLeastCommon(seed, rules, 40))
