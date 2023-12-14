const {sum, getRows, getCols, getGrid, printMap} = 
  require('../../../santasLittleHelper.js');
const {grid} = require('../../../parser.js');
let input, log, g = grid();
const regex = [
  [/([O#]|^)(\.+)(O+)/g, '$1$3$2'],
  [/(O+)(\.+)([O#]|$)/g, '$2$1$3'],
];

function solve1(inp,l) {
  input = inp, log = l;
  return getScore(fall(input,0));
}

function solve2(inp,l) {
  input = inp, log = l;
  const map = new Map(), cycles = 1000000000;
  let i;
  for (i = 0;i<cycles;i++) {
    input = fullCycle(input);
    if (map.has(printMap(input,0))) break;
    map.set(printMap(input,0),i);
  }
  const f = map.get(printMap(input,0));
  const s = (cycles-i-1)%(i-f);
  for (let [key, value] of map.entries()) {
    if (value === f+s)
      return getScore(g(key));
  }
}

function fullCycle(input) {
  for(let j = 0; j<4; j++) 
    input = fall(input,j);
  return input;
}

function fall(grid, direction) {
  const isCols = direction % 2 === 0;
  const reg = regex[~~(direction/2)];
  let lines = isCols?getCols(grid):getRows(grid);
  lines = lines.map(x=>{
    while(x!==(x=x.replace(reg[0],reg[1])));
    return x;
  });
  return getGrid(lines,isCols);
}

function getScore(grid) {
  return sum(...[...grid].reverse().map((row,i)=>
    sum(...row.map(x=>x==='O'?i+1:0))));
}

function init(data,log) {
  return g(data);
}

module.exports = {init, solve1, solve2}