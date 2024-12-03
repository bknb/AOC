const {...helper} = require('../../../santasLittleHelper.js');
const {lineWise} = require('../../../parser.js');
let input, log;

function solve1(inp,l) {
  input = inp, log = l;
  return input.match(/mul\(\d+,\d+\)/g)
    .map(x=>x.match(/\d+/g).map(y=>+y))
    .reduce((c,[a,b])=>c+a*b,0);
}

function solve2(inp,l) {
  input = inp, log = l;
  const inst = log(input.match(/mul\(\d+,\d+\)|do(n't)?\(\)/g)
      .map(x=>x.startsWith('d')?/o\(/.test(x):x.match(/\d+/g)));
  let take = true;
  let result = 0;
  for (let i = 0; i < inst.length; i++) {
    if (typeof inst[i] === 'boolean') take = inst[i];
    else if (take) result+=+inst[i][0]*+inst[i][1];
  }
  return result;
}

function init(data,log) {
  return data;
}

module.exports = {init, solve1, solve2}