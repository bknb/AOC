const {sum} = require('../../../santasLittleHelper.js');
const {lineWise,linify} = require('../../../parser.js');
let input, log;

const letterDir={R:0,D:1,L:2,U:3};

function solve1(inp,l) {
  input = inp, log = l;
  let y = 0;
  const values = input.map(([d,l])=>
      [d%2?0:l*(d>>1?1:-1),d%2?d>>1?y-=l:y+=l:y]);
  const p = sum(...input.map(([,l])=>l))>>1;
  return values.filter(([dx])=>dx)
    .reduce((a,[dx,y])=>a+y*dx,0)+p+1;
}

function solve2(inp,l) {
  input = inp, log = l;
  input = input.map(([,,c])=>
    [+c.slice(-1)[0],parseInt(c.slice(0,-1),16)])
  return solve1(input,l);
}

function init(data,log) {
  return lineWise().match().map(([a,b,c])=>
    [letterDir[a],+b,c])(linify(data));
}

module.exports = {init, solve1, solve2}