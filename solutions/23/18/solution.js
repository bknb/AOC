const {sum} = require('../../../santasLittleHelper.js');
const {lineWise,linify} = require('../../../parser.js');

const letterDir={R:0,D:1,L:2,U:3};

function solve1(input) {
  let y = 0;
  const values = input.map(([dir,len])=>
      [dir%2?0:len*(dir>>1?1:-1),
       dir%2?dir>>1?y-=len:y+=len:y])
    .filter(([dx])=>dx);
  const peri = sum(input.map(([,len])=>len))>>1;
  return sum(values.map(([dx,y])=>y*dx))+peri+1;
}

function solve2(input) {
  return solve1(input.map(([,,c])=>
    [+c.slice(-1)[0],parseInt(c.slice(0,-1),16)]));
}

function init(data) {
  return lineWise().chunkify().map(([a,b,c])=>
    [letterDir[a],+b,c])(linify(data));
}

module.exports = {init, solve1, solve2}