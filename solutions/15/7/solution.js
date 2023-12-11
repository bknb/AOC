const {...helper} = require('../../../santasLittleHelper.js');
let input, log;
const wires = {};

function solve1(inp,l) {
  input = inp, log = l;
  return value('a');
}

function solve2(inp,l) {
  input = inp, log = l;
  wires['b'] = value('a');
  return value('a');
}

function value(v) {
  if (wires[v]) return wires[v];
  return log(wires[v] = evaluate(v),v);
}

function evaluate(v) {
  if (!isNaN(v)) return +v;
  const [,s] = input.find(([v1])=>v===v1);
  switch (s && s.length) {
    case 1: 
      return value(s[0]);
    case 2: 
      const not = ~value(s[1]); 
      return not+(not<0?65536:0);
    case 3:
      switch (s[1]) {
          case 'AND': return value(s[0]) & value(s[2]);
          case 'OR': return value(s[0]) | value(s[2]);
          case 'LSHIFT': return value(s[0]) << value(s[2]);
          case 'RSHIFT': return value(s[0]) >> value(s[2]);
      }
  }
}

function init(data,log) {
  return data.split('\n')
    .map(row=>row.match(/\w+/g))
    .map(row=>[row[row.length-1],row.slice(0,-1)]);
}

module.exports = {init, solve1, solve2}