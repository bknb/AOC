const fs = require('fs');
const {solveOptions} = require('../../../questions.js');

let debug;

solveOptions().then(startSolver);

const array = [];
let width = 50;
let height = 6;
  
function solve1(input) {
  init();
  input.forEach(handleCommand);
  return sumLights();
}

function solve2(input) {
  return null;
}

function handleCommand(c) {
  log(`handle command ${c}`,true);
  if(c[0]) {
    for(let i=c[2];i-->0;)
      for(let j=c[3];j-->0;)
        array[j][i] = true;
    log(arrayString([0,0],[c[2]-1,c[3]-1]));
  }
  else if (c[1]) {
    shiftRowBy(c[2],c[3]);
    log(arrayString([0,c[2]],[width,c[2]],[c[3]-1,c[2]]));
  }
  else { 
    shiftColBy(c[2],c[3]);
    log(arrayString([c[2],0],[c[2],height],[c[2],c[3]-1]));
  }
}

function shiftRowBy(y,b) {
  const newOrder = Array(width).fill(false);
  for(let i=width;i-->0;)
    if(array[y][i]) newOrder[(i+b)%width] = true;
  array[y] = newOrder;
}

function shiftColBy(x,b) {
  const newOrder = Array(height).fill(false);
  for(let i=height;i-->0;)
    if(array[i][x]) newOrder[(i+b)%height] = true;
  for(let i=height;i-->0;)
    array[i][x] = newOrder[i];
}

function sumLights() {
  return array.map(x=>x.filter(y=>y).length)
    .reduce((a,c)=>a+c,0);
}

function arrayString(up,down,mid) {
  return array.map((x,i)=>
    x.map((y,j)=>{
      const element = y?'x':'.';
      if(up && i>=up[1] && i<=down[1] && j>=up[0] && j<=down[0])
        if(mid && i<=mid[1] && j<=mid[0])
          return `\x1b[31m${element}\x1b[0m`;
        else
          return `\x1b[32m${element}\x1b[0m`;
      return element;
    }).join(''))
    .join('\n');
}

function init() {
  for(let i=height;i-->0;)
    array[i] = Array(width).fill(false);
}

function prepareInput(data) {
  return data.split('\n')
    .map(x=>x.match(/([eo]).*([cr]).*(\d+).*(\d+)/))
    .map(([,o,d,x,y])=>[+(o==='e'),+(d==='r'),+x,+y]);
}

function startSolver({options}) {
  const test = options.includes('Test');
  if (test) {
    console.log("TestRun");
    console.log("=======");
    width = 7;
    height = 3;
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
    const input = prepareInput(data);
  
    if (options.includes("Part 1")) { 
      console.log('-------');
      console.log('Part 1:');
      console.log('-------');
      console.log(solve1(input));
    }
    if (options.includes("Part 2")) { 
      console.log('-------');
      console.log('Part 2:');
      console.log('-------');
      console.log(solve2(input));
    }
  }
}

function log(text) {
  if(debug) console.log(`${text}`);
}