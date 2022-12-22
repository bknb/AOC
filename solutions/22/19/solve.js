const colors = require('colors');
const fs = require('fs');
const {solveOptions} = require('../../../questions.js');
const {...helper} = require('../../../santasLittleHelper.js');

colors.setTheme({
  test: ['italic','bold'],
  main: ['bold','blue'],
  high1: ['green'],
  high2: ['red']
});

let debug, test, input;

const minutes = 24;
const f = [...Array(4)].fill(-1);

solveOptions().then(startSolver);
  
function solve1() {
  return input.map(getMaxGeodes).reduce((a,c,i)=>a+c*i);

  function getMaxGeodes(b) {
    log(b)
    return recMax([1,0,0,0],[0,0,0,0],minutes);
    function recMax(rs,a,r) {
      if(r<=0) return a[3];
      if(rs.some((x,i)=>x===0&&f[i]>r)) return 0;
      const nc = log(getNewConfs(rs,a,r),r);
      return nc.map(([rs1,a1])=>recMax(rs1,add(a1,rs1),r-1))
        .reduce((a,c)=>a>c?a:c);
    }

    function getNewConfs(rs,a,r){
      const result = [[rs,a]];
      for(let i=4;i-->0;)
        if(enough(a,b[i])) {
          const nrs = [...rs];
          if(nrs[i]++==0) f[i]=r;
          result.push(...getNewConfs(nrs,sub(a,b[i])));
        }
      return result;
    }
  }
}

function solve2() {
  return null;
}

function add(x,y) {
  return x.map((e,i)=>e+y[i]);
}

function enough(x,y) {
  return x.every((x,i)=>x>=y[i]);
}

function sub(x,y) {
  return x.map((e,i)=>e-y[i]);
}

function init(data) {
  input = data.split('\n')
    .map(r=>r.match(/\d+/g))
    .map(([,o,c,bo,bc,go,gb])=>
      [[+o,0,0,0],[+c,0,0,0],[+bo,+bc,0,0],[+go,0,+gb,0]]);
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