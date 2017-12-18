function parseReplacements (input) {
  const replacements = {}
  input.trim().split('\n').forEach(line => {
    const [key, value] = line.split(' => ')
    replacements[key] = replacements[key] || []
    replacements[key].push(value)
  })
  return replacements
}

function invertReplacements (replacements) {
  const inverted = {}
  Object.keys(replacements).forEach(value => {
    replacements[value].forEach(key => {
      inverted[key] = inverted[key] || []
      inverted[key].push(value)
    })
  })
  return inverted
}

function singlePass (input, replacements) {
  const molecules = {}

  let index = 0
  while (true) {
    const matches = Object.keys(replacements)
      .map(key => ({element: key, index: input.indexOf(key, index)}))
      .filter(element => element.index > -1)
    if (matches.length === 0) break
    const nearest = Math.min(...matches.map(element => element.index))
    const target = matches.find(element => element.index === nearest)

    replacements[target.element].forEach(replacement => {
      const replaced =
        input.slice(0, target.index) +
        replacement +
        input.slice(target.index + target.element.length)
      molecules[replaced] = 1
    })

    index = target.index + 1
  }

  return Object.keys(molecules)
}

function makeMolecule (input, replacements) {
  const target = replacements['e']
  delete replacements['e']
  const invertedReplacements = invertReplacements(replacements)

  const molecules = {}
  const intermediates = []
  intermediates.push([input, 0])
  while (intermediates.length > 0) {
    const [molecule, steps] = intermediates.pop()
    if (target.includes(molecule)) return steps + 1
    if (molecule in molecules) continue
    molecules[molecule] = 1
    singlePass(molecule, invertedReplacements)
      .sort((a, b) => countElements(b) - countElements(a))
      .forEach(intermediate => {
        intermediates.push([intermediate, steps + 1])
      })
  }
}

function countElements (molecule) {
  return molecule.replace(/[a-z]/g, '').length
}

const replacements = parseReplacements(`
Al => ThF
Al => ThRnFAr
B => BCa
B => TiB
B => TiRnFAr
Ca => CaCa
Ca => PB
Ca => PRnFAr
Ca => SiRnFYFAr
Ca => SiRnMgAr
Ca => SiTh
F => CaF
F => PMg
F => SiAl
H => CRnAlAr
H => CRnFYFYFAr
H => CRnFYMgAr
H => CRnMgYFAr
H => HCa
H => NRnFYFAr
H => NRnMgAr
H => NTh
H => OB
H => ORnFAr
Mg => BF
Mg => TiMg
N => CRnFAr
N => HSi
O => CRnFYFAr
O => CRnMgAr
O => HP
O => NRnFAr
O => OTi
P => CaP
P => PTi
P => SiRnFAr
Si => CaSi
Th => ThCa
Ti => BP
Ti => TiTi
e => HF
e => NAl
e => OMg
`)

const test = 'CRnCaCaCaSiRnBPTiMgArSiRnSiRnMgArSiRnCaFArTiTiBSiThFYCaFArCaCaSiThCaPBSiThSiThCaCaPTiRnPBSiThRnFArArCaCaSiThCaSiThSiRnMgArCaPTiBPRnFArSiThCaSiRnFArBCaSiRnCaPRnFArPMgYCaFArCaPTiTiTiBPBSiThCaPTiBPBSiRnFArBPBSiRnCaFArBPRnSiRnFArRnSiRnBFArCaFArCaCaCaSiThSiThCaCaPBPTiTiRnFArCaPTiBSiAlArPBCaCaCaCaCaSiRnMgArCaSiThFArThCaSiThCaSiRnCaFYCaSiRnFYFArFArCaSiRnFYFArCaSiRnBPMgArSiThPRnFArCaSiRnFArTiRnSiRnFYFArCaSiRnBFArCaSiRnTiMgArSiThCaSiThCaFArPRnFArSiRnFArTiTiTiTiBCaCaSiRnCaCaFYFArSiThCaPTiBPTiBCaSiThSiRnMgArCaF'

console.log(singlePass(test, replacements).length)
console.log(makeMolecule(test, replacements))
