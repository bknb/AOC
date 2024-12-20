const { rng } = require('../../../santasLittleHelper.js');
const mapping = {X:0,M:1,A:2,S:3};

function solve1(input) {
  return sumGrid(mapGrid(input, count1));
}

function solve2(input) {
  return sumGrid(mapGrid(input, count2));
}

function count1(i,j,input) {
  if (input[i][j]) return 0;
  return rng(0,8).filter(k=>
    check1(i,j,k,input)).length;
}

function check1(i,j,dir,input) {
  if (input[i][j] === 3) return true;
  const [x,y] = getNext([i,j],dir);
  if (!input[x]?.[y]) return false;
  return input[x][y] === input[i][j]+1
    && check1(x,y,dir,input);
}

function getNext(c,dir) {
  switch(dir) {
    case 0: c[0]--; case 1: c[1]++; break;
    case 2: c[1]++; case 3: c[0]++; break;
    case 4: c[0]++; case 5: c[1]--; break;
    case 6: c[1]--; case 7: c[0]--; break;
  }
  return c;
}

function count2(i,j,input) {
  if (input[i][j]-2) return 0;
  return ~~check2(i,j,input);
}

function check2(i,j,input) {
  if (!(i && i<input.length-1)) return false;
  const edges = getEdges(i,j,input);
  return edges.every(x=>!isNaN(x)&&x%2)
    && edges[0] !== edges[3] 
    && (edges[0] === edges[1] 
        ? edges[0] !== edges[2]
        : edges[0] === edges[2]);
}

function getEdges(i,j,input) {
  return [0,1].map(x=>[0,1].map(y=>
    input[i+(x?1:-1)][j+(y?1:-1)])).flat();
}

function mapGrid(input, func) {
  return input.map((x,i)=>
    x.map((y,j)=>
      func(i,j,input)));
}

function sumGrid(grid) {
  return grid.reduce((a,c)=>
    (a+c.reduce((a,c)=>
      (a+c),0)),0);
}

function init(data) {
  return data.split('\n')
    .map(x=>x.split('')
      .map(x=>mapping[x]));
}

module.exports = {init, solve1, solve2}