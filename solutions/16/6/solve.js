const fs = require('fs');
const {solveOptions} = require('../../../questions.js');

solveOptions().then(startSolver);
  
function solve1(input,debug) {
  let result = '';
  for (let i=0;i<input[0].length;i++) {
    let counts = {};
    for(let j=input.length;j-->0;)
      counts[input[j][i]] = counts[input[j][i]] + 1 || 1;
    if (debug) console.log(counts);
    result += Object.keys(counts)
      .reduce((a,c)=>counts[c]>counts[a]?c:a,Object.keys(counts)[0]);
  }
  return result;
}

function solve2(input,debug) {
  let result = '';
  for (let i=0;i<input[0].length;i++) {
    let counts = {};
    for(let j=input.length;j-->0;)
      counts[input[j][i]] = counts[input[j][i]] + 1 || 1;
    if (debug) console.log(counts);
    result += Object.keys(counts)
      .reduce((a,c)=>counts[c]<counts[a]?c:a,Object.keys(counts)[0]);
  }
  return result;
}

function prepareInput(data,debug) {
  return data.split('\n').map(x=>x.split(''));
}

function startSolver({options}) {
  const test = options.includes('Test');
  if (test) {
    console.log("TestRun");
    console.log("=======");
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
    const debug = options.includes("Debug");
    const input = prepareInput(data,debug);
  
    if (options.includes("Part 1")) { 
      console.log('-------');
      console.log('Part 1:');
      console.log('-------');
      console.log(solve1(input,debug));
    }
    if (options.includes("Part 2")) { 
      console.log('-------');
      console.log('Part 2:');
      console.log('-------');
      console.log(solve2(input,debug));
    }
  }
}