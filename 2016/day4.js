const load = require('../loader')

function parseInput (input) {
  return input.trim().split('\n').map(line => {
    const match = line.match(/-([0-9]+)\[(.+)]$/)
    return {
      encryptedName: line.slice(0, match.index),
      sectorId: match[1],
      checksum: match[2]
    }
  })
}

function getRealRooms (input) {
  const rooms = parseInput(input)
  return rooms.filter(room => {
    const letters = {}
    room.encryptedName.split('').forEach(letter => {
      if (letter === '-') return
      letters[letter] = letters[letter] || 0
      letters[letter]++
    })

    const frequencies = {}
    Object.keys(letters).forEach(letter => {
      const freq = letters[letter]
      frequencies[freq] = frequencies[freq] || []
      frequencies[freq].push(letter)
    })

    const checksum = Object.keys(frequencies)
      .sort((a, b) => +b - +a)
      .reduce((list, freq) => {
        const ordered = frequencies[freq].sort()
        list.push(...ordered)
        return list
      }, [])
      .slice(0, 5)
      .join('')

    return room.checksum === checksum
  })
}

function validateChecksum (input) {
  return getRealRooms(input).reduce((sum, room) => sum + +room.sectorId, 0)
}

function decrypt (input) {
  const realRooms = getRealRooms(input)
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'
  return realRooms.map(room => {
    room.decryptedName = room.encryptedName.split('').map(letter => {
      if (letter === '-') return ' '
      const index = alphabet.indexOf(letter)
      const offsetted = (index + +room.sectorId) % 26
      return alphabet[offsetted]
    }).join('')
    return room
  })
}

const test = load('day4', __dirname)

console.log(validateChecksum(test))
console.log(decrypt(test).filter(room => room.decryptedName.indexOf('north') > -1))
