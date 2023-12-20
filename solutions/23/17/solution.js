const {create2DimArray, printMap, frameIt, rng} =
  require('../../../santasLittleHelper.js');
const {grid} = require('../../../parser.js');
const {Heap} = require('heap-js');
let input, log;

const dirMap=[[1,0],[0,1],[-1,0],[0,-1]];
const dirs=[">","v","<","^"];

function solve1(inp,l, min = 1, max = 3) {
  input = inp, log = l;
  const heap = new Heap((a,b)=>a[5]-b[5]);
  const w = input.length, h = input[0].length;
  const dists = create2DimArray(w, h, ()=>
    rng(0,2).map(()=>[Number.MAX_VALUE,null]));
  dists[0][0] = rng(0,2).map(()=>[0,[]]);
  heap.init(rng(min,max+1).reduce((a,i)=>
    a.concat(rng(0,2).map(d=>[d?0:i,d?i:0,d,i]).filter(inGrid)
      .map(([x,y,d,i])=>E(x,y,0,d,i))),[]));
  while(heap.length) {
    const [x,y,o,d,c] = heap.pop();
    const n = o + weight(x,y,d,c);
    if(n>=dists[y][x][d%2][0]) continue;
    const opd = (d+2)%4, ord = (d+1)%2;
    const px = x+dirMap[opd][0]*c, py = y+dirMap[opd][1]*c;
    const path = dists[py][px][ord][1];
    dists[y][x][d%2]=[n,[...path,[d,c,x,y]]];
    rng(0,2).map((_,inc)=>(d+(inc?1:3))%4)
      .map(nd=>rng(min,max+1).map(i=>
        [x+dirMap[nd][0]*i,y+dirMap[nd][1]*i,nd,i]))
      .flat().filter(inGrid).forEach(([nx,ny,nd,nc])=>
        heap.push(E(nx,ny,n,nd,nc)));
  }
  plotting(dists[w-1][h-1]);
  return Math.min(...dists[w-1][h-1].map(([d])=>d));
}

function plotting(goal) {
  const path = goal.reduce((a,c)=>a[0]>c[0]?c:a)[1];
  input = input.map(r=>r.map(c=>`${c}`.grey));
  path.forEach(([d,c,x,y])=>
    [...Array(c)].forEach((_,i)=>
      input[y+(d%2?(d>>1?i:-i):0)][x+(d%2?0:(d>>1?i:-i))]=dirs[d].red));
  console.log(frameIt(printMap(input,d=>d)));
}

function E(x,y,v,d,c) {
  return [x,y,v,d,c,dist(x,y,v,d,c)];
}

function heu(x,y) {
  return input[0].length+input.length-(x+y)-2;
}

function weight(x,y,d,c) {
  return [...Array(c)].reduce((a,_,i)=>
    a+input[y+(d%2?(d>>1?i:-i):0)][x+(d%2?0:(d>>1?i:-i))],0);
}

function dist(x,y,o,d,c) {
  return heu(x,y) + weight(x,y,d,c) + o;
}

function inGrid([x,y]) {
  return x>=0 && x<input[0].length && y>=0 && y<input.length;
}

function solve2(inp,l) {
  return solve1(inp,l,4,10);
}

function init(data,log) {
  return grid(d=>+d)(data);
}

module.exports = {init, solve1, solve2}