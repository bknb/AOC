const fs = require('fs');

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const res = data.split('\n')
    .map(calcBow)
    .reduce((a,c)=>a+c,0);

  console.log(res);

  function calcPaper(s) {
    const sides = s.split('x')
      .map((e,i,a)=>
        a.reduce((a,c)=>a*c,1)/e);
    return sides.reduce((a,c)=>c<a?c:a,Number.MAX_VALUE)
      + 2 * sides.reduce((a,c)=>a+c,0);
  }

  function calcBow(s) {
    const e = s.split('x').map(x=>+x);
    const base = e.reduce((a,c)=>a+c,0) - e.reduce((a,c)=>c>a?c:a,0);
    const cube = e[0]*e[1]*e[2];
    console.log(s,base,cube);
    return 2*base + cube;
  }
});