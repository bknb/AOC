const { allBut, count, rng } = require('../../../santasLittleHelper.js');
const {linify, lineWise} = require('../../../parser.js');


const isSafe = row => row.slice(1)
    .map((x,i)=>[row[i]>x,Math.abs(row[i]-x)])
    .every(([inc,delta],i,[[first]])=>
      inc===first&&delta>0&&delta<4);

const isSafe2 = row => {
  const diffs = row.slice(1).map((x,i)=>row[i]-x);
  return diffs.every(x=>rng(1,4).includes(x))
    || diffs.every(x=>rng(1,4).includes(-x)); 
}

const enrichSubs = row =>
    [row,...row.map((x,i,arr)=>allBut(arr,i))]

function solve1(input) {
  return count(input, isSafe2);
}

function solve2(input) {
  return count(input.map(row =>
    enrichSubs(row).some(isSafe2)));
}

function init(data) {
  return lineWise().chunkify().numberfy()(linify(data));
}

module.exports = {init, solve1, solve2}