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

const balls = {
  red: 12,
  green: 13,
  blue: 14,
};

solveOptions().then(startSolver);
  
function solve1() {
  return input.map((game,i)=>gamePossible(game)&&i+1)
    .reduce((c,acc)=>c+acc,0);
}

function solve2() {
  return input.map(getPower).reduce((c,acc)=>c+acc,0);
}

function init(data) {
  input = data.split('\n').map(row=>
    row.split(':')[1].split(';').map(set=>
      set.trim().split(',').map(draw=>
        draw.trim().split(' '))));
}

function getPower(game) {
  const balls = {
    red: 0,
    green: 0,
    blue: 0,
  };
  game.forEach(set=>
    set.forEach(pull=>
      balls[pull[1]]=Math.max(balls[pull[1]],pull[0])));
  return balls.red*balls.green*balls.blue;
}

function gamePossible(game) {
  return game.every(set=>set.every(pull=>balls[pull[1]]>=pull[0]));
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