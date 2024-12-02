const { allBut, count } = require('../../../santasLittleHelper.js');
const {linify, lineWise} = require('../../../parser.js');
let input, log;

const isSafe = row => row.slice(1)
    .map((x,i)=>log([row[i]>x,Math.abs(row[i]-x)]))
    .every(([inc,delta],i,[[first]])=>
      inc===first&&delta>0&&delta<4);

function solve1(inp,l) {
  input = inp, log = l;
  return count(input, isSafe);
}

function solve2(inp,l) {
  input = inp, log = l;
  return count(input.map(row=>
    [row,...row.map((x,i,arr)=>allBut(arr,i))]
    .some(isSafe)));
}

function init(data,log) {
  return lineWise().chunkify().numberfy()(linify(data));
}

module.exports = {init, solve1, solve2}