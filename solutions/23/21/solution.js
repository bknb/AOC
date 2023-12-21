const {grid} = require('../../../parser.js');
let input, log;

function solve1(inp,l, steps = 6) {
  input = inp, log = l;
  const w = input[0].length;
  const ms = getMasks(w);
  const s = ms[5]&ms[4];
  const a = getNum(input);
  const cs = getCycle(steps,s,a,w,ms);
  return count(cs[steps%2]);
}

function solve2(inp,l, steps = 26501365) {
  input = inp, log = l;
  const w = input[0].length;
  const ms = getMasks(w);
  const a = getNum(input);
  const s = [[ms[3]&ms[2],ms[3]&ms[4],ms[3]&ms[0]],
             [ms[5]&ms[2],ms[5]&ms[4],ms[5]&ms[0]],
             [ms[1]&ms[2],ms[1]&ms[4],ms[1]&ms[0]]];
  const cs = s.map(r=>
    r.map(e=>getCycle(steps,e,a,w,ms)));
  const hg = (w-1)/2;
  const sg = (steps-hg)/w;
  const ng1 = (sg-1)**2;
  const ng2 = sg**2;
  let sum = ng1*count(cs[1][1][steps%2]);
  sum += ng2*count(cs[1][1][(steps-1)%2]);
  for (let i = 2; i-->0;)
    for (let j = 0; j < 3; j+=2)
      sum+= count(cs[i?1:j][i?j:1][hg]);
  for (let i = 0; i < 3; i+=2)
    for (let j = 0; j < 3; j+=2)
      sum+= (sg-1)*count(cs[i][j][hg])
        + sg*count(cs[i][j][hg+w]);
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

function getMasks(w) {
  const ms = [
    getRightMask(w),
    getBottomMask(w)
  ];
  ms[2] = ms[0]<<BigInt(w-1);
  ms[3] = ms[1]<<BigInt(w*(w-1));
  ms[4] = ms[0]<<BigInt((w-1)/2);
  ms[5] = ms[1]<<BigInt(w*(w-1)/2);
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

function init(data,log) {
  return grid((c)=>/[S\.]/.test(c))(data);
}

module.exports = {init, solve1, solve2};