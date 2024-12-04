const {...helper} = require('../../../santasLittleHelper.js');
const {lineWise, linify} = require('../../../parser.js');
let input, log;

const mapping = {X:0,M:1,A:2,S:3};

function solve1(inp,l) {
  input = inp, log = l;
  let copy = input.map(x=>[...x]);
  for (let i=input.length; i-->0;)
    for(let j=input[0].length; j-->0;)
      copy[i][j]=count(i,j,input);
  return copy.reduce((a,c)=>(a+c.reduce((a,c)=>(a+c),0)),0);
}

function count(i,j,input) {
  if (input[i][j]) return 0;
  let t = 0;
  for(let k = 8; k-->0;)
    if(check(i,j,k,input)) t++;
  return t;
}

function check(i,j,dir,input) {
  if (input[i][j] === 3) return true;
  let x = i, y = j;
  switch(dir) {
    case 0: x++; break;
    case 1: x++; y++; break;
    case 2: y++; break;
    case 3: x--; y++; break;
    case 4: x--; break;
    case 5: x--; y--; break;
    case 6: y--; break;
    case 7: x++; y--; break;
  }
  if (!input[x] || !input[x][y]) return false;
  return input[x][y] === input[i][j]+1&&check(x,y,dir,input);
}

function solve2(inp,l) {
  input = inp, log = l;
  let copy = input.map(x=>[...x]);
  for (let i=input.length; i-->0;)
    for(let j=input[0].length; j-->0;)
      copy[i][j]=count2(i,j,input);
  log(copy.map(x=>x.join('')).join('\n'));
  return copy.reduce((a,c)=>(a+c.reduce((a,c)=>(a+c),0)),0);
}

function count2(i,j,input) {
  if (input[i][j]-2) return 0;
  return ~~check2(i,j,input);
}

function check2(i,j,input) {
  if (input[i][j] === 3) return true;
  let prevI = i-1, prevJ = j-1;
  let nextI = i+1, nextJ = j+1;
  if (!input[prevI]) return false;
  if (!input[nextI]) return false;
  if (input[0][prevJ] === undefined) return false;
  if (input[0][nextJ] === undefined) return false;
  const edges = [
    input[prevI][prevJ],
    input[prevI][nextJ],
    input[nextI][prevJ],
    input[nextI][nextJ]
  ];
  return edges[0] !== edges[3] 
    && (edges[0] === edges[1] 
        ? edges[0] !== edges[2]
        : edges[0] === edges[2]) 
    && edges.every(x=>[1,3].includes(x));
}

function init(data,log) {
  return data.split('\n').map(x=>x.split('').map(x=>mapping[x]));
}

module.exports = {init, solve1, solve2}