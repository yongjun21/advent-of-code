function findHouseNumber (input, perHouse, maxHouses = Infinity) {
  const houses = []

  class Elf {
    constructor (n) {
      this.i = n
      this.n = n
      this.remaining = maxHouses
    }

    next (until) {
      while (this.i <= until && this.remaining-- > 0) {
        houses[this.i] = houses[this.i] || 0
        houses[this.i] += this.n * perHouse
        this.i += this.n
      }
    }
  }

  let elves = []

  let until = 1
  while (true) {
    while (elves.length < until) {
      elves.push(new Elf(elves.length + 1))
    }
    for (let elf of elves) elf.next(until)
    const houseNumber = houses.findIndex(house => house >= input)
    if (houseNumber > -1) {
      return houseNumber
    }
    until *= 2
  }
}

const test = 33100000

console.log(findHouseNumber(test, 10))
console.log(findHouseNumber(test, 11, 50))
