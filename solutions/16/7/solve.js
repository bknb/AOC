const fs = require('fs');
const {solveOptions} = require('../../../questions.js');

const hyper = /(?<=\[)([a-z]+)(?=\])/g;

solveOptions().then(startSolver);
  
function solve1(input,debug) {
  return input
    .filter(x=>
      hasAbba(x[0]) && !hasAbba(x[1])).length;
}

function solve2(input,debug) {
  return input
    .filter(x=>{
      const abas = getAbas(x[0]);
      const babs = getAbas(x[1]);
      if (debug) console.log(x,abas,babs);
      return abas.some(x=>babs.some(y=>x[0]===y[1]&&x[1]===y[0]));
    }).length;
}

function hasAbba(text) {
  return /([a-z])(?!\1)([a-z])\2\1/.test(text);
}

function getAbas(text) {
  return Array.from(text.matchAll(/(?=(([a-z])(?!\2)[a-z]\2))/g),x=>x[1]);
}

function prepareInput(data,debug) {
  return data.split('\n')
    .map(x=>[x.replace(hyper,'!'),[...x.match(hyper)].join('[!]')]);
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