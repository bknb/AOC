function getBounds(a, r) {
  const dims = a[0].length;
  const max = [...Array(dims).keys()].fill(-Infinity);
  const min = [...Array(dims).keys()].fill(Infinity);
  for (let i = a.length; i-- > 0;)
    for (let j = dims; j-- > 0;) {
      if (a[i][j] > max[j])
        if (!r || a[i][j] <= r[1][j])
          max[j] = a[i][j];
        else max[j] = r[1][j];
      if (a[i][j] < min[j])
        if (!r || a[i][j] >= r[0][j])
          min[j] = a[i][j];
        else min[j] = r[1][j];
    }
  return [min, max];
}

function fillWithinBounds(a, [[x1,y1],[x2,y2]]) {
  for (let i = ++x2; i-->x1;)
    for (let j = ++y2; j-->y1;)
      a[i][j] = true;
}

function inBounds(x, [min, max]) {
  return x.every((e, i) => min[i] <= e && e <= max[i]);
}

function inRange(b1, b2) {
  return x => b1 > b2 ? b1 > x && b2 < x : b1 < x && b2 > x;
}

function create2DimArray(x, y, f) {
  return [...Array(x)].map(() =>
    [...Array(y)].fill(typeof f === 'function' ? f() : f));
}

function getRows(grid) {
  return grid.map(row=>row.join(''));
}

function getCols(grid) {
  return grid.map((_, i) => grid.map(row => row[i]).join(''));
}

function getGrid(lines, isCol) {
  if (!isCol) return lines.map(line=>line.split(''));
  return lines[0].split('').map((_,i)=>lines.map(line=>line[i]));
}

function printMap(m, s, b) {
  if (b) m = m.map(r => r.slice(b[0][1], b[1][1])).slice(b[0][0], b[1][0]);
  const map = typeof s === 'object' ? c=>s[c] : s ?? (c => c ? '#' : '.');
  return m.map(r => (map ? r.map(map) : r)
    .join('')).join('\n');
}

function frameIt(text, title = '', align = 'c') {
  const rows = text.split('\n');
  const width = rows.map(r => r.replace(/\x1B\[\d+m/g, '').length)
    .reduce((a, c) => a > c ? a : c);
  if (title.length > width)
    title = title.substring(0, width);
  const rest = width - title.length;
  const half = rest >> 1;
  const filler = '-'.repeat(rest);
  let result = align === 'c'
    ? `+${filler.substring(0, half)}${title}${filler.substring(half)}+\n`
    : align === 'r' ? `+{filler}${title}$+\n` : `+${title}${filler}+\n`;
  result += text.split('\n').map(r =>
    `|${r}${' '.repeat(width - r.replace(/\x1B\[\d+m/g, '').length)}|`)
    .join('\n');
  result += `\n+${'-'.repeat(width)}+`;
  return result;
}

function arr2obj(a) {
  const o = {}
  a.forEach(x => o[x[0]] = x.length === 2 ? x[1] : x.slice(1));
  return o;
}

function rng(n, m) {
  return [...Array(m - n)].map((_, i) => i + n);
}

function d1([x1, y1], [x2, y2]) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function sum(arr) {
  return (typeof arr === 'object' ? arr : [...arguments])
    .reduce((a, c) => a + c, 0);
}

function prd(arr) {
  return (typeof arr === 'object' ? arr : [...arguments])
    .reduce((a, c) => a * c, 1);
}

function transpose(arr) {
  return Array(arr[0].length).fill()
    .map((_, i) => arr.map(row => row[i]));
}

function sumOfSums(n,m) {
  const l = [...Array(m)].map((_,i)=>i+1);
  return prd(...l.map(i=>n+i-1))/prd(...l);
}

function rangeSum([n,m]) {
  return (m-n+1)*(n+m)>>1;
}

function findCoordinates (m, test) {
  return m.reduce((a, c, y) =>
    a.concat(c.reduce((a, c, x) =>
      (test ? test(c) : c) ? 
      a.concat([[x, y]]) : a, [])), []);
}

function flip(arr) {
  return [...arr].reverse();
}

function dist(elems, buckets, acc = []) {
  console.log(elems, buckets, acc);
  if (buckets.length === 1)
    return [[...acc,...elems.map(e=>[e,buckets[0]])]];
  if (elems.length === 1)
    return buckets.map(b=>[...acc,[elems[0],b]]);
  return buckets.map((_,i)=>buckets.slice(i))
    .map(bs=>dist(elems.slice(1), bs, acc
                  .concat([[elems[0],bs[0]]]))).flat();
}

function combi(arr,n) {
  if (n === 0) return [];
  if (n === 1) return [...arr.map(x=>[x])];
  return arr.map((x,i)=>
    combi(arr.slice(i+1),n-1)
    .map(y=>y.concat([x]))).flat();
}

module.exports = {
  getBounds,
  findCoordinates,
  fillWithinBounds,
  inBounds,
  inRange,
  create2DimArray,
  sumOfSums,
  transpose,
  printMap,
  rangeSum,
  frameIt,
  arr2obj,
  getRows,
  getCols,
  getGrid,
  combi,
  flip,
  dist,
  rng,
  sum,
  prd,
  d1
}