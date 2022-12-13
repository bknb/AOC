const colors = require('colors');
const fs = require('fs');
const { solveOptions } = require('../../../questions.js');

colors.setTheme({
  test: ['italic', 'bold'],
  main: ['bold', 'blue'],
  high1: ['green'],
  high2: ['red']
});

const NU = 'number', MT = 'undefined';

let debug, test, input;

solveOptions().then(startSolver);

function solve1() {
  const res = input.map(([l, r]) => rightOrder(l, r));
  log(res);
  return res.reduce((a, c, i) => c < 1 ? a + i + 1 : a, 0);
}

function solve2() {
  const d = [[[2]], [[6]]];
  const res = input.reduce((a, c) => a.concat(c), [])
    .concat(d)
    .sort(rightOrder);
  log(res);
  return d.map(x => res.findIndex(y => x === y) + 1)
    .reduce((a, c) => a * c);
}

function prepareData(data) {
  return data.split('\n\n')
    .map(p => p.split('\n').map(r => JSON.parse(r)));
}

function rightOrder(l, r) {
  switch (typeof l) {
    case MT: return -2;
    case NU:
      switch (typeof r) {
        case MT: return 2;
        case NU: return l === r ? 0 : l > r ? 3 : -3;
        default: return rightOrder([l], r);
      }
    default:
      switch (typeof r) {
        case MT: return 5;
        case NU: return rightOrder(l, [r]);
        default:
          if (!l.length && !r.length) return 0;
          let res = rightOrder(l[0], r[0]);
          if (res !== 0) return res << 1;
          else return rightOrder(l.slice(1), r.slice(1));
      }
  }
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
    input = prepareData(data);

    if (options.includes("Part 1")) {
      console.log('-------' + '\nPart 1:'.main + '\n-------');
      console.log(solve1());
      console.log('');
    }
    if (options.includes("Part 2")) {
      console.log('-------' + '\nPart 2:'.main + '\n-------');
      console.log(solve2());
      console.log('');
    }
  }
}

function log(...text) {
  if (debug) console.log(...text);
}