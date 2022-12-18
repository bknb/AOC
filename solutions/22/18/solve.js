const colors = require('colors');
const fs = require('fs');
const {solveOptions} = require('../../../questions.js');
const {getBounds,inBounds,...helper} = require('../../../santasLittleHelper.js');

colors.setTheme({
  test: ['italic','bold'],
  main: ['bold','blue'],
  high1: ['green'],
  high2: ['red']
});

let debug, test, input;

solveOptions().then(startSolver);
  
function solve1() {
  const bounds = getBounds(input);
  const map = [...Array(bounds[1][0]+2)]
    .map(()=>[...Array(bounds[1][1]+2)]
      .map(()=>[...Array(bounds[1][2]+2)]
        .fill(false)));
  input.forEach(([x,y,z])=>map[x][y][z]=true);
  log(bounds)
  let sides = 0;
  input.forEach(i=>{
    for(let l=3;l-->0;)
      for(let m=2;m-->0;) {
        const n = i.map((x,n)=>x+(l!==n?0:m&1?1:-1));
        if(log(isNextToWater(n),
               n,'<-',i,
               l===2?'d':l===1?'h':'w',
               m&1?'>':'<'))
          sides++;
      }});

  return sides;

  function isNextToWater(n){
    return n.some(x=>x<0)||!get(n);
  }

  function get([x,y,z]) {
    return map[x][y][z];
  }
}

function solve2() {
  const bounds = getBounds(input);
  const lava = [...Array(bounds[1][0]+2)]
    .map(()=>[...Array(bounds[1][1]+2)]
      .map(()=>[...Array(bounds[1][2]+2)]
        .fill(false)));
  const water = [...Array(bounds[1][0]+2)]
    .map(()=>[...Array(bounds[1][1]+2)]
      .map(()=>[...Array(bounds[1][2]+2)]
        .fill(false)));
  input.forEach(x=>setLava(x,true));
  log(bounds)
  let sides = 0;
  input.forEach(i=>{
    for(let l=3;l-->0;)
      for(let m=2;m-->0;) {
        const n = i.map((x,n)=>x+(l!==n?0:m&1?1:-1));
        if(log(isNextToWater(n),n))
          sides++;
      }});

  return sides;

  function isNextToWater(i){
    const checked = [];
    return findWater(i)

    function findWater(i) {
      log('check: ',i);
      if(!inBounds(i,bounds)) return true;
      if(isWater(i)) return true;
      if(isLava(i)) return false;
      if(checked.some(x=>x.every((e,j)=>e===i[j]))) return false;
      checked.push(i);
      for(let l=3;l-->0;)
        for(let m=2;m-->0;) {
          const n = i.map((x,nn)=>x+(l!==nn?0:m&1?1:-1));
          if(findWater(n)) return setWater(i,true);
        }
      return false;
    }
  }

  function isLava([x,y,z]) {
    return lava[x][y][z];
  }
  function setLava([x,y,z],v) {
    return lava[x][y][z] = v;
  }
  function isWater([x,y,z]) {
    return water[x][y][z];
  }
  function setWater([x,y,z],v) {
    return water[x][y][z] = v;
  }
}

function init(data) {
  input = data.split('\n').map(r=>r.split(',').map(x=>+x));
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