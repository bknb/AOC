const colors = require('colors');
const fs = require('fs');
const {solveOptions} = require('../../../questions.js');
const {lineWise} = require('../../../parser.js');

colors.setTheme({
  test: ['italic','bold'],
  main: ['bold','blue'],
  high1: ['green'],
  high2: ['red']
});

let debug, test, input;

solveOptions().then(startSolver);
  
function solve1(input) {
  const getNext = row =>
    row.every(x=>!x) ? 0 : row[row.length-1] +
    getNext(row.slice(1).reduce((a,b,i)=>a.concat(b-row[i]),[]));
  return input.map(getNext).reduce((a,b)=>a+b);
}

function solve2(input) {
  return solve1(input.map(x=>x.reverse()));
}

function init(data) {
  input = lineWise().chunkify().numberfy()(data);
}

function solve(input, part) {
  return part === 1 ? solve1(input) : solve2(input);
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
    if (err) return console.error(err);
    
    debug = options.includes("Debug");
    const prepStart = performance.now();
    init(data);
    const prepTime = performance.now()-prepStart;
    log('Input:'.blue, input);
    console.log(`prepared in ${prepTime.toFixed(2)}ms\n`.yellow);

    [1,2].filter(part=>options.includes(`Part ${part}`))
      .forEach(part => {
        console.log(`-------\n${`Part ${part}:`.main}\n-------`);
        const start = performance.now();
        console.log('Solution: '.red.bold+solve(input,part));
        console.log(`in ${(performance.now()-start).toFixed(2)}ms\n`.magenta);
      });
  }
}

function log(...text) {
  if(debug) console.log(...text);
  return text[0];
}