const {...helper} = require('../../../santasLittleHelper.js');

let input, log;

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

  const start = findStart();
  let [[p1,[x1,y1]],[p2,[x2,y2]]] = get2Tiles(start); 
  let d = 1;

  while(x1!=x2||y1!=y2) {
    log(d,x1,y1,x2,y2);
    d++;
    let [nx1,ny1] = getNext(x1,y1,p1);
    let [nx2,ny2] = getNext(x2,y2,p2);
    p1 = [x1,y1], p2 = [x2,y2];
    x1 = nx1, y1 = ny1, x2 = nx2, y2 = ny2;
  }

  return d;
}

function solve2(inp,l) {
  input = inp, log = l;
  return null;
}

function findStart() {
  let x0,y0;
  for (y0=input.length;y0-->0;)
    for(x0=input[y0].length;x0-->0;)
      if (input[y0][x0].length===4)
        return [x0,y0];
}

function get2Tiles(s) {
  return getNeighbors(s)
    .filter(([x,y])=>x>=0&&y>=0)
    .filter(n=>getNeighbors(n)
      .some(([x,y])=>x===s[0]&&y===s[1]))
    .map(([x,y])=>[s,[x,y]])
}

function walk([[p1,[x1,y1]],[p2,[x2,y2]]]) {
  if (x1===x2&&y1===y2) return 1;
  log(p1,p2);
  return 1 + walk([
    [[x1,y1],getNext(x1,y1,p1)],
    [[x2,y2],getNext(x2,y2,p2)]])
}

function getNext(x,y,[px,py]) {
  return getNeighbors([x,y])
    .filter(([nx,ny])=>nx!=px||ny!=py)[0];
}

function getNeighbors([x,y]) {
  return input[y][x].map(([dx,dy])=>[x+dx,y+dy]);
}

function init(data,log) {
  return data.split('\n').map(row=>row.split('').map(c=>tiles[c]));
}

module.exports = {init, solve1, solve2}