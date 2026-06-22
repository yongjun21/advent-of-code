const load = require('../loader')

function searchMarker (str) {
  const match = str.match(/\(([0-9]+)x([0-9]+)\)/)
  return match && {
    length: +match[1],
    repeat: +match[2],
    before: str.slice(0, match.index),
    compressed: str.slice(match.index + match[0].length, match.index + match[0].length + +match[1]),
    after: str.slice(match.index + match[0].length + +match[1])
  }
}

function decompress (input) {
  let remaining = input
  let decompressed = ''

  while (remaining.length > 0) {
    const marker = searchMarker(remaining)
    if (marker) {
      decompressed += marker.before
      for (let n = marker.repeat; n > 0; n--) {
        decompressed += marker.compressed
      }
      remaining = marker.after
    } else {
      decompressed += remaining
      remaining = ''
    }
  }

  return decompressed
}

function testSelfContained (str) {
  const marker = searchMarker(str)
  return !marker || ((marker.before.length + marker.length <= str.length) &&
    testSelfContained(marker.compressed + marker.after))
}

function recursedDecompress (input) {
  let length = 0
  let remaining = input

  while (remaining.length > 0) {
    const marker = searchMarker(remaining)
    if (marker) {
      length += marker.before.length
      if (testSelfContained(marker.compressed)) {
        length += marker.repeat * recursedDecompress(marker.compressed)
        remaining = marker.after
      } else {
        remaining = ''
        for (let n = marker.repeat; n > 0; n--) {
          remaining += marker.compressed
        }
        remaining += marker.after
      }
    } else {
      length += remaining.length
      remaining = ''
    }
  }
  return length
}

const test = load('day9', __dirname)

const cleaned = test.trim().replace('\n', '')
console.log(decompress(cleaned).length)
console.log(recursedDecompress(cleaned))
