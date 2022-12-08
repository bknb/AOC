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
  const alpha = 'abcdefghijklmnopqrstuvwxyz';

  if (first) { 
    console.log('Solution 1:');
    console.log(solve1(input));
  }
  if (second) { 
    console.log('Solution 2:');
    console.log(solve2(input));
  }

  function solve1(input) {
    return input.map(toSectionOrZero)
      .reduce((a,c)=>c+a,0);
  }

  function solve2(input) {
    return input[input.findIndex(x=>
      x.name.split('')
        .map(y=>y==='-'?' ':alpha[(y.charCodeAt(0) - 97 + x.section) % 26])
        .join('').includes('northpole')
    )].section;
  }

  function toSectionOrZero(item) {
    return isReal(item) ? item.section : 0;
  }

  function isReal(item) {
    const counts = item.name.split('')
      .reduce((a,c)=> {
        if(!a[c]) a[c] = 0;
        a[c]++;
        return a;
      },{});
    for(let i=item.checksum.length;i-->1;) {
      const c = item.checksum[i];
      const p = item.checksum[i-1];
      if(!(counts[c]&&counts[p])
         || counts[c]>=counts[p] 
         && (counts[c]!=counts[p] || c<p))
        return false;
    }
    return true;
  }

  function prepareInput(data) {
    return data.split('\n')
      .map(x=>/(([a-z]+-)+)(\d+)\[([a-z]+)\]/.exec(x))
      .map(([,n,,s,checksum])=>{
        return {name:n.replace(/-$/,''),section:+s,checksum};
      });
  }
});