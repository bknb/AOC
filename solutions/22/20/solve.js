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

solveOptions().then(startSolver);
  
function solve1() {
  return solve(1,1);
}

function solve2() {
  return solve(811589153,10);
}

function solve(f,t) {
  const l = input.length;
  input = input.map(x=>x*f);
  const orderMap = input.map((x,i)=>[x,i]);
  
  log(input.join());
  for(let i=t;i-->0;) {
    orderMap.forEach(x=>{
      if(x[0]===0) return;
      const m = x[0]%(l-1);
      const n = m<0;
      let s = m+x[1];
      const b = [x[1],(s+l)%l,Math.floor(s/l)];
      log(b,x);
      orderMap.forEach(y=>
        x===y?y[1]=b[1]+b[2]:n
          ?(b[2]!==0 
            ?y[1]-=y[1]>=b[0]&&y[1]<b[1]
            :y[1]+=y[1]>=b[1]&&y[1]<b[0])
          :(b[2]!==0
            ?y[1]+=y[1]<=b[0]&&y[1]>b[1]
            :y[1]-=y[1]<=b[1]&&y[1]>b[0]))
    })
  }

  const sortedMap = [];
  orderMap.forEach(([x,i])=>sortedMap[i]=x);
  const zeroIndex = sortedMap.findIndex(x=>x===0);
  log(sortedMap.join());
  return [...Array(3)].map((x,i)=>(1+i)*1000)
    .reduce((a,c)=>a+sortedMap[(zeroIndex+c)%l],0);
}

function init(data) {
  input = data.split('\n').map(x=>+x);
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