const load = require('../loader')

const assert = require('assert')
const { parseBatch } = require('./common')

function findCorners (input) {
  const tiles = assemble(input)
  const dim = Math.sqrt(tiles.length)
  return [0, dim - 1, dim * dim - 1, dim * dim - dim].reduce((product, index) => product * tiles[index].id, 1)
}

function seaMonster (input, target) {
  const fDim = [target[0].length, target.length]
  target = target.join('')

  const tiles = assemble(input)
  const trimmed = tiles.map(tile => trim(tile.image))
  const stitched = stitch(trimmed)

  const image = new Uint8Array(stitched.length)
  image.forEach((v, i) => {
    if (stitched[i] === '#') image[i] = 1
  })

  const filter = new Uint8Array(fDim[0] * fDim[1])
  filter.forEach((v, i) => {
    if (target[i] === '#') filter[i] = 1
  })

  const transforms = getTransforms(Math.sqrt(image.length))
  const convolutions = transforms.map(t => convolve(image, t, filter, fDim))
  const matched = convolutions.map((convo, i) => scan(filter, convo, transforms[i], fDim))
  const filtered = matched.filter(m => m.size > 0)
  return image.reduce((sum, v) => sum + v, 0) - filtered[0].size
}

function assemble (input) {
  const tiles = parseBatch(input, (line, d) => {
    const matched = line.match(/^Tile (\d+):$/)
    if (matched) {
      d.id = +matched[1]
      d.image = ''
    } else {
      d.image += line
    }
  })

  tiles.forEach(row => {
    row.borders = getBorders(row.image)
  })

  const corners = []
  tiles.forEach((row, ii) => {
    row.adjacents = row.borders.map(border => {
      const adjacent = []
      tiles.forEach((adjTile, i) => {
        if (i === ii) return
        adjTile.borders.forEach((adjBorder, j) => {
          if (border === adjBorder) adjacent.push([i, j])
        })
      })
      return adjacent
    })
    if (row.adjacents.slice(0, 4).filter(a => a.length === 0).length === 2) corners.push(row)
  })
  assert(corners.length === 4)

  const ordered = []

  let leftmost = corners[0]
  const outer = []
  leftmost.adjacents.forEach((a, i) => {
    if (a.length === 0) outer.push(i)
  })
  let t = (outer[1] - outer[0] > 1) ? outer[1] : outer[0]
  t = (t + 1) % 4
  applyTransform(t)(leftmost)

  while (true) {
    let left = leftmost
    while (true) {
      ordered.push(left)
      if (left.adjacents[1].length === 0) break
      const [tileIndex, edge] = left.adjacents[1][0]
      left = tiles[tileIndex]
      applyTransform(7 - edge)(left)
    }
    if (leftmost.adjacents[4].length === 0) break
    const [tileIndex, edge] = leftmost.adjacents[4][0]
    leftmost = tiles[tileIndex]
    applyTransform(edge)(leftmost)
  }

  return ordered
}

function applyTransform (t) {
  return tile => {
    const dim = Math.sqrt(tile.image.length)
    const transform = getTransforms(dim)[t]
    const seq = sequence2D(transform.start, [transform.primary, transform.secondary], [dim, dim])
    tile.image = [...seq].map(index => tile.image[index]).join('')

    const inversed = t >= 4
    if (inversed) t -= 4
    const bHead = inversed ? tile.borders.slice(4) : tile.borders.slice(0, 4)
    const bTail = inversed ? tile.borders.slice(0, 4) : tile.borders.slice(4)
    const aHead = inversed ? tile.adjacents.slice(4) : tile.adjacents.slice(0, 4)
    const aTail = inversed ? tile.adjacents.slice(0, 4) : tile.adjacents.slice(4)
    tile.borders = [].concat(bHead.slice(t), bHead.slice(0, t), bTail.slice(-t), bTail.slice(0, -t))
    tile.adjacents = [].concat(aHead.slice(t), aHead.slice(0, t), aTail.slice(-t), aTail.slice(0, -t))
  }
}

function trim (image, width = Math.sqrt(image.length), n = 1) {
  const height = image.length / width
  const start = n * width + n
  const offset = [1, width]
  const dim = [width - 2 * n, height - 2 * n]
  return [...sequence2D(start, offset, dim)].map(index => image[index]).join('')
}

function stitch (images, inWidth = Math.sqrt(images[0].length), outWidth = Math.sqrt(images.length)) {
  let stitched = ''
  const outHeight = images.length / outWidth
  for (let y = 0; y < outHeight; y++) {
    for (let i = 0; i < images[0].length; i += inWidth) {
      for (let x = 0; x < outWidth; x++) {
        const k = y * outWidth + x
        stitched += images[k].slice(i, i + inWidth)
      }
    }
  }
  return stitched
}

function convolve (image, transform, filter, fDim) {
  const iDim = Math.sqrt(image.length)
  const convolution = new Uint8Array(image.length)
  const offset = [transform.primary, transform.secondary]
  const dim = [iDim - fDim[0] + 1, iDim - fDim[1] + 1]
  for (const start of sequence2D(transform.start, offset, dim)) {
    const seq = sequence2D(start, offset, fDim)
    convolution[start] = filter.reduce((sum, v) => sum + image[seq.next().value] * v, 0)
  }
  return convolution
}

function scan (filter, convolution, transform, fDim) {
  const sumFilter = filter.reduce((sum, v) => sum + v, 0)
  const offset = [transform.primary, transform.secondary]

  const matched = new Set()
  convolution.forEach((v, i) => {
    if (v === sumFilter) {
      const seq = sequence2D(i, offset, fDim)
      filter.forEach(v => {
        const i = seq.next()
        if (v === 1) matched.add(i)
      })
    }
  })
  return matched
}

function getTransforms (dim) {
  return [
    { start: 0, primary: 1, secondary: dim },
    { start: dim - 1, primary: dim, secondary: -1 },
    { start: dim * dim - 1, primary: -1, secondary: -dim },
    { start: dim * dim - dim, primary: -dim, secondary: 1 },
    { start: dim * dim - dim, primary: 1, secondary: -dim },
    { start: dim * dim - 1, primary: -dim, secondary: -1 },
    { start: dim - 1, primary: -1, secondary: dim },
    { start: 0, primary: dim, secondary: 1 }
  ]
}

function getBorders (image) {
  const dim = Math.sqrt(image.length)
  return getTransforms(dim).map(t => {
    return [...sequence(t.start, t.primary, dim)].map(index => image[index]).join('')
  })
}

function * sequence (start, offset, dim) {
  let curr = start
  while (dim-- > 0) {
    yield curr
    curr += offset
  }
}

function * sequence2D (start, offset, dim) {
  let [dimX, dimY] = dim
  const [offsetX, offsetY] = offset
  let curr = start
  while (dimY-- > 0) {
    yield * sequence(curr, offsetX, dimX)
    curr += offsetY
  }
}

function print (image) {
  const dim = Math.sqrt(image.length)
  for (let y = 0; y < image.length; y += dim) {
    console.log(image.slice(y, y + dim))
  }
}

const test = load('day20', __dirname)

const target = `
                  # 
#    ##    ##    ###
 #  #  #  #  #  #   
`.slice(1, -1).split('\n')

console.log(findCorners(test))
console.log(seaMonster(test, target))
