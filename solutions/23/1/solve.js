const colors = require('colors');
const fs = require('fs');
const { solveOptions } = require('../../../questions.js');
const { ...helper } = require('../../../santasLittleHelper.js');

colors.setTheme({
  test: ['italic', 'bold'],
  main: ['bold', 'blue'],
  high1: ['green'],
  high2: ['red']
});

let debug, test, input;

const map = ['\\d',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine'];

solveOptions().then(startSolver);

function solve1() {
  return combineNumbersAndAddThemUp(input.map(value => value.match(/\d/g)));
}

function solve2() {
  const regex = new RegExp('(?=(' + map.join('|') + '))', 'g');
  const allNumbers = input
    .map(value => Array.from(value.matchAll(regex)).map(x => x[1]))
    .map(list => list.map(value => map.includes(value) ? map.indexOf(value) + '' : value));
  log(allNumbers);
  return combineNumbersAndAddThemUp(allNumbers);
}

function combineNumbersAndAddThemUp(listOfNumberPairs) {
  return listOfNumberPairs
    .map(value => parseInt(value[0] + value[value.length - 1]))
    .reduce((c, r) => c + r, 0);
}

function init(data) {
  input = data.split('\n');
}

function startSolver({ options }) {
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
      console.log('-------' + '\nPart 1:'.main + '\n-------');
      console.log('Solution:'.red.bold + solve1());
      console.log('');
    }
    if (options.includes("Part 2")) {
      console.log('-------' + '\nPart 2:'.main + '\n-------');
      console.log('Solution:'.red.bold + solve2());
      console.log('');
    }
  }
}

function log(...text) {
  if (debug) console.log(...text);
  return text[0];
}