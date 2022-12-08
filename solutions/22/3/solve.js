const fs = require('fs');
const path = require('path').resolve(__dirname, 'input.txt');
fs.readFile(path, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const r = data.split('\n');
  
  /*const result = 
    data.split('\n')
      .map(findSame)
      .map(mapPrio)
      .reduce((a,c)=>a+c,0);*/
  let sum = 0;

  for(let i=0;i<r.length;i+=3)
    sum += mapPrio(teamID(i));
  
  console.log(sum);

  function teamID(i) {
    for(let j=r[i].length;j-->0;)
      for(let k=r[i+1].length;k-->0;)
        if(r[i][j] === r[i+1][k])
          for(let l=r[i+2].length;l-->0;)
            if(r[i][j] === r[i+2][l])
              return r[i][j];
  }

  function mapPrio(p) {
    const result = p.charCodeAt(0) - (p.match(/[a-z]/) ? 96 : 38);
    //console.log(p,result);
    return result;
  }

  function findSame(r) {
    const s = r.slice(r.length/2);
    for(let i=s.length;i-->0;)
      for(let j=s.length;j-->0;)
        if(r[i] === s[j]) {
          //console.log(r,r[i])
          return r[i];
        }
  }
});