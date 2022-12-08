const fs = require('fs');
const {solveOptions} = require('../../../questions.js');

let debug;

const change = /cd ([a-z\/\.]+)/;
const file = /(\d+) ([a-z\.]+)/;

solveOptions().then(startSolver);
  
function solve1(input) {
  const summary = handleCommands(input,[],{});
  return Object.values(summary)
    .filter(x=>x<100000)
    .reduce((a,c)=>a+c,0);
}

function solve2(input) {
  const summary = handleCommands(input,[],{});
  const toFree = summary['/'] - 40000000;
  return Math.min(...Object.values(summary)
    .filter(x=>x>toFree));
}

function handleCommands(input,accu,map) {
  if (input.length === 0)
    return map;
  
  log('--------------');
  log('handling: '+input[0]);
  const c = input[0].match(change);
  const f = input[0].match(file);
  if (c) {
    if(c[1] !== '..') {
      const path = (accu.length ? accu[accu.length-1]+'/' : '')+c[1];
      accu.push(path);
      map[path] = 0;
      log('go to: '+path);
      printStatus();
      handleCommands(input.slice(1),accu,map);
    }
    else {
      const last = accu.pop();
      log('go back to: '+accu[accu.length-1]);
      printStatus();
      handleCommands(input.slice(1),accu,map);
    }
  }
  else if(f) {
    log('add file: ' + f[2]);
    accu.forEach(x=>map[x]+=+f[1]);
    printStatus();
    handleCommands(input.slice(1),accu,map);
  }
  else {
    log('ignore line');
    handleCommands(input.slice(1),accu,map);
  }
  handleCommands(accu.map(x=>'cd ..'),accu,map);
  return map;

  function printStatus() {
    log('path: '+accu[accu.length-1]);
    log('summary: '+JSON.stringify(map));
  }
}

function prepareInput(data) {
  return data.split('\n');
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
    debug = options.includes("Debug");
    const input = prepareInput(data);
  
    if (options.includes("Part 1")) { 
      console.log('-------');
      console.log('Part 1:');
      console.log('-------');
      console.log(solve1(input));
    }
    if (options.includes("Part 2")) { 
      console.log('-------');
      console.log('Part 2:');
      console.log('-------');
      console.log(solve2(input));
    }
  }
}

function log(text) {
  if(debug) console.log(text);
}