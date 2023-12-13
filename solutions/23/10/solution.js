const { grid } = require('../../../parser.js');
let input, log, start;

const tiles = {
  '.': [],
  '|': [[0, -1], [0, 1]],
  '-': [[-1, 0], [1, 0]],
  'L': [[0, -1], [1, 0]],
  'J': [[-1, 0], [0, -1]],
  '7': [[-1, 0], [0, 1]],
  'F': [[1, 0], [0, 1]],
  'S': [[0, -1], [0, 1], [-1, 0], [1, 0]],
}

function solve1(inp, l) {
  input = inp, log = l;

  return Math.floor(getLoop().length / 2);
}

function solve2(inp, l) {
  input = inp, log = l;

  const loop = getLoop();

  return input
    .map((row, y) =>
      row.map((c, x) => getUpperLoopParts(x, y))
      .filter(c => c && isInLoop(c)).length)
    .reduce((a, b) => a + b, 0);

  function getUpperLoopParts(x, y) {
    return !loop.some(([lx, ly]) => lx === x && ly === y)
      && loop.filter(([lx, ly]) => lx === x && ly < y)
      .map(([lx, ly]) => input[ly][lx])
  }

  function isInLoop(loopParts) {
    const lr = loopParts.reduce((a, t) =>
        addArray(a, t.reduce(([l, r], [x]) =>
          [x < 0 ? l + 1 : l, x > 0 ? r + 1 : r], [0, 0])), [0, 0]);
    return Math.min(...lr) % 2 === 1;
  }

  function addArray(a, b) {
    return a.map((x, i) => x + b[i]);
  }
}

function getLoop() {
  start = start || findStart();
  const loop = [start];
  let prev = [start, start], tiles = getFirst2Tiles(start);

  while ([0, 1].some(i => tiles[0][i] != tiles[1][i])) {
    loop.push(...tiles);
    let next = tiles.map((e, i) => getNext(prev[i], ...e));
    prev = tiles, tiles = next;
  }
  loop.push(tiles[0]);

  return loop;

  function findStart() {
    for (let y = input.length; y-->0;)
      for (let x = input[y].length; x-->0;)
        if (input[y][x].length === 4)
          return [x, y];
  }

  function getFirst2Tiles(s) {
    const neighbors = getNeighbors(s)
      .filter(t => t.every(x => x >= 0)
        && getNeighbors(t).some(n =>
          n.every((x, i) => x === s[i])));

    input[s[1]][s[0]] = neighbors.map(n => n.map((x,i)=>x - s[i]));

    return neighbors;
  }

  function getNext([px, py], x, y) {
    return getNeighbors([x, y])
      .filter(([nx, ny]) => nx != px || ny != py)[0];
  }

  function getNeighbors([x, y]) {
    return input[y][x].map(([dx, dy]) => [x + dx, y + dy]);
  }
}

function init(data) {
  return grid().complex(tiles)(data);
}

module.exports = { init, solve1, solve2 }