const fs = require('fs');
const md5 = require('md5');
const {solveOptions} = require('../../../questions.js');

solveOptions().then(startSolver);
  
function solve1(input,debug) {
  let number = 0;
  let result = '';
  for (let i=8;i-->0;) {
    let hash;
    do
      hash = md5(input+number++);
    while (!hash.startsWith('00000'))
    result += hash[5]; 
    if(debug) console.log(number,hash,result);
  }
  return result;
}

function solve2(input,debug) {
  let number = 0;
  let result = [];
  for (let i=8;i-->0;) {
    let hash;
    do
      hash = md5(input+number++);
    while (!hash.startsWith('00000'))
    if(hash[5].match(/[0-7]/) && !result[hash[5]])
      result[hash[5]] = hash[6];
    else i++;
    if(debug) console.log(number,hash,result.join(''));
  }
  return result.join('');
}

function prepareInput(data,debug) {
  return data;
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