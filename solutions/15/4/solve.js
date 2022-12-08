const test = false;
const first = true;
const second = true;

const fs = require('fs');
const path = require('path')
  .resolve(__dirname, (test ? 'test' : 'input') + '.txt');
fs.readFile(path, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const input = prepareInput(data);

  if (first) { 
    console.log('Solution 1:');
    console.log(solve1(input));
  }
  if (second) { 
    console.log('Solution 2:');
    console.log(solve2(input));
  }

  function solve1(input) {
    
  }

  function solve2(input) {
  }

  function prepareInput(data) {
    return data;
  }
});