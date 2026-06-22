const load = require('../loader')

function checkImage (layers) {
  const [, ones, twos] = layers.reduce((agg, layer) => {
    const colors = countColors(layer)
    return colors[0] < agg[0] ? colors : agg
  }, [Infinity])
  return ones * twos
}

function decodeImage (layers, width, height) {
  for (let h = 0; h < height; h++) {
    let line = ''
    for (let w = 0; w < width; w++) {
      const i = h * width + w
      const pixel = layers.find(layer => layer[i] !== 2)[i]
      line += pixel === 1 ? 'o' : ' '
    }
    console.log(line)
  }
}

function splitLayers (pixels, width, height) {
  const n = width * height
  const layers = []
  while (pixels.length > n) {
    layers.push(pixels.slice(0, n))
    pixels = pixels.slice(n)
  }
  layers.push(pixels)
  return layers
}

function countColors (layer) {
  const colors = []
  layer.forEach(pixel => {
    colors[pixel] = colors[pixel] || 0
    colors[pixel]++
  })
  return colors
}

const test = load('day8', __dirname).split('').map(Number)

const imageLayers = splitLayers(test, 25, 6)
console.log(checkImage(imageLayers))
decodeImage(imageLayers, 25, 6)
