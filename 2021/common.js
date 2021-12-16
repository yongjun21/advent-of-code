class LinkedList {
  constructor (value, next) {
    this.value = value
    this.next = next
  }

  push (value) {
    this.next = new LinkedList(value, this.next)
    return this.next
  }

  pop () {
    const el = this.next
    if (el) this.next = el.next
    return el
  }

  peek () {
    if (this.next) return this.next.value
  }

  * [Symbol.iterator] () {
    let curr = this.next
    while (curr) {
      yield curr.value
      curr = curr.next
    }
  }
}

exports.LinkedList = LinkedList
