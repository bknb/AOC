const colors = require('colors');
const fs = require('fs');
const {solveOptions} = require('../../../questions.js');
const {frameIt,printMap,...helper} = require('../../../santasLittleHelper.js');

colors.setTheme({
  test: ['italic','bold'],
  main: ['bold','blue'],
  high1: ['green'],
  high2: ['red']
});

const signs = [' ','.','#'];
const cw = test?4:50;
const transTest = [[[5,2],[3,1],[2,1],[1,1]],
                   [[2,0],[4,3],[5,3],[0,1]],
                   [[3,0],[4,0],[1,2],[0,0]],
                   [[5,1],[4,1],[2,2],[0,3]],
                   [[5,0],[0,1],[2,3],[3,3]],
                   [[0,2],[1,0],[4,2],[3,2]]];
const transProd = [[[1,0],[2,1],[3,0],[5,0]],
                   [[4,2],[2,2],[0,2],[5,3]],
                   [[1,3],[4,1],[3,1],[0,3]],
                   [[3,0],[5,1],[0,0],[2,0]],
                   [[1,2],[5,2],[3,2],[2,3]],
                   [[4,3],[1,0],[0,3],[3,3]]];

let debug, test, map, ops, m, t;

solveOptions().then(startSolver);
  
function solve1() {
  log(printMap(map,signs),m,t);
  let f = 0;
  let x = 0;
  let y = map[x].findIndex(x=>x===1);
  while(m.length) {
    const [o,s,n] = [f&1,f>>1?-1:1,m.shift()];
    log(x,y,o,s,n);
    for(let i=n;i-->0;) {
      let nn = next(x,y,o,s);
      log(nn);
      if(nn[2]===2) break;
      [x,y] = nn;
    }
    if(t.length)
      f = (f+t.shift()+4)%4;
  }
  log(x,y,f);
  return 1000*(x+1)+4*(y+1)+f;
  
  function next(x,y,o,s) {
    let n = o?x:y;
    let result;
    do {
      n=(n+s+map.length)%map.length;
      result = o?[n,y,map[n][y]]:[x,n,map[x][n]];
    } while(!result[2])
    return result;
  }
}

function solve2() {
  const trans = test?transTest:transProd;
  log(printMap(map,signs),m,t);
  let f = 0;
  let x = 0;
  let y = map[x].findIndex(x=>x===1);
  while(m.length) {
    const n = m.shift();
    log(x,y,f,n);
    for(let i=n;i-->0;) {
      const [o,s] = [f&1,f>>1?-1:1]
      let nn = next(x,y,f,o,s);
      log(nn);
      if(nn[3]===3) break;
      [x,y,f] = nn;
    }
    if(t.length)
      f = (f+t.shift()+4)%4;
  }
  log(x,y,f);
  return 1000*(x+1)+4*(y+1)+f;
  
  function next(x,y,f,o,s) {
    let n = o?x:y;
    let result;
    do {
      n=(n+s+map.length)%map.length;
      result = o?[n,y,f,map[n][y]]:[x,n,f,map[x][n]];
    } while(!result[2])
    return result;
  }
}

function init(data) {
  [map,ops] = data.split('\n\n');
  map = map.split('\n')
    .map(r=>r.split('')
      .map(c=>signs.findIndex(x=>x===c)));
  m = ops.split(/[LR]/).map(x=>+x);
  t = ops.split(/\d+/).slice(1,-1).map(x=>x==='R'?1:-1);
}

function startSolver({options}) {
  console.log('');
  test = options.includes('Test');
  if (test) {
    console.log("~~TestRun~~".test);
  }
  const path = require('path')
    .resolve(__dirname, (test ? 'test' : 'input') + '.txt');
  fs.readFile(path, 'utf8', handleInput(options));
}

function handleInput(options) {
  return (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    debug = options.includes("Debug");
    init(data);
  
    if (options.includes("Part 1")) { 
      console.log('-------'+'\nPart 1:'.main+'\n-------');
      console.log('Solution:'.red.bold+solve1());
      console.log('');
    }
    if (options.includes("Part 2")) { 
      console.log('-------'+'\nPart 2:'.main+'\n-------');
      console.log('Solution:'.red.bold+solve2());
      console.log('');
    }
  }
}

function log(...text) {
  if(debug) console.log(...text);
  return text[0];
}