const {...helper} = require('../../../santasLittleHelper.js');
const {multiSet, linify, lineWise} = require('../../../parser.js');
let input, log;

function solve1(inp,l) {
  input = inp, log = l;
  return input.map(count(1000));
}

function count(n) {
  return function inner(set) {
    
    return 0;
  }
}

function solve2(inp,l) {
  input = inp, log = l;
  return null;
}

function init(data,log) {
  return multiSet().mapper(linify)(data)
    .map(lineWise().match(/[%&]|\w+/g)
         .map(([o,...rest])=>/[%&]/.test(o)
           ?[o==='%',...rest]:[null,o,...rest]))
    .map(l=>l.reduce((a,[ff,o,...i])=>{
      a[o] = [ff,...i];
      return a;
    },{}));
}

module.exports = {init, solve1, solve2}