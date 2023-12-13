const { transpose, inRange, d1, sum , findCoordinates} = 
  require('../../../santasLittleHelper.js');
const { grid } = require('../../../parser.js');

let input, log;
function solve1(inp, l) {
  return solve(inp, l, 2);
}

function solve2(inp, l) {
  return solve(inp, l, 1000000);
}

function solve(inp, l, factor) {
  input = inp, log = l;

  const empty = [transpose(input), input].map(getEmpty);

  const pairs = findCoordinates(input)
    .map((g, i, all) => [g, all.slice(i + 1)]);

  return sum(...pairs.map(([g, ns]) => 
    sum(...ns.map(n => getDistance(g, n)))));

  function getDistance(g, n) {
    return d1(g, n) + [0,1].reduce((a,e,i)=>
      a + expandSpace(empty[i], g[i], n[i]), 0);
  }

  function expandSpace(space, b1, b2) {
    return space.filter(inRange(b1, b2)).length * (factor - 1);
  }
}

function getEmpty(arr) {
  return arr.reduce((a, c, i) => c.every(e => !e) ? a.concat([i]) : a, []);
}

function init(data, log) {
  return grid().boolean()(data);
}

module.exports = { init, solve1, solve2 }