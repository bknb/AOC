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
const order = [...Array(4).keys()].reverse();

solveOptions().then(startSolver);
  
function solve1() {
  const l = input.l;
  const map = [...Array(l)]
    .map(()=>[...Array(l<<1)])
    .concat(map.map(r=>
      [...Array(l.concat(r)));

  
  return null;
}

function solve2() {
  return null;
}

function init(data) {
  input = data.split('\n')
    .map(r=>r.split('').map(c=>c==='#'));
}

function movers(map) {
  const ms = [];
  return map.forEach((r,i)=>r.forEach((c,j)=>{
    if(c) {
      const northRow = 
    }
  }));
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