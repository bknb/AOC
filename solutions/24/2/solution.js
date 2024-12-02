const {...helper} = require('../../../santasLittleHelper.js');
const {linify} = require('../../../parser.js');
let input, log;

const isSafe = row => row.slice(1)
    .map((x,i)=>log([row[i]>x?'i':(row[i]<x?'d':'e'),Math.abs(row[i]-x)]))
    .map(([inc,delta])=>log([inc,delta>0&&delta<4]))
    .every(([inc,inRange],i,arr)=>inc===arr[0][0]&&inRange);

function solve1(inp,l) {
  input = inp, log = l;
  return input.filter(isSafe).length;
}

function solve2(inp,l) {
  input = inp, log = l;
  return input.map(row=>
    [row,...row.map((x,i,arr)=>
      arr.filter((x,j)=>j!==i))]
    .some(isSafe))
    .filter(x=>x).length;
}

function init(data,log) {
  return linify(data).map(line=>line.split(' ').map(x=>+x));
}

module.exports = {init, solve1, solve2}