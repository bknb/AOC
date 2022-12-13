const colors = require('colors');
const fs = require('fs');
const {solveOptions} = require('../../../questions.js');

colors.setTheme({
  test: ['italic','bold'],
  main: ['bold','blue'],
  high1: ['green'],
  high2: ['red']
});

let debug, test, input;
const cs=['v','>'];

solveOptions().then(startSolver);
  
function solve1() {
  let moved = true, total = 0;
  let ni, nj;
  log(`Initial state:`.blue);
  print();
  while(moved && total < 1) {
    moved = false;
    let map = input.map(r=>[...r]);
    for(let k=2;k-->0;) {
      for(let i=0;i<input.length;i++)
        for(let j=0;j<input[i].length;j++) {
          if (input[i][j] === k) {
            if(k) nj = (j+1)%input[i].length;
            else ni = (i+1)%input.length;
            ni ??= i;nj ??= j;
            if (input[ni][nj]===-1) {
              log(i,j,'>',ni,nj,':',cs[k]);
              map[i][j] = -1;
              map[ni][nj] = k;
              moved = true;
            }
          }
        }
      input = map.map(r=>[...r]);
    }
    total += moved;
    if (total<=5 || total%10===0 || total>=55) {
      log(`\nAfter ${total} steps:`.blue);
      print();
    }
  }
  return total;
}

function solve2() {
  return null;
}

function print() {
  input.forEach(r=>log(r.map(c=>c===-1?'.':cs[c]).join('')));
}

function prepareData(data) {
  return data.split('\n')
    .map(r=>r.split('')
      .map(c=>cs.findIndex(x=>x===c)));
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
    input = prepareData(data);
  
    if (options.includes("Part 1")) { 
      console.log('-------'+'\nPart 1:'.main+'\n-------');
      console.log(solve1());
      console.log('');
    }
    if (options.includes("Part 2")) { 
      console.log('-------'+'\nPart 2:'.main+'\n-------');
      console.log(solve2());
      console.log('');
    }
  }
}

function log(...text) {
  if(debug) console.log(...text);
}