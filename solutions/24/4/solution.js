const { rng } = require('../../../santasLittleHelper.js');
const mapping = {X:0,M:1,A:2,S:3};

function solve1(input) {
  return input.map((x,i)=>x.map((y,j)=>count(i,j,input)))
    .reduce((a,c)=>(a+c.reduce((a,c)=>(a+c),0)),0);
}

function count(i,j,input) {
  if (input[i][j]) return 0;
  return rng(0,8).filter(k=>check(i,j,k,input)).length;
}

function check(i,j,dir,input) {
  if (input[i][j] === 3) return true;
  let x = i, y = j;
  switch(dir) {
    case 0: x++; case 1: y--; break;
    case 2: x--; case 3: y++; break;
    case 4: y++; case 5: x++; break;
    case 6: y--; case 7: x--; break;
  }
  if (input[x]?.[y] === undefined) return false;
  return input[x][y] === input[i][j]+1
    && check(x,y,dir,input);
}

function solve2(input) {
  return input.map((x,i)=>x.map((y,j)=>count2(i,j,input)))
    .reduce((a,c)=>(a+c.reduce((a,c)=>(a+c),0)),0);
}

function count2(i,j,input) {
  if (input[i][j]-2) return 0;
  return ~~check2(i,j,input);
}

function check2(i,j,input) {
  if (!(i && i<input.length-1)) return false;
  const edges = [0,1].map(x=>[0,1].map(y=>
    input[i+(x?1:-1)][j+(y?1:-1)])).flat();
  return edges.every(x=>[1,3].includes(x))
    && edges[0] !== edges[3] 
    && (edges[0] === edges[1] 
        ? edges[0] !== edges[2]
        : edges[0] === edges[2]);
}

function init(data) {
  return data.split('\n')
    .map(x=>x.split('')
      .map(x=>mapping[x]));
}

module.exports = {init, solve1, solve2}