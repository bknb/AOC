const colors = require('colors');
const fs = require('fs');
const {solveOptions} = require('../../../questions.js');

colors.setTheme({
  test: ['italic','bold'],
  main: ['bold','blue'],
  high1: ['green'],
  high2: ['red']
});

let debug, test;

solveOptions().then(startSolver);
  
function solve1(input) {
  let s = 1;
  let c = 1;
  let result = 0;
  const stops = input.map(x=>[s+=x,c+=x===0?1:2]);
  for(let i=6;i-->0;) result+=value(20+40*i); 
  
  return result;

  function value(b) {
    return stops.filter(([,e])=>e<=b).slice(-1)[0][0] * b;
  }
}

function solve2(input) {
  let s = 0;
  let y = 0;
  let result = '';
  let stops = [[s,0]].concat(input.map(x=>[s+=x,y+=x===0?1:2]))
    .reverse();
  log(stops);
  for(let i=0;i<240;i++) {
    if (i%40===0 && i!=0) result+='\n';
    let d = (i - stops.find(([,x])=>i>=x)[0])%40;
    log(i,d,stops.find(([,x])=>i>=x));
    result+=0<=d&&d<3?'#':'.';
  }
  return result;
}

function prepareInput(data) {
  return data.split('\n')
    .map(x=>/-?\d+/.test(x)?+x.match(/-?\d+/)[0]:0);
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
    const input = prepareInput(data);
  
    if (options.includes("Part 1")) { 
      console.log('-------'+'\nPart 1:'.main+'\n-------');
      console.log(solve1(input));
      console.log('');
    }
    if (options.includes("Part 2")) { 
      console.log('-------'+'\nPart 2:'.main+'\n-------');
      console.log(solve2(input));
      console.log('');
    }
  }
}

function log(...text) {
  if(debug) console.log(...text);
}