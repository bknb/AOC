const { transpose, inRange } = require('../../../santasLittleHelper.js');

let input, log;
function solve1(inp, l) {
  return solve(inp, l, 2);
}

function solve2(inp, l) {
  return solve(inp, l, 1000000);
}

function solve(inp, l, factor) {
  input = inp, log = l;

  const emptyRows = getEmpty(input)
  const emptyCols = getEmpty(transpose(input));

  const pairs = input.reduce((a, c, y) =>
    a.concat(c.reduce((a, c, x) =>
      c ? a.concat([[x, y]]) : a, [])), [])
    .map((g, i, all) => [g, all.slice(i + 1)]);

  return pairs.map(([g, ns]) => ns.map(n => getDistance(g, n))
    .reduce((a, b) => a + b, 0)).reduce((a, b) => a + b);

  function getDistance([gx, gy], [nx, ny]) {
    const result = Math.abs(gx - nx) + Math.abs(gy - ny)
      + getSpace(emptyRows, gy, ny) + getSpace(emptyCols, gx, nx);
    return result;
  }

  function getSpace(arr, b1, b2) {
    return arr.filter(inRange(b1, b2)).length * (factor - 1)
  }
}

function getEmpty(arr) {
  return arr.reduce((a, c, i) => c.every(e => !e) ? a.concat([i]) : a, []);
}

function init(data, log) {
  return data.split('\n').map(row => row.split('').map(c => c === '#'));
}

module.exports = { init, solve1, solve2 }