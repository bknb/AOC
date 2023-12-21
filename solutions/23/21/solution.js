const {printMap, create2DimArray} = require('../../../santasLittleHelper.js');
const {grid} = require('../../../parser.js');
let input, log;

const dirMap=[[1,0],[0,1],[-1,0],[0,-1]];

function solve1(inp,l, steps = 64) {
  input = inp, log = l;
  let starts = [];
  let map = create2DimArray(input[0].length, input.length, false);
  for (let i=input.length; i-->0;)
    for (let j=input[i].length; j-->0;) {
      if (input[i][j] === 'S')
        starts = [[i,j]];
        map[i][j] = input[i][j] === '#';
    }
  for (let i=steps; i-->0;) {
    let next = new Set();
    for (let [x,y] of starts)
      for (let [dx,dy] of dirMap) {
        let [nx,ny] = [x+dx,y+dy];
        if (ny >= 0 && ny < map.length 
            && nx >= 0 && nx < map[0].length
            && !map[nx][ny])
          next.add(nx+','+ny);
      }
    starts = Array.from(next).map(s=>s.split(',').map(n=>+n));
  }
  return starts.length;
}

function solve2(inp,l, steps = 50) {
  input = inp, log = l;
  let starts = [];
  const w = input[0].length, h = input.length;
  for (let i=h; i-->0;)
    for (let j=w; j-->0;) {
      if (input[i][j] === 'S')
        starts = [[i,j,0,0]];
      input[i][j] = input[i][j] === '#';
    }
  const cache = new Map();
  for (let i=h; i-->0;)
    for (let j=w; j-->0;) {
      if (!input[i][j]) {
        let next = [];
        for (let [dx,dy] of dirMap) {
          let [nx,ny] = [j+dx,i+dy];
          let ngx = 0, ngy = 0;
          if (ny < 0) {
            ngy--;
            ny = (ny + h) % h;
          } 
          if (nx < 0) {
            ngx--;
            nx = (nx + w) % w;
          } 
          if (ny >= h) {
            ngy++;
            ny = ny % h;
          } 
          if (nx >= w) {
            ngx++;
            nx = nx % w;
          }
          if (!input[ny][nx])
            next.push([nx,ny,ngx,ngy]);
        }
        cache.set(j*h+i, next);
      }
    }
  for (let i=steps; i-->0;) {
    let n = new Set();
    for (let [x,y,gx,gy] of starts) {
      cache.get(x*h+y).map(s=>
        s[0]+','+s[1]+','+(s[2]+gx)+','+(s[3]+gy))
        .forEach(e=>n.add(e));
    }
    starts = Array.from(n).map(s=>s.split(',').map(n=>+n));
  }
  return starts.length;
}

function init(data,log) {
  return grid()(data);
}

module.exports = {init, solve1, solve2}