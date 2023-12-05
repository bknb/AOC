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
  return input.map(([win,set])=>
    Math.floor(
      Math.pow(2,set.filter(x=>
        win.includes(x)).length-1)))
    .reduce((a,b)=>a+b,0);
}

function solve2() {gemoje
  const decks = new Array(input.length).fill(1);
  input.map(([win,set])=>
    set.filter(x=>win.includes(x)).length)
      .forEach((score,i)=> {
        for (let j=score;j-->0;) {
          decks[i+j+1]+=decks[i];
        }
      });
  return decks.reduce((a,b)=>a+b,0);
}

function init(data) {
  input = data.split('\n')
    .map(row=>
      row.replace(/Card \d+: /,'')
      .split('|')
      .map(set=>set.trim()
        .split(/\s+/)
        .map(x=>+x)));
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
    init(data);
  
    if (options.includes("Part 1")) { 
      console.log('-------'+'\nPart 1:'.main+'\n-------');
      console.log('Solution:'.red.bold+solve1());
      console.log('');
    }
    if (options.includes("Part 2")) { 
      console.log('-------'+'\nPart 2:'.main+'\n-------');
      console.log('Solution:'.red.bold+solve2());
      console.log('');
    }
  }
}

function log(...text) {
  if(debug) console.log(...text);
  return text[0];
}