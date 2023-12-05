const colors = require('colors');
const fs = require('fs');
const {solveOptions} = require('../../../questions.js');
const {...helper} = require('../../../santasLittleHelper.js');

colors.setTheme({
  test: ['italic','bold'],
  main: ['bold','blue'],
  high1: ['green'],
  high2: ['red']
});

let debug, test, input;

solveOptions().then(startSolver);
  
function solve1() {
  let seeds = input[0];
  const steps = input.slice(1);
  log(seeds,steps);
  steps.forEach(set => seeds = log(seeds.map(seed => step(seed,set))));
  return Math.min(...seeds);
}

function solve2() {
  let seeds = [];
  input[0].forEach((value,i)=>
    i&1 ? seeds[seeds.length-1].push(seeds[seeds.length-1][0]+value-1) 
    : seeds.push([value]));
  const steps = input.slice(1)
    .map(step=>step.map(([d,s,l])=>[[s,s+l-1],d-s]));
  steps.forEach(set=>set.sort(([a],[b])=>a[1]-b[1]));
  log(seeds,...steps);
  steps.forEach(set=>
    seeds=log(seeds.map(range=>step2(range,set))
    .reduce((a,b)=>a.concat(b),[])));
  return Math.min(...seeds.map(x=>x[0]));
}

function step(number, set) {
  for (let i=set.length;i-->0;)
    if (number >= set[i][1] && number < set[i][1]+set[i][2])
      return set[i][0] + number - set[i][1];
  return number;
}

function step2([start, end], [current,...rest]) {
  if (current) {
    const [[from,to],shift] = current;
    if (start>=from)
      if (end<=to)
        return [[start,end].map(x=>x+shift)];
      else 
        if (start<=to)
          return [[start,to].map(x=>x+shift)]
                  .concat(step2([to+1,end],rest));
        else
          return step2([start,end],rest);
    else if (end>=from)
      return [[start,from-1]]
        .concat(step2([from,end],rest));
  }
        
  return [[start,end]];
}

function merge(set1,set2) {
}

function init(data) {
  const lines = data.split('\n');
  input = [lines.shift().replace('seeds: ','').split(/\s+/).map(x=>+x)];
  input = lines.reduce((acc, line) => {
    /^\s*$/.test(line)
      ? acc.push([])
      : !/^\w.*:$/.test(line) 
        && acc[acc.length - 1].push(line.split(/\s+/).map(x=>+x))
    return acc;
  }, input);
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