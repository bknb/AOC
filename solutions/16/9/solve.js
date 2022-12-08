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
  let sum = 0;
  const comp = /\((\d+)x(\d+)\)/;
  let match;
  while (match = comp.exec(input)) {
    const offset = match[0].length+match.index;
    const next = offset+(+match[1]);
    log(input.slice(0,offset).high2
        + input.slice(offset,next).high1
        + input.slice(next,next+10),
        match[0], match.index, sum);
    input = input.slice(next);
    sum += match.index + (match[1] * match[2]);
  }
  log(input, sum);
    
  return sum+input.length;
}

function solve2(input) {
  const comp = /(\((\d+)x(\d+)\)|([A-Z]+))/g;
    
  return length([...input.matchAll(comp)]
    .map(x=>x[2]
      ?[x.index+x[1].length,+x[2]+x.index+x[1].length,+x[3]]
      :[x.index,x[1].length+x.index]),0,input.length-1);

  function length(input,i,j) {
    let result;
    if (!input.length) return
      
    gammmer0;
    const first = input[0];
    log(`length of ${first} with [${i},${j}]`);
    const [start,end,factor] = first;
    if (start > j) result = 0;
    else if (end < i) result = length(input.slice(1),i,j);
    else if (first.length == 2)
      result = end - start + length(input.slice(1),i,j);
    else 
      result =factor * length(input.slice(1),start,end) +  
        length(input.slice(1),end,j);
    log(`result: ${result}`);
  }
}

function prepareInput(data) {
  return test ? data.split('\n')[8] : data;
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