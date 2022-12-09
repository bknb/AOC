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

const dirMap = {'L':0,'R':1,'D':2,'U':3}

const H = [0,0];
let T = [0,0];

solveOptions().then(startSolver);
  
function solve1(input) {
  log(input);
  let result = input.reduce((a,[d,s])=>
    a.concat(Array.from(Array(s)).map(()=>{
      H[d>>1]+=d&1?1:-1;
      return [...H];
    })),[[0,0]]);
  log(result);
  result = result.map(c=>T=n(T,c));
  log(result);
  return [...new Set(result.map(x=>x.join()))].length;
}

function solve2(input) {
  log(input);
  let result = input.reduce((a,[d,s])=>
    a.concat(Array.from(Array(s)).map(()=>{
      H[d>>1]+=d&1?1:-1;
      return [...H];
    })),[[0,0]]);
  log(result);
  for (let i=9;i-->0;) {
    let T = [0,0];
    result = result.map(c=>T=n(T,c))
      .filter((x,i,a)=>i===0||x[0]!==a[i-1][0]||x[1]!==a[i-1][1]);
    log(result);
  }
  return [...new Set(result.map(x=>x.join()))].length;
}

function prepareInput(data) {
  return data.split('\n').map(x=>[dirMap[x[0]],+x.match(/\d+/)[0]]);
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

function d(a,b) {
  return [Math.abs(a[0]-b[0]),Math.abs(a[1]-b[1])];
}

function n(t,h) {
  const result = [...t];
  if(Math.abs(t[0]-h[0]) === 2) {
    result[0] = (t[0]+h[0])/2;
    result[1] = Math.abs(t[1]-h[1]) === 2 ? (t[1]+h[1])/2 : h[1];
  }
  if(Math.abs(t[1]-h[1]) === 2) {
    result[1] = (t[1]+h[1])/2;
    result[0] = Math.abs(t[0]-h[0]) === 2 ? (t[0]+h[0])/2 : h[0];
  }
  return result;
}