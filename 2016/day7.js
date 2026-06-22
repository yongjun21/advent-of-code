const load = require('../loader')

function containsAbba (str) {
  const match = str.match(/([a-z])([a-z])\2\1/)
  if (!match) return false
  if (match[1] !== match[2]) return true
  return containsAbba(str.slice(match.index + 1))
}

function supportTLS (input) {
  const ips = input.trim().split('\n')
  return ips.filter((ip, i) => {
    if (!containsAbba(ip)) return false
    const hypernet = ip.match(/\[[a-z]*]/g)
    return !hypernet || !hypernet.some(str => containsAbba(str))
  })
}

function extractAbas (str, found = []) {
  if (str.length < 3) return found
  const match = str.match(/([a-z])([a-z])\1/)
  if (!match) return found
  if (match[1] !== match[2]) found.push(match[0])
  return extractAbas(str.slice(match.index + 1), found)
}

function supportSSL (input) {
  const ips = input.trim().split('\n')
  return ips.filter((ip, i) => {
    const supernet = []
    const hypernet = []
    ip.replace(/\[/g, ' [').replace(/]/g, '] ').trim().split(' ')
      .forEach(str => {
        if (str.match(/^\[[a-z]+]$/)) hypernet.push(str)
        else supernet.push(str)
      })

    const abas = []
    supernet.forEach(str => {
      extractAbas(str, abas)
    })

    return abas.some(aba => {
      const bab = aba[1] + aba[0] + aba[1]
      return hypernet.some(str => str.indexOf(bab) > -1)
    })
  })
}

const test = load('day7', __dirname)

console.log(supportTLS(test).length)
console.log(supportSSL(test).length)
