function getBounds(a) {
  const max = [Number.MIN_VALUE,Number.MIN_VALUE];
  const min = [Number.MAX_VALUE,Number.MAX_VALUE];
  for(let i=a.length;i-->0;)
    for(let j=2;j-->0;) {
      if(a[i][j] > max[j]) max[j] = a[i][j];
      if(a[i][j] < min[j]) min[j] = a[i][j];
    }
  return [min,max];
}

function inBounds(x,y,[min,max]) {
  return min[0]<=x && x<=max[0] && y<=max[1] && min[1]<=y;
}

function create2DimArray(x,y,f) {
  return Array.from(Array(x)).map(()=>Array.from(Array(y)).fill(f));
}

function printMap(m,b,s) {
  if (b) m = m.map(r=>r.slice(b[0][1],b[1][1]));
  return m.map((r,x)=>r
    .map(c=>s?s[c]||'.':(c?'#':'.')).join('')).join('\n');
}

module.exports = {
  getBounds,
  inBounds,
  create2DimArray,
  printMap
}