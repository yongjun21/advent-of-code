const HEX_BASES = [8, 4, 2, 1]

function getVersionSum (input) {
  const iter = hex2bin(input)
  const parsed = parse(iter)
  return sumVersion(parsed)
}

function evaluate (input) {
  const iter = hex2bin(input)
  const parsed = parse(iter)
  return parsed.value
}

function sumVersion (packet) {
  return (
    packet.version + packet.sub.reduce((sum, sub) => sum + sumVersion(sub), 0)
  )
}

function parse (iter) {
  const reader = getReader(iter)
  const version = reader.read(3)
  const type = reader.read(3)
  if (type === 4) {
    let isLast
    let value = 0
    do {
      value *= 16
      isLast = reader.read() === 0
      value += reader.read(4)
    } while (!isLast)
    return {
      version,
      type,
      value,
      sub: [],
      bitLength: reader.bits
    }
  } else {
    const lengthType = reader.read()
    const sub = []
    let length = reader.read(lengthType === 0 ? 15 : 11)
    while (length > 0) {
      const next = parse(iter)
      sub.push(next)
      length -= lengthType === 0 ? next.bitLength : 1
    }
    return {
      version,
      type,
      value: getValueFromSubPackets(type, sub),
      sub,
      bitLength: reader.bits + sub.reduce((sum, packet) => sum + packet.bitLength, 0)
    }
  }
}

function getValueFromSubPackets (type, sub) {
  switch (type) {
    case 0:
      return sub.reduce((sum, packet) => sum + packet.value, 0)
    case 1:
      return sub.reduce((product, packet) => product * packet.value, 1)
    case 2:
      return Math.min(...sub.map(packet => packet.value))
    case 3:
      return Math.max(...sub.map(packet => packet.value))
    case 5:
      return sub[0].value > sub[1].value ? 1 : 0
    case 6:
      return sub[0].value < sub[1].value ? 1 : 0
    case 7:
      return sub[0].value === sub[1].value ? 1 : 0
  }
}

function getReader (iter) {
  return {
    read (n = 1) {
      this.bits += n
      let value = ''
      while (n > 0) {
        const next = iter.next()
        if (next.done) break
        value += next.value
        n--
      }
      this.bits -= n
      return parseInt(value, 2)
    },
    bits: 0
  }
}

function * hex2bin (input) {
  for (const char of input) {
    let v = parseInt(char, 16)
    for (const base of HEX_BASES) {
      if (v >= base) {
        yield '1'
        v -= base
      } else {
        yield '0'
      }
    }
  }
}

const test =
  'E058F79802FA00A4C1C496E5C738D860094BDF5F3ED004277DD87BB36C8EA800BDC3891D4AFA212012B64FE21801AB80021712E3CC771006A3E47B8811E4C01900043A1D41686E200DC4B8DB06C001098411C22B30085B2D6B743A6277CF719B28C9EA11AEABB6D200C9E6C6F801F493C7FE13278FFC26467C869BC802839E489C19934D935C984B88460085002F931F7D978740668A8C0139279C00D40401E8D1082318002111CE0F460500BE462F3350CD20AF339A7BB4599DA7B755B9E6B6007D25E87F3D2977543F00016A2DCB029009193D6842A754015CCAF652D6609D2F1EE27B28200C0A4B1DFCC9AC0109F82C4FC17880485E00D4C0010F8D110E118803F0DA1845A932B82E200D41E94AD7977699FED38C0169DD53B986BEE7E00A49A2CE554A73D5A6ED2F64B4804419508B00584019877142180803715224C613009E795E58FA45EA7C04C012D004E7E3FE64C27E3FE64C24FA5D331CFB024E0064DEEB49D0CC401A2004363AC6C8344008641B8351B08010882917E3D1801D2C7CA0124AE32DD3DDE86CF52BBFAAC2420099AC01496269FD65FA583A5A9ECD781A20094CE10A73F5F4EB450200D326D270021A9F8A349F7F897E85A4020CF802F238AEAA8D22D1397BF27A97FD220898600C4926CBAFCD1180087738FD353ECB7FDE94A6FBCAA0C3794875708032D8A1A0084AE378B994AE378B9A8007CD370A6F36C17C9BFCAEF18A73B2028C0A004CBC7D695773FAF1006E52539D2CFD800D24B577E1398C259802D3D23AB00540010A8611260D0002130D23645D3004A6791F22D802931FA4E46B31FA4E4686004A8014805AE0801AC050C38010600580109EC03CC200DD40031F100B166005200898A00690061860072801CE007B001573B5493004248EA553E462EC401A64EE2F6C7E23740094C952AFF031401A95A7192475CACF5E3F988E29627600E724DBA14CBE710C2C4E72302C91D12B0063F2BBFFC6A586A763B89C4DC9A0'

console.log(getVersionSum(test))
console.log(evaluate(test))
