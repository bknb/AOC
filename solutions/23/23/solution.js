const {frameIt, printMap} = require('../../../santasLittleHelper.js');
const {grid} = require('../../../parser.js');
let input, log;

const stops=['<','^','>','v'];

function solve1(inp,l) {
  input = inp, log = l;
  const bg = input.map(r=>r.map(c=>/[^#]/.test(c)));
  const sm = stops.map(s=>
    getNum(input.map(r=>
      r.map(c=>new RegExp(`[^${s}]`).test(c)))));
  let w = input.length;
  const ms = getMasks(w);
  w = BigInt(w);
  const a = getNum(bg);
  let q = [[ms[3]&a,0n]];
  let result = 0;
  while (q.length) {
    const [c,p] = q.shift();
    if (!(c&ms[1]))  {
      const ap = a&~p;
      for (let i=4;i-->0;) {
        const sh = i%2?w:1n;
        const d = i>>1?c<<sh:c>>sh;
        if (d&sm[i]&ap) q.push([d,p|c]);
      }
    } else result = Math.max(result,count(p));
  }
  return result;
}

function solve2(inp,l) {
  input = inp, log = l;
  const w = input.length;
  const bw = BigInt(w);
  const ms = getMasks(w);
  const start = ms[3]&a, end = ms[1]&a;
  const crs = getCrossings(w,a);
  const g = getGraph(bw,a,crs);
  let [s,d] = getNext(start,0n,a,bw);
  return d+getLongestPath(s, [start]);
  
  function getLongestPath (k, vs) {
    if (k === end) return 0;
    return g.get(k).filter(([n])=>!vs.includes(n))
      .map(([n,d])=>{
        const p = getLongestPath(n, [...vs,k]);
        return p!==null?d+p:null;
      }).filter(x=>x!==null)
      .reduce((a,c)=>Math.max(a,c),null);
  }
}

function move(s,x,y,w) {
  return s>>BigInt(x+y*w);
}

function crossingBlockMask(w) {
  return binaryMask([0b010n,0b111n,0b010n],w);
}

function clearMask(w) {
  return binaryMask([0b000n,0b010n,0b000n],w);
}

function binaryMask(bis,w) {
  const bw = BigInt(w);
  const m = bis.reduce((a,c,i)=>a|=c<<bw*BigInt(i));
  return m<<(bw**2n-1n);
}

function getNext(s,p,a,w) {
  const q = [[s,p]]
  while (q.length) {
    const [c,p] = q.shift();
    const ap = a&~p;
    for (let i=4;i-->0;) {
      const sh = i%2?w:1n;
      const d = i>>1?c<<sh:c>>sh;
      if (d&ap) q.push([d,p|c]);
    }
    if(q.length!==1)
      return [c,count(p)];
  }
}

function getGraph(bw,a,crs) {
  return new Map(crs.map(cr=>{
    const ap = a&~cr;
    return [cr, [0,1,2,3].map(i=>{
      const sh = i%2?bw:1n;
      const d = i>>1?cr<<sh:cr>>sh;
      return d&ap ? getNext(d,cr,a,bw) : [];
    }).filter(l=>l.length)];
  }));
}

function getCrossings(w,a) {
  const crsc = crossingBlockMask(w);
  const clm = clearMask(w);
  const crs = [];
  for (let i=w;i-->2;)
    for (let j=w;j-->2;) {
      const cr = a&move(crsc,i,j,w);
      if (count(cr)>3)
        crs.push(cr&move(clm,i,j,w));
    }
  return crs;
}

function count(n) {
 let count = 0;
 while (n) {
   count += (n&1n?1:0);
   n >>= 1n;
 }
 return count;
}

function getNum(bg) {
  return bg.flat().reduce((a,c)=>a<<1n|(c?1n:0n),0n);
}

function getMasks(w) {
  const ms = [
    getRightMask(w),
    getBottomMask(w)
  ];
  ms[2] = ms[0]<<BigInt(w-1);
  ms[3] = ms[1]<<BigInt(w*(w-1));
  return ms;
}

function getRightMask(w) {
  return [...Array(w)]
    .reduce((a,_,i)=>
      a|1n<<BigInt(w*i),0n);
}

function getBottomMask(w) {
  return [...Array(w)]
    .reduce((a,_,i)=>
      a|1n<<BigInt(i),0n);
}

function getGrid(w,n) {
  a = [];
  while(n) {
    a.unshift((n & 1n) === 1n);
    n >>= 1n;
  }
  return [...Array(w**2-a.length)].map(()=>false)
    .concat(a).reduce((a,c,i)=>{
      if (i%w===0) a.push([c]);
      else a[a.length-1].push(c);
      return a;
    },[]);
}

function init(data,log) {
  return grid()(data);
}

module.exports = {init, solve1, solve2}