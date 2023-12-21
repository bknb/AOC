const colors = require('colors');
const fs = require('fs');
const {solveOptions} = require('../../../questions.js');
const {init, solve1, solve2} = require('./solution.js');

colors.setTheme({
  test: ['italic','bold'],
  main: ['bold','blue'],
  high1: ['green'],
  high2: ['red']
});

let debug, test, input;

solveOptions().then(startSolver);

function startSolver({options}) {
  console.log('');
  test = options.includes('Test');
  if (test) {
    console.log("~~TestRun~~".test);
  }
  const filePath = require('path')
    .resolve(__dirname, (test ? 'test' : 'input') + '.txt');
  fs.readFile(filePath, 'utf8', handleInput(options));
}

function solve(part, ...rest) {
  return part === 1 ? solve1(...rest) : solve2(...rest);
}

function handleInput(options) {
  return (err, data) => {
    if (err) return console.error(err);

    debug = options.includes("Debug");
    const prepStart = performance.now();
    input = init(data,log);
    const prepTime = performance.now()-prepStart;
    log('Input:'.blue, input);
    console.log(`prepared in ${prepTime.toFixed(2)}ms\n`.yellow);

    [1,2].filter(part=>options.includes(`Part ${part}`))
      .forEach(part => {
        console.log(`-------\n${`Part ${part}:`.main}\n-------`);
        const start = performance.now();
        console.log('Solution: '.red.bold+solve(part,input,log));
        console.log(`in ${(performance.now()-start).toFixed(2)}ms\n`.magenta);
      });
  }
}

function log(...text) {
  if(debug) console.log(...text);
  return text[0];
}