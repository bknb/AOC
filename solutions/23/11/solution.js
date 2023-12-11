let input,log;
function solve1(inp,l) {
  return solve(inp,l,2);  
}

function solve2(inp,l) {
  return solve(inp,l,1000000);
}

function solve(inp,l,factor) {
  input = inp, log=l;
  const emptyRows = [], emptyCols = [];

  const cols = Array(input[0].length).fill()
    .map((_,i)=>input.map(row=>row[i]));

  for (let i=input.length;i-->0;)
    if (input[i].every(c=>!c))
      emptyRows.push(i);

  for (let i=cols.length;i-->0;)
    if (cols[i].every(c=>!c))
      emptyCols.push(i);

  const galaxies = [];
  for (let y=input.length;y-->0;)
    for (let x=input[y].length;x-->0;)
      if (input[y][x])
        galaxies.push([x,y]);

  const pairs = galaxies.map((g,i)=>[g,galaxies.slice(i+1)])

  return pairs.map(([[gx,gy],ns])=>log(ns.map(([nx,ny])=>getDistance(gx,gy,nx,ny)))
      .reduce((a,b)=>a+b,0)).reduce((a,b)=>a+b);

  function getDistance(gx,gy,nx,ny) {
    const result = Math.abs(gx-nx)+Math.abs(gy-ny)
      + emptyRows.filter(y=>gy>ny?gy>y&&ny<y:gy<y&&ny>y).length*(factor-1)
      + emptyCols.filter(x=>gx>nx?gx>x&&nx<x:gx<x&&nx>x).length*(factor-1);
    return result;
  }
}

function init(data,log) {
  return data.split('\n').map(row=>row.split('').map(c=>c==='#'));
}

module.exports = {init, solve1, solve2}