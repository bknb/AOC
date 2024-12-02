const {linify, lineWise} = require('../../../parser.js');
let input, log;

const isSafe = row => row.slice(1)
    .map((x,i)=>log([row[i]>x,Math.abs(row[i]-x)]))
    .every(([inc,delta],i,[[first]])=>
      inc===first&&delta>0&&delta<4);

function solve1(inp,l) {
  input = inp, log = l;
  return input.filter(isSafe).length;
}

function solve2(inp,l) {
  input = inp, log = l;
  return input.map(row=>
    [row,...row.map((x,i,arr)=>
      arr.filter((y,j)=>j!==i))]
    .some(isSafe))
    .filter(x=>x).length;
}

function init(data,log) {
  return lineWise().match().numberfy()(linify(data));
}

module.exports = {init, solve1, solve2}