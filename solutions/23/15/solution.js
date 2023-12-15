const {sum} = require('../../../santasLittleHelper.js');
const {...parser} = require('../../../parser.js');
let input, log;

function solve1(inp,l) {
  input = inp, log = l;
  return sum(...input.map(hash));
}

function hash(seq) {
  let current = 0;
  for (let c of seq) {
    current += c.charCodeAt(0);
    current *= 17;
    current = current % 256;
  }
  return current;
}

function solve2(inp,l) {
  input = inp, log = l;
  return null;
}

function init(data,log) {
  return data.replace('\n','').split(',');
}

module.exports = {init, solve1, solve2}