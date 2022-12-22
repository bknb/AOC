const colors = require('colors');
const fs = require('fs');
const { solveOptions } = require('../../../questions.js');
const { frameIt, printMap, ...helper } = require('../../../santasLittleHelper.js');

colors.setTheme({
  test: ['italic', 'bold'],
  main: ['bold', 'blue'],
  high1: ['green'],
  high2: ['red']
});


let map = [];
const empty = helper.create2DimArray(4, 4, false);
const row = empty.map((r, i) =>
  r.map(() => i === 3));
const cross = empty.map((r, i) => 
  r.map((c, j) => (i > 0 && j === 1) || (i === 2 && j < 3)));
const mirL = empty.map((r, i) =>
  r.map((c, j) => (i > 0 && j === 2) || (i === 3 && j < 3)));
const line = empty.map(r =>
  r.map((c, j) => j === 0));
const block = empty.map((r, i) =>
  r.map((c, j) => i > 1 && j < 2));
const shapes = { row, cross, mirL, line, block };

let debug, test, input;

solveOptions().then(startSolver);

function solve1() {
  //Object.values(shapes).forEach(x=>log(frameIt(printMap(x))));
  const l = 2020, k = 2022;
  let t = 0;
  map = [];

  for (let i = 0; i < k; i++)
    letRockFall(Object.values(shapes)[i % 5], i);
  return map.length - map.findIndex(r => r.some(c => c));

  function letRockFall(s, i) {
    if (i >= l && i < k)
      log(i + 1 + ': new ' + Object.keys(shapes)[i % 5]);
    const highest = map.length ? map.findIndex(r => r.some(c => c)) : 0;
    map = helper.create2DimArray(7 - highest, 7, false).concat(map);
    rockStep(3, 2);

    function rockStep(x, y) {
      const m = input[t++%input.length];
      let ny = m + y;
      const blocked = ny < 0 || s.some((r, i) => r.some((c, j) =>
        c && (j + ny >= map[x].length || map[x - 3 + i][ny + j])));
      if (i >= l && i < k)
        log(`${m === 1 ? '>' : '<'}${x},${y}${blocked ? '!' : ''}`,
            map[x][ny + 3], x, ny);
      ny = blocked ? y : ny;
      if (x === map.length - 1 ||
        s.some((r, i) => r.some((c, j) => c && map[x - 2 + i][j + ny])))
        return putShapeInMap(x, ny, s);
      rockStep(x + 1, ny);
    }

    function putShapeInMap(x, y, s) {
      map.splice(
        x - 3, 4, ...map.slice(x - 3, x + 1)
          .map((r, i) => r.map((c, j) => j < y ? c : c || s[i][j - y])));

      if (i >= l && i < k)
        log(frameIt(printMap(map.slice(0, x + 5)), `#${x},${y}`));
    }
  }
}

function solve2() {
  //Object.values(shapes).forEach(x=>log(frameIt(printMap(x))));
  const l = 2020, k = 2022;
  const b = [0, 0];
  let t = 0;
  map = [];

  for (let i = 0; i < k; i++)
    letRockFall(Object.values(shapes)[i % 5], i);
  log(b, map.length);
  return Math.min(...b) + map.length - map.findIndex(r => r.some(c => c));

  function letRockFall(s, i) {
    if (i >= l && i < k)
      log(i + 1 + ': new ' + Object.keys(shapes)[i % 5]);
    const highest = map.length ? map.findIndex(r => r.some(c => c)) : 0;
    map = helper.create2DimArray(7 - highest, 7, false).concat(map);
    rockStep(3, 2);

    function rockStep(x, y) {
      const m = input[t++%input.length];
      let ny = m + y;
      const blocked = ny < 0 || s.some((r, i) => r.some((c, j) =>
        c && (j + ny >= map[x].length || map[x - 3 + i][ny + j])));
      if (i >= l && i < k)
        log(`${m === 1 ? '>' : '<'}${x},${y}${blocked ? '!' : ''}`,
            map[x][ny + 3], x, ny);
      ny = blocked ? y : ny;
      if (x === map.length - 1 ||
        s.some((r, i) => r.some((c, j) => c && map[x - 2 + i][j + ny])))
        return putShapeInMap(x, ny, s);
      rockStep(x + 1, ny);
    }

    function putShapeInMap(x, y, s) {
      map.splice(
        x - 3, 4, ...map.slice(x - 3, x + 1)
          .map((r, i) => r.map((c, j) => j < y ? c : c || s[i][j - y])));

      const yr = y + Math.max(...s
        .map(r => r.filter(x => x).length));
      if (y === 0 || yr === 7) {
        let low = Math.min(...b);
        if (y === 0)
          b[0] = low + map.length - x;
        if (yr === 7)
          b[1] = low + map.length - x;
        let newLow = Math.min(...b);
        if (low != newLow)
          map = map.slice(0, low - newLow);
      }
      if (i >= l && i < k)
        log(frameIt(printMap(map.slice(0, x + 5)), `#${x},${y}:${yr}`));
    }
  }
}

function init(data) {
  input = data.split('').map(x => x === '>' ? 1 : -1);
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