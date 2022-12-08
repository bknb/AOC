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
    console.log(solve(input,4));
  }
  if (second) { 
    console.log('Solution 2:');
    console.log(solve(input,14));
  }

  function solve(input,chars) {
    for (let i=0;i<input.length-chars;i++) {
      if(isDistinct(input,i,chars))
        return i+chars;
    }
  }
  
  function isDistinct(input,i,chars) {
    for (let j=i;j<i+chars-1;j++)
      for (let k=j+1;k<i+chars;k++)
        if (input[j] === input[k])
          return false;
    return true;
  }

  function prepareInput(data) {
    return data.split('');
  }
});