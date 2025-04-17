const fs = require('fs');
const path = require('path');

const { MinHeap } = require('../2022/common');

function getChecksum(input) {
  let i = 0;
  let j = input.length - 1;
  let index = 0;
  let checksum = 0;

  if (j & 1) {
    j--;
  }
  let rightId = j >> 1;
  let right = Number(input[j]);
  while (i < j) {
    let left = Number(input[i]);
    if (i & 1) {
      while (true) {
        while (left > 0 && right > 0) {
          checksum += index * rightId;
          left--;
          right--;
          index++;
        }
        if (left > 0) {
          j -= 2;
          if (i >= j) return checksum;
          rightId = j >> 1;
          right = Number(input[j]);
        } else {
          break;
        }
      }
    } else {
      const leftId = i >> 1;
      while (left > 0) {
        checksum += index * leftId;
        left--;
        index++;
      }
    }
    i++;
  }
  while (right > 0) {
    checksum += index * rightId;
    right--;
    index++;
  }
  return checksum;
}

function getChecksum2(input) {
  const fileCount = (input.length + (input.length & 1)) >> 1;
  const fileSize = new Uint8Array(fileCount);
  const fileLocation = new Uint32Array(fileCount);
  const freeSpace = [];
  for (let i = 0; i < 10; i++) {
    freeSpace.push(new MinHeap());
  }

  let index = 0;
  for (let i = 0; i < input.length; i++) {
    const size = Number(input[i]);
    if (i & 1) {
      freeSpace[size].push(index);
    } else {
      fileSize[i >> 1] = size;
      fileLocation[i >> 1] = index;
    }
    index += size;
  }

  let checksum = 0;
  for (let i = fileCount - 1; i >= 0; i--) {
    const requiredSize = fileSize[i];
    const currIndex = fileLocation[i];
    let available = -1;
    let minIndex = currIndex;
    for (let size = requiredSize; size < 10; size++) {
      const freeIndex = freeSpace[size].peek();
      if (freeIndex < minIndex) {
        minIndex = freeIndex;
        available = size;
      }
    }
    if (minIndex < currIndex) {
      fileLocation[i] = minIndex;
      freeSpace[available].pop();
      if (available > requiredSize) {
        freeSpace[available - requiredSize].push(minIndex + requiredSize);
      }
    }
    for (let index = minIndex; index < minIndex + requiredSize; index++) {
      checksum += index * i;
    }
  }

  return checksum;
}

const test = fs
  .readFileSync(path.join(__dirname, 'day9.txt'), { encoding: 'utf-8' })
  .trim();

console.log(getChecksum(test));
console.log(getChecksum2(test));
