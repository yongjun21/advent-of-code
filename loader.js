const fs = require('fs');
const path = require('path');

module.exports = function (label, callerDir) {
  const filePath = path.join(callerDir, 'input', label + '.txt');
  return fs.readFileSync(filePath, 'utf-8')
};
