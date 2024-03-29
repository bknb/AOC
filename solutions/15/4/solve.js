const colors = require('colors');
const fs = require('fs');
const md5 = require('js-md5');
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
  return input.map(x=>findSmallestNumber5(log(x)));
}

function solve2() {
  return input.map(x=>findSmallestNumber6(log(x)));
}

function init(data) {
  input = data.split('\n');
}

function findSmallestNumber5(start) {
  let i=0;
  while(true)
    if(/^0{5}.*$/.test(md5(log(`${start}${i++}`))))
      return i-1;
}

function findSmallestNumber6(start) {
  let i=0;
  while(true)
    if(/^0{6}.*$/.test(md5(log(`${start}${i++}`))))
      return i-1;
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