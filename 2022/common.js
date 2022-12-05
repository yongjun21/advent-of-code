class MinHeap {
  constructor (comparator = (a, b) => a - b) {
    this._data = []
    this._comparator = comparator
  }

  push (...values) {
    for (const v of values) {
      let cIndex = this._data.push(v) - 1
      while (cIndex > 0) {
        const pIndex = Math.floor((cIndex - 1) / 2)
        if (this._swap(pIndex, cIndex)) cIndex = pIndex
        else break
      }
    }
    return this
  }

  pop () {
    if (this._data.length <= 1) return this._data.pop()
    const min = this._data[0]
    this._data[0] = this._data.pop()
    this._heapify(0)
    return min
  }

  peek () {
    return this._data[0]
  }

  _swap (pIndex, cIndex) {
    const parent = this._data[pIndex]
    const child = this._data[cIndex]
    if (this._comparator(child, parent) < 0) {
      this._data[pIndex] = child
      this._data[cIndex] = parent
      return true
    }
    return false
  }

  _heapify (pIndex) {
    while (true) {
      const lIndex = pIndex * 2 + 1
      const rIndex = lIndex + 1
      if (lIndex >= this._data.length) break
      let mIndex = lIndex
      if (rIndex < this._data.length) {
        const left = this._data[lIndex]
        const right = this._data[rIndex]
        if (this._comparator(right, left) < 0) mIndex = rIndex
      }
      if (this._swap(pIndex, mIndex)) pIndex = mIndex
      else break
    }
  }

  get size () {
    return this._data.length
  }

  * [Symbol.iterator] () {
    while (this.size > 0) yield this.pop()
  }
}

exports.MinHeap = MinHeap
