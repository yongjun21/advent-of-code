function getHighestScore (players, marbles) {
  const score = Array(players)
  score.fill(0)

  let current = new Link(0)
  let marble = 1

  while (marble <= marbles) {
    if (marble % 23 === 0) {
      const player = (marble - 1) % players
      const removed = current.backward(7).remove()
      current = removed.next
      score[player] += marble++ + removed.value
    } else {
      current = current.forward(1).insert(marble++)
    }
  }

  return score.reduce((max, s) => s > max ? s : max, 0)
}

class Link {
  constructor (value, prev, next) {
    this.value = value
    this.prev = prev || this
    this.next = next || this
  }

  forward (steps) {
    let current = this
    while (steps-- > 0) {
      current = current.next
    }
    return current
  }

  backward (steps) {
    let current = this
    while (steps-- > 0) {
      current = current.prev
    }
    return current
  }

  insert (value) {
    const ref = new Link(value, this, this.next)
    ref.prev.next = ref
    ref.next.prev = ref
    return ref
  }

  remove () {
    this.prev.next = this.next
    this.next.prev = this.prev
    return this
  }
}

console.log(getHighestScore(468, 71843))
console.log(getHighestScore(468, 7184300))
