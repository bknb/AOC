function getBounds(a,r) {
  const dims = a[0].length;
  const max = [...Array(dims).keys()].fill(-Infinity);
  const min = [...Array(dims).keys()].fill(Infinity);
  for(let i=a.length;i-->0;)
    for(let j=dims;j-->0;) {
      if(a[i][j] > max[j]) 
        if(!r || a[i][j] <= r[1][j])
          max[j] = a[i][j];
        else max[j] = r[1][j];
      if(a[i][j] < min[j]) 
        if(!r || a[i][j] >= r[0][j])
          min[j] = a[i][j];
        else min[j] = r[1][j];
    }
  return [min,max];
}

function fillWithinBounds(a,b) {
  for(let i=b[1][0]+1;i-->b[0][0];)
    for(let j=b[1][1]+1;j-->b[0][1];)
      a[i][j] = true;
}

function inBounds(x,[min,max]) {
  return x.every((e,i)=>min[i]<=e && e<=max[i]);
}

function create2DimArray(x,y,f) {
  return [...Array(x)].map(()=>[...Array(y)].fill(f));
}

function printMap(m,s,b) {
  if (b) m = m.map(r=>r.slice(b[0][1],b[1][1])).slice(b[0][0],b[1][0]);
  return m.map((r,x)=>r
    .map(c=>s?s[c]||'.':(c?'#':'.')).join('')).join('\n');
}

function frameIt(text,title = '', align = 'c') {
  const rows = text.split('\n');
  const width = rows.map(r=>r.replace(/\x1B\[\d+m/g,'').length)
    .reduce((a,c)=>a>c?a:c);
  if (title.length>width)
    title = title.substring(0,width);
  const rest = width-title.length;
  const filler = '-'.repeat(rest);
  let result = align === 'c'
    ? `+${filler.substring(0,rest>>1)}${title}${filler.substring(rest>>1)}+\n`
    : align === 'r' ? `+{filler}${title}$+\n` : `+${title}${filler}+\n`;
  result += text.split('\n').map(r=>
    `|${r}${' '.repeat(width-r.replace(/\x1B\[\d+m/g,'').length)}|`)
    .join('\n');
  result += `\n+${'-'.repeat(width)}+`;
  return result;
}

function arr2obj(a) {
  const o = {}
  a.forEach(x=>o[x[0]]=x.length===2?x[1]:x.slice(1));
  return o;
}

function range(n,m) {
  return [...Array(m-n)].map((x,i)=>i+n);
}

function d1([x1,y1],[x2,y2]) {
  return Math.abs(x1-x2)+Math.abs(y1-y2);
}

module.exports = {
  getBounds,
  fillWithinBounds,
  inBounds,
  create2DimArray,
  printMap,
  frameIt,
  arr2obj,
  rng: range,
  d1
}