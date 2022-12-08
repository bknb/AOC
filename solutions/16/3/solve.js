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
    return input.filter(isTriangle).length;
  }

  function solve2(input) {
    let sum = 0;
    for(let i=0;i<input.length;i+=3)
      for(let k=3;k-->0;) {
        let t = [];
        for(let j=i+3;j-->i;)
          t.push(input[j][k]);
        if(isTriangle(t)) sum++;
      }
    return sum;
  }

  function isTriangle(t) {
    const max = t.reduce((a,c)=>a>c?a:c,0);
    const maxI = t.findIndex(x=>x===max);
    return max < t.reduce((a,c,i)=>i!=maxI?a+c:a,0);
  }

  function prepareInput(data) {
    return data.split('\n').map(x=>x.match(/\d+/g).map(x=>+x));
  }
});