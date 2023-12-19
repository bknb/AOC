const {create2DimArray, printMap, frameIt} = require('../../../santasLittleHelper.js');
const {grid} = require('../../../parser.js');
let input, log;

const dirMap=[[1,0],[0,1],[-1,0],[0,-1]];
const dirs=[">","v","<","^"];
let avg=0;

function solve1(inp,l) {
  input = inp, log = l;
  avg/=input.length*input[0].length;
  console.log(avg,input.length,input[0].length);
  const dists = create2DimArray(
    input.length, input[0].length,
    ()=>create2DimArray(4,3,Number.MAX_VALUE));
  dists[0][0] = create2DimArray(4,3,0);
  const q = [[1,0,0,0,1,heu(1,0,0)]];
  insertSorted(q,[0,1,0,1,1,heu(0,1,0)]);
  while(q.length) {
    log(q.map(([x,y,,d,c,h])=>
      `${c}${dirs[d]}${x},${y}(${h})`).slice(0,5).join('\n'));
    const [x,y,o,d,c] = q.shift();
    const n = o+input[y][x];
    log(c,dirs[d],x,y,`(${n})`);
    if(n>log(dists[y][x],y,x)[d][c]) continue;
    //const [px,py] = [x-dirMap[d][0],y-dirMap[d][1]];
    //const path = (px<0||py<0)?[]:dists[py][px][1];
    dists[y][x][d][c]=n;
    [...Array(4)].map((_,nd)=>
      [x+dirMap[nd][0],y+dirMap[nd][1],nd,d===nd?c+1:1])
      .filter(inGrid).filter(nd=>d!==nd[2]?d!==(nd[2]+2)%2:nd[3]<3)
      .forEach(([x,y,nd,nc])=>insertSorted(q,[x,y,n,nd,nc,heu(x,y,n)]));
  }
  //log(dists);
  //console.log(printMap(input,d=>d));
  //console.log(dists[dists.length-1][dists[0].length-1][1]
  //            .forEach(([x,y,d])=>input[y][x]=d))
  console.log(printMap(input,d=>d));
  console.log()
  console.log(printMap(dists.map(d=>
    d.map(c=>c.reduce((a,c)=>
      Math.min(a,c.reduce((a,c)=>
        Math.min(a,c)))))),d=>
    d>9?String.fromCharCode(55+d):d));
  return dists[dists.length-1][dists[0].length-1][0];
}

function dist(x,y) {
  return input[0].length+input.length-(x+y)-2;
}

function heu(x,y,o) {
  return dist(x,y)*5+input[y][x]+o;
}

function insertSorted(q,e) {
  const index = q.findIndex(hd=>hd[5]>e[5])
  index!==-1?q.splice(index,0,e):q.push(e);
  return q;
}

function inGrid([x,y]) {
  return x>=0 && x<input[0].length && y>=0 && y<input.length;
}

function solve2(inp,l) {
  input = inp, log = l;
  return null;
}

function init(data,log) {
  return grid(d=>-(avg-(avg+=+d)))(data);
}

module.exports = {init, solve1, solve2}