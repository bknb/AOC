const {...helper} = require('../../../santasLittleHelper.js');
const {linify,lineWise} = require('../../../parser.js');
let input, log;

function solve1(inp,l) {
  input = inp, log = l;
  const xpt = [200000000000000,400000000000000];
  return input.map(([[x2,y2],[vx2,vy2]],i,a)=>
    a.slice(i+1)
    .filter(([,[vx1,vy1]])=>vx1/vy1!==vx2/vy2)
    .map(([[x1,y1],[vx1,vy1]])=>
      [(vx1*(y1-y2)-vy1*(x1-x2))/(vx1*vy2-vx2*vy1),
        (x2-x1)/vx1,vx2/vx1])
    .map(([a,s,f])=>[a,s+f*a])
    .filter(([a,b])=>a>=0&&b>=0)
    .map(([a,b])=>[x2+vx2*a,y2+vy2*a,a,b])
    .filter(inRange(xpt)).length)
    .reduce((a,b)=>a+b,0);
}

function inRange(xpt) {
  return ([x,y])=>
    x>=xpt[0] && x<=xpt[1] 
    && y>=xpt[0] && y<=xpt[1];
}

function solve2(inp,l) {
  input = inp, log = l;
  const tc = input.slice(1);
  return log(input.slice(1)
    .map(([[x1,y1,z1]],i,a)=>a.slice(i+1)
    .filter(([[x2,y2,z2]])=>y1!==y2&&z1!==z2))
            .map(([x])=>x));
}

function init(data,log) {
  return lineWise().chunkify().numberfy()
    .map(([a,b,c,d,e,f])=>[[a,b,c],[d,e,f]])(linify(data));
}

function add(a,b) {
  return map(a,b,(a,b)=>a+b);
}

function sub(a,b) {
  return map(a,b,(a,b)=>a-b);
}

function map(a1, a2, f) {
  return a1.map((a,i)=>f(a,a2[i]));
} 

module.exports = {init, solve1, solve2}