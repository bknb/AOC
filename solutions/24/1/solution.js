const { insert, sum } = require('../../../santasLittleHelper.js');
const { linify } = require('../../../parser.js');
let input, log;

function solve1(inp, l) {
  input = inp, log = l;
  const [left, right] = inp;
  return sum(left.map((x, i) => Math.abs(right[i] - x)));
}

function solve2(inp, l) {
  input = inp, log = l;
  const [left, right] = inp;
  const results = [];
  return sum(left.map(v =>
    v * (results[v] ||
         (results[v] = right.filter(x => x === v).length))));
}

function init(data, log) {
  const left = [], right = [];
  linify(data)
    .map(line => line.split(/\s+/))
    .forEach(([a, b]) => {
      insert(left, +a);
      insert(right, +b);
    });
  return [left, right];
}

module.exports = { init, solve1, solve2 }