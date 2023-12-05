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
  const parts = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      let number = '';
      while(/\d/.test(input[i][j]))
        number+=input[i][j++];
      number && log(number);
      const l = number.length;
      if(number && (
        (i>0 && input[i-1]
         .slice(j-l>0?j-l-1:0,j+1)
         .some(x=>!/\./.test(x)))
        || (j-l>0 && !/\./.test(input[i][j-l-1]))
        || (j<input[i].length && !/\./.test(input[i][j]))
        || (i<input.length-1 && input[i+1]
            .slice(j-l>0?j-l-1:0,j+1)
            .some(x=>!/\./.test(x)))))
        parts.push(number);
    }
  }
  log(parts);
  return parts.reduce((a, b) => a+ +b, 0);
}

function solve2() {
  let sum = 0;
  const parts = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      let number = '';
      while(/\d/.test(input[i][j]))
        number+=input[i][j++];
      if(number)
        parts.push([+number,i,j-number.length,j-1]);
    }
  }
  log(parts);
  input.forEach((row,i)=>
    row.forEach((x,j)=>{
      if(/\*/.test(x)) {
        const f = parts.filter(x=>
          x[1]>=i-1 && 
          x[1]<=i+1 && 
          x[2]<=j+1 && 
          x[3]>=j-1);
        log(f);
        if(f.length===2)
          sum += f[0][0]*f[1][0];
      }
    }));
  return sum;
}

function init(data) {
  input = data.split('\n').map(row=>row.split(''));
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