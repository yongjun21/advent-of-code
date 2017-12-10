'use strict'

// requires tail call optimization, runs only behind --harmony flag
function lookNsay (str, prefix = '') {
  const match = str.match(/(.)(\1*)/)
  if (match[0].length === str.length) return prefix + match[0].length + match[1]
  return lookNsay(str.slice(match[0].length), prefix + match[0].length + match[1])
}

let test = '1321131112'

function playLookNSay (start, round) {
  for (let i = 0; i < round; i++) {
    start = lookNsay(start)
  }
  return start
}

console.log(playLookNSay(test, 40).length)
console.log(playLookNSay(test, 50).length)
