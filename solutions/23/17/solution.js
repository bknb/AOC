const {create2DimArray, printMap, frameIt} = require('../../../santasLittleHelper.js');
const {grid} = require('../../../parser.js');
let input, log;

const dirMap=[[1,0],[0,1],[-1,0],[0,-1]];
const dirs=[">","v","<","^"];

function solve1(inp,l) {
  input = inp, log = l;
  const dists = create2DimArray(
    input.length, input[0].length,
    ()=>create2DimArray(4,4,[Number.MAX_VALUE,null]));
  dists[0][0] = create2DimArray(4,4,[0,[]]);
  const q = [[1,0,0,0,1,heu(1,0,0),0,0]];
  insertSorted(q,[0,1,0,1,1,heu(0,1,0),0,0]);
  while(q.length) {
    // log(q.map(([x,y,,d,c,h])=>
    //   `${c}${dirs[d]}${x},${y}(${h})`).slice(0,2).join('\n'));
    const [x,y,o,d,c,,pd,pc] = q.shift();
    const n = o+input[y][x];
    log(c,dirs[d],x,y,`(${n})`);
    if(n>dists[y][x][d][c][0]) continue;
    const px = x+dirMap[(d+2)%4][0], py = y+dirMap[(d+2)%4][1];
    const path = dists[py][px][pd][pc][1];
    dists[y][x][d][c]=[n,[...path,[d,x,y]]];
    [...Array(4)].map((_,nd)=>
      [x+dirMap[nd][0],y+dirMap[nd][1],nd,d===nd?c+1:1])
      .filter(inGrid).filter(([,,nd,nc])=>d!==nd?d!==(nd+2)%2:nc<4)
      .forEach(([nx,ny,nd,nc])=>
        insertSorted(q,[nx,ny,n,nd,nc,heu(nx,ny,n),d,c]));
  }
  log(frameIt(printMap(dists,d=>
    rep(Math.min(...d.map(d=>Math.min(...d.map(([d])=>d))))))));
  const goal = dists[dists.length-1][dists[0].length-1];
  const path = goal.map(d=>d.reduce((a,c)=>a[0]>c[0]?c:a))
    .reduce((a,c)=>a[0]>c[0]?c:a)[1];
  path.forEach(([d,x,y])=>input[y][x]=dirs[d].blue);
  console.log(frameIt(printMap(input,d=>d)));
  return Math.min(...log(goal).map((d=>Math.min(...d.map(([d])=>d)))));
}

function rep(v) {
  return v<10?v:(v<60 ? String.fromCharCode(v+55) : '#');
}

function dist(x,y) {
  return input[0].length+input.length-(x+y)-2;
}

function heu(x,y,o) {
  return dist(x,y)+input[y][x]+o;
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
  return grid(d=>+d)(data);
}

module.exports = {init, solve1, solve2}