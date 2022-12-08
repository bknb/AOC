const fs = require('fs');

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const p = data.split('\n').map(x=>+x)
  const w = p.reduce((a,c)=>a+c,0)/3;
  let m = Number.MAX_VALUE;
  let o = [];

  console.log(p,w);

  function search(r,p,g) {
    if (r === 0) return true;
    if (r < p[0]) return false;
    
  }

  function isDividable()
});