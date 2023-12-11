const {...helper} = require('../../../santasLittleHelper.js');
let input, log;

function solve1(inp,l) {
  input = inp, log = l;
  const reduced = input.map(row=>
    [row,row.slice(1,-1)
     .replaceAll(/\\[^x]|\\x[0-9a-f]{2}/g,'1')]);
  log(reduced);
  return reduced.reduce((a,[b,c])=>a+(b.length-c.length),0);
}

function solve2(inp,l) {
  input = inp, log = l;
  const reduced = input.map(row=>
    [row,`33${row.replaceAll(/\\[^x]/g,'2222').replaceAll(/\\x[0-9a-f]{2}/g,'11111')}33`]);
  log(reduced,reduced.map(a=>a.map(b=>b.length)));
  return reduced.reduce((a,[b,c])=>a+(c.length-b.length),0);
}

function init(data,log) {
  return data.split('\n');
}

module.exports = {init, solve1, solve2}