const {sum} = require('../../../santasLittleHelper.js');
const {grid, multiSet} = require('../../../parser.js');
const { transpose } = require('mathjs');
let input, log;

function solve1(inp,l) {
  input = inp, log = l;

  return sumRefl(getAllMirrors());
}

function solve2(inp,l) {
  input = inp, log = l;
  
  const mirrors = [];
  for (let i=input.length;i-->0;) {
    let mirror = getSmudgedMirror(input[i]);
    let horizontal = false;
    if (!mirror.length) {
      mirror = getSmudgedMirror(transpose(input[i]));
      horizontal = true;
    }
    mirrors.push([mirror[0],horizontal]);
  }

  return sumRefl(mirrors);
}

function getAllMirrors() {
  const mirrors = [];
  for (let i=input.length;i-->0;) {
    let mirror = getMirror(input[i]);
    let horizontal = false;
    if (!mirror.length) {
      mirror = getMirror(transpose(input[i]));
      horizontal = true;
    }
    mirrors.push([mirror[0],horizontal]);
  }

  return mirrors;
}

function mirrors(arr) {
  const mirrors = [];
  for(let i=arr.length;i-->1;)
    if(isMirror(arr.slice(0,i).join(''), arr.slice(i).reverse().join('')))
      mirrors.push(i);
  return mirrors;
}

function getSmudgedMirror(grid) {
  const allMirrors = [...Array(grid[0].length)].fill(0);

  grid.map(mirrors).forEach(ms =>ms.forEach(i=>allMirrors[i]++));
  return allMirrors.map((x,i)=>[x,i])
    .filter(([x])=>x===grid.length-1)
    .map(([,i])=>i);
}

function getMirror(grid) {
  return grid.map(mirrors).reduce((a,c)=>a.filter(x=>c.includes(x)));
}

function isMirror(a,b) {
  const min = Math.min(a.length, b.length);
  const shortA = a.slice(-min);
  const shortB = b.slice(-min);
  return shortA === shortB;
}

function sumRefl(refl) {
  log(refl);
  return sum(...refl.map(([n,h])=>n*(h?100:1)));
}

function init(data,log) {
  return multiSet().mapper(grid())(data);//.slice(1,2);
}

module.exports = {init, solve1, solve2}