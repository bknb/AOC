const colors = require('colors');
const fs = require('fs');
const {solveOptions} = require('../../../questions.js');
const { lcm } = require('mathjs');

colors.setTheme({
  test: ['italic','bold'],
  main: ['bold','blue'],
  high1: ['green'],
  high2: ['red']
});

let debug, test, input;
let ins, ways, trans;

const insMap = {L: 0,R: 1};

solveOptions().then(startSolver);
  
function solve1() {
  return getStepsToGoal(trans['AAA'],[trans['ZZZ']]);
}

function solve2() {
  const keys = Object.keys(trans);
  const starts = keys.filter(x=>x.endsWith('A')).map(x=>trans[x]);
  const ends = keys.filter(x=>x.endsWith('Z')).map(x=>trans[x]);

  return starts.map(x=>getStepsToGoal(x,ends)).reduce((a,b)=>lcm(a,b));
}

function getStepsToGoal(current,ends) {
  let step = 0;
  while(!ends.includes(current))
    current = log(ways[current][ins[step++%ins.length]])
  return step;
}

function init(data) {
  input = data.split('\n');
  ins = input.shift().split('').map(x=>insMap[x]);
  ways = input.slice(1).map(x=>x.match(/\w+/g));

  trans = {};
  ways.forEach((way,i)=>trans[way[0]]=i)

  ways = ways.map(([,r,l])=>[trans[r],trans[l]]);
  log(ins,ways,trans);
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
    const prepTime = performance.now()-prepStart;
    console.log(`prepared in ${prepTime.toFixed(2)}ms\n`.yellow);

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