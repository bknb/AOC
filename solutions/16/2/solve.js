const test = false;
const first = false;
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
    const p = [
      [,,,,],
      [,1,2,3,],
      [,4,5,6,],
      [,7,8,9,],
      [,,,,]
    ];
    let c = [2,2];
    return solve(p,c,input);
  }

  function solve2(input) {
    const p = [
      [,,,,,,],
      [,,,'1',,,],
      [,,'2','3','4',,],
      [,'5','6','7','8','9',],
      [,,'A','B','C',,],
      [,,,'D',,,],
      [,,,,,,]
    ];
    let c = [3,1];
    return solve(p,c,input);
  }

  function solve(p,c,input) {
    return input.map(d=> {
      d.split('').forEach(m=> {
        let nc = [...c];
        switch(m) {
          case 'U': nc[0]--;break;
          case 'D': nc[0]++;break;
          case 'R': nc[1]++;break;
          case 'L': nc[1]--;break;
        }
        if(get(p,nc)) c = nc;
      });
      return get(p,c);
    }).join('');
  }

  function get(p,c) {
    return p[c[0]][c[1]];
  }

  function prepareInput(data) {
    return data.split('\n');
  }
});