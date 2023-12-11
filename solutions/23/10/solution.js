const {frameIt, printMap} = require('../../../santasLittleHelper.js');

let input, log, start;

const tiles = {
  '.': [],
  '|': [[0,-1],[0,1]],
  '-': [[-1,0],[1,0]],
  'L': [[0,-1],[1,0]],
  'J': [[-1,0],[0,-1]],
  '7': [[-1,0],[0,1]],
  'F': [[1,0],[0,1]],
  'S': [[0,-1],[0,1],[-1,0],[1,0]],
}

function solve1(inp,l) {
  input = inp, log = l;

  return Math.floor(getLoop().length/2);
}

function solve2(inp,l) {
  input = inp, log = l;

  const loop = getLoop();

  const cages = input
    .map((row,y)=>
      row.map((c,x)=>
        !loop.some(([lx,ly])=>lx===x&&ly===y)
        && loop.filter(([lx,ly])=>lx===x&&ly>y)
        .map(([lx,ly])=>input[ly][lx]))
      .filter(c=>c&&isInLoop(c)).length)
    .reduce((a,b)=>a+b,0);

  return cages;
}

function isInLoop(loopParts) {
  const lr = [0,0];
  for(let i=loopParts.length; i-->0;)
    for(let j=loopParts[i].length; j-->0;)
      if(loopParts[i][j][0]>0) lr[1]++;
      else if(loopParts[i][j][0]<0) lr[0]++;

  return Math.min(...lr)%2===1;
}

function getLoop() {
  start = start || findStart();
  const loop = [start];
  let [[p1,[x1,y1]],[p2,[x2,y2]]] = get2Tiles(loop[0]);

  while(x1!=x2||y1!=y2) {
    loop.push([x1,y1]);
    loop.unshift([x2,y2]);
    let [nx1,ny1] = getNext(p1,x1,y1);
    let [nx2,ny2] = getNext(p2,x2,y2);
    p1 = [x1,y1], p2 = [x2,y2];
    x1 = nx1, y1 = ny1, x2 = nx2, y2 = ny2;
  }
  loop.push([x1,y1]);
  return loop;
}

function findStart() {
  for (let y=input.length;y-->0;)
    for(let x=input[y].length;x-->0;)
      if (input[y][x].length===4)
        return [x,y];
}

function get2Tiles(s) {
  const neighbors = getNeighbors(s)
    .filter(([x,y])=>x>=0&&y>=0)
    .filter(n=>getNeighbors(n)
      .some(([x,y])=>x===s[0]&&y===s[1]));
  
  input[s[1]][s[0]] = neighbors.map(([x,y])=>[x-s[0],y-s[1]]);
  
  return neighbors.map(([x,y])=>[s,[x,y]]);
}

function getNext([px,py],x,y) {
  return getNeighbors([x,y])
    .filter(([nx,ny])=>nx!=px||ny!=py)[0];
}

function getNeighbors([x,y]) {
  return input[y][x].map(([dx,dy])=>[x+dx,y+dy]);
}

function init(data) {
  return data.split('\n').map(row=>row.split('').map(c=>tiles[c]));
}

module.exports = {init, solve1, solve2}