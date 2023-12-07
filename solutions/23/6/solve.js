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
  return log(input.map(waysToWin)).reduce((a,b)=>a*b,1);
}

function solve2() {
  const newInput = input.reduce(([t1,d1],[t2,d2])=>[t1+t2,d1+d2],['','']).map(x=>+x);
  return waysToWin(newInput);
}

function waysToWin([t,d]) {
  const half = t/2;
  const dis = Math.sqrt(half*half-d);
  return Math.floor(half+dis)
    -Math.ceil(half-dis)
    +(Number.isInteger(half+dis)?-1:1);
}

function init(data) {
  const [t,d] = data.split('\n').map(row=>row.match(/\d+/g));
  input = t.map((x,i)=>[x,d[i]]);
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
    const prepStart = performance.now();
    init(data);
    console.log(`prepared in ${(performance.now()-prepStart).toFixed(2)}ms\n`.yellow);

    if (options.includes("Part 1")) { 
      console.log('-------'+'\nPart 1:'.main+'\n-------');
      const start = performance.now();
      console.log('Solution: '.red.bold+solve1());
      console.log(`in ${(performance.now()-start).toFixed(2)}ms`.magenta);
      console.log('');
    }
    if (options.includes("Part 2")) { 
      console.log('-------'+'\nPart 2:'.main+'\n-------');
      const start = performance.now();
      console.log('Solution: '.red.bold+solve2());
      console.log(`in ${(performance.now()-start).toFixed(2)}ms`.magenta);
      console.log('');
    }
  }
}

function log(...text) {
  if(debug) console.log(...text);
  return text[0];
}