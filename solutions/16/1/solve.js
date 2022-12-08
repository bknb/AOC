const fs = require('fs');

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const s = [0,0];
  let f = 0;
  const p = [[...s]];
  
  data.split(',')
    .map(x=>/([LR])(\d+)/.exec(x).slice(1,3))
    .every(([t,d])=>{
      f = (t==='R'?++f:--f)&3;
      let w = (f >> 1 ? -1 : 1);
      for (let i=+d;i-->0;) {
        s[f&1] += w;
        // comment out for 1. part
        if (p.find(e=>s[0] === e[0] && s[1] === e[1])) 
          return false;
        p.push([...s]);
      }
      return true;
    });

  console.log(Math.abs(s[0])+Math.abs(s[1]));
});