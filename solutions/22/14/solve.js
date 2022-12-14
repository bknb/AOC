const colors = require('colors');
const fs = require('fs');
const {solveOptions} = require('../../../questions.js');
const helper = require('../../../santasLittleHelper.js');

colors.setTheme({
  test: ['italic','bold'],
  main: ['bold','blue'],
  high1: ['green'],
  high2: ['red']
});

let debug, test, input;
let signs = [' ','~'.blue,'+'.bold,'#'.grey,'o'.yellow];

solveOptions().then(startSolver);
  
function solve1() {
  return solve(1,2,30);
}

function solve2() {
  return solve(8,0,30,2);
}

function solve(padX, padY, cut, wall, spring = [0,500]) {
  let bounds, drawBounds, fillMap, steps=0;

  setBounds(wall);
  
  prepareFillMap(getAllStones(input));

  printMap();
  while(fillSand(spring[0],spring[1])) steps++;
  
  log('------Solution-----');
  printMap();
  return steps;

  function fillSand(x,y) {
    if (fillMap[x][y]>2) return false;
    fillMap[x][y] = 1;
    if (!helper.inBounds(x+1,y,bounds)) return false;
    if (fillMap[x+1][y]<=2) return fillSand(x+1,y);
    if (fillMap[x+1][y-1]<=2) return fillSand(x+1,y-1);
    if (fillMap[x+1][y+1]<=2) return fillSand(x+1,y+1);
    return fillMap[x][y] = 4;
  }

  function getAllStones(coords) {
    return coords.map(r=>r.slice(1).reduce((a,[x,y])=>{
      const add = []
      const [xo,yo] = a[0];
      const isX = xo !== x;
      const diff = isX?x-xo:y-yo;
      for(let i=0;i!==diff;diff>0?i++:i--)
        add.push([isX?x-i:x,isX?y:y-i])
      return add.concat(a);
    },[r[0]])).reduce((a,c)=>a.concat(c));
  }

  function prepareFillMap(stones) {
    fillMap = helper.create2DimArray(bounds[1][0]+1,1001,0);
    fillMap[spring[0]][spring[1]] = 2;
    stones.forEach(([x,y])=>fillMap[x][y]=3);
  }

  function setBounds(wall) {
    bounds = helper.getBounds(input
      .reduce((a,c)=>a.concat(c)).concat([spring]));
    bounds[1][1]+=padX+1; 
    bounds[0][1]-=padX; 
    bounds[1][0]+=padY;

    let add = wall !== undefined 
      && [[bounds[1][0]+wall,0],[bounds[1][0]+wall,1000]];
    
    drawBounds = bounds.map(r=>[...r]);
    if(add) {
      bounds = helper.getBounds(bounds.concat(helper.getBounds(add)));
      input.push(add);
    }
  }

  function printMap() {
    log(helper.printMap(test?fillMap:fillMap.slice(-cut),drawBounds,signs));
  }
}

function init(data) {
  input = data.split('\n')
    .map(r=>r.split(' -> ')
      .map(c=>c.split(',').map(x=>+x).reverse()));
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
      console.log(solve1());
      console.log('');
    }
    if (options.includes("Part 2")) { 
      console.log('-------'+'\nPart 2:'.main+'\n-------');
      console.log(solve2());
      console.log('');
    }
  }
}

function log(...text) {
  if(debug) console.log(...text);
}