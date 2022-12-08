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
  return null;
}

function solve2(input) {
  return null;
}

function prepareInput(data) {
  return data;
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