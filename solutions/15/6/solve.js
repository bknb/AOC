const colors = require('colors');
const fs = require('fs');
const {solveOptions} = require('../../../questions.js');
const {frameIt, printMap, create2DimArray, ...helper} =
  require('../../../santasLittleHelper.js');

colors.setTheme({
  test: ['italic','bold'],
  main: ['bold','blue'],
  high1: ['green'],
  high2: ['red']
});

let debug, test, input;

const actions = {
  "turn off": 0,
  "turn on": 1,
  "toggle": 2
}

const actions2 = {
  "turn off": -1,
  "turn on": 1,
  "toggle": 2
}

solveOptions().then(startSolver);
  
function solve1() {
  const field = create2DimArray(1000, 1000, false);
  input
    .map(([[,a,x1,y1,x2,y2]])=>[actions[a],[+x1,+y1],[+x2,+y2]])
    .forEach(row=>turnTheLights(row, field));
  return field.map(row=>row.filter(x=>x).length).reduce((a,b)=>a+b,0);
}

function solve2() {
  const field = create2DimArray(1000, 1000, 0);
  input
    .map(([[,a,x1,y1,x2,y2]])=>[actions2[a],[+x1,+y1],[+x2,+y2]])
    .forEach(row=>turnTheLights2(row, field));
  return field.map(row=>row.reduce((a,b)=>a+b,)).reduce((a,b)=>a+b,0);
}

function turnTheLights2([a,[x1,y1],[x2,y2]], field) {
  for (let i=x1;i<=x2;i++)
    for(let j=y1;j<=y2;j++)
      field[i][j] = Math.max(field[i][j] + a,0);
}

function turnTheLights([a,[x1,y1],[x2,y2]], field) {
  for (let i=x1;i<=x2;i++)
    for(let j=y1;j<=y2;j++)
      field[i][j] = a === 2 ? !field[i][j] : !!a;
}

function init(data) {
  input = data.split('\n')
    .map(row=>[...row.matchAll(/(t.*) (\d+),(\d+) \w+ (\d+),(\d+)/g)]);
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
    const prepStart = performance.now();
    init(data);
    console.log(`prepared in ${(performance.now()-prepStart).toFixed(2)}ms\n`.yellow);

    if (options.includes("Part 1")) { 
      console.log('-------'+'\nPart 1:'.main+'\n-------');
      const start = performance.now();
      console.log('Solution: '.red.bold+solve1());
      console.log(`in ${(performance.now()-start).toFixed(2)}ms`.magenta);
      console.log('');
    }
    if (options.includes("Part 2")) { 
      console.log('-------'+'\nPart 2:'.main+'\n-------');
      const start = performance.now();
      console.log('Solution: '.red.bold+solve2());
      console.log(`in ${(performance.now()-start).toFixed(2)}ms`.magenta);
      console.log('');
    }
  }
}

function log(...text) {
  if(debug) console.log(...text);
  return text[0];
}