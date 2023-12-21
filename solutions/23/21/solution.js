const {printMap, create2DimArray, frameIt} = require('../../../santasLittleHelper.js');
const {grid} = require('../../../parser.js');
let input, log;

function solve1(inp,l, steps = 6) {
  input = inp, log = l;
  const w = input[0].length, h = input.length;
  const ms = getMasks(w,h);
  const s = ms[5]&ms[4];
  const a = getNum(input);
  const cs = getCycle(steps,s,a,w,ms);
  return count(cs[steps%2]);
}

function solve2(inp,l, steps = 26501365) {
  input = inp, log = l;
  const w = input[0].length, h = input.length;
  const ms = getMasks(w,h);
  const a = getNum(input);
  const s = [[ms[3]&ms[2],ms[3]&ms[4],ms[3]&ms[0]],
             [ms[5]&ms[2],ms[5]&ms[4],ms[5]&ms[0]],
             [ms[1]&ms[2],ms[1]&ms[4],ms[1]&ms[0]]];
  const cs = s.map(r=>r.map(e=>getCycle(steps,e,a,w,ms)));
  const l1 = (w-1)/2;
  const l2 = (steps-l1)/w;
  const l4 = (l2-1)**2;
  const l5 = l2**2;
  let sum = l4*count(cs[1][1][steps%2]);
  sum += l5*count(cs[1][1][(steps-1)%2]);
  sum+= count(cs[1][0][l1]);
  sum+= count(cs[1][2][l1]);
  sum+= count(cs[0][1][l1]);
  sum+= count(cs[2][1][l1]);
  sum+= (l2-1)*count(cs[0][0][l1])+l2*count(cs[0][0][l1+w]);
  sum+= (l2-1)*count(cs[0][2][l1])+l2*count(cs[0][2][l1+w]);
  sum+= (l2-1)*count(cs[2][0][l1])+l2*count(cs[2][0][l1+w]);
  sum+= (l2-1)*count(cs[2][2][l1])+l2*count(cs[2][2][l1+w]);
  return sum;
}

function getCycle(steps,s,a,w,ms) {
  const cs = [s];
  const [rm,,lm] = ms;
  for (let i=steps; i-->0;) {
    s = step(s,a,w,lm,rm);
    if (cs.includes(s)) break;
    cs.unshift(s);
  }
  return cs;
}

function step(s,a,w,lm,rm) {
  const l = ((s>>1n)&~lm);
  const r = ((s<<1n)&~rm);
  const t = s<<BigInt(w);
  const b = s>>BigInt(w);
  const n = (l|r|t|b)&a;
  return n;
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

function getGrid(w,h,n) {
  a = [];
  while(n) {
    a.unshift((n & 1n) === 1n);
    n >>= 1n;
  }
  return [...Array(w*h-a.length)].map(()=>false)
    .concat(a).reduce((a,c,i)=>{
      if (i%w===0) a.push([c]);
      else a[a.length-1].push(c);
      return a;
    },[]);
}

function getMasks(w,h) {
  const ms = [
    getRightMask(w,h),
    getBottomMask(w,h)
  ];
  ms[2] = ms[0]<<BigInt(w-1);
  ms[3] = ms[1]<<BigInt(w*(h-1));
  ms[4] = ms[0]<<BigInt((w-1)/2);
  ms[5] = ms[1]<<BigInt(w*(h-1)/2);
  return ms;
}

function getRightMask(w,h) {
  return [...Array(h)]
    .reduce((a,_,i)=>
      a|1n<<BigInt(w*i),0n);
}

function getBottomMask(w) {
  return [...Array(w)]
    .reduce((a,_,i)=>
      a|1n<<BigInt(i),0n);
}

function pr(w,h,n) {
  return log(printMap(getGrid(w,h,n)));
}

function init(data,log) {
  return grid((c)=>/[S\.]/.test(c))(data);
}

module.exports = {init, solve1, solve2};