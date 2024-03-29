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
  const map = new Map(), total = 1000000000;
  let current;
  for (current = 0;current<total;current++) {
    input = fullCycle(input);
    if (map.has(printMap(input,0))) break;
    map.set(printMap(input,0),current);
  }
  const firstIndex = map.get(printMap(input,0));
  const indexInCycle = (total-current-1)%(current-firstIndex);
  for (let [gridString, index] of map.entries()) {
    if (index === firstIndex+indexInCycle)
      return getScore(g(gridString));
  }
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

function fullCycle(input) {
  for(let j = 0; j<4; j++) 
    input = fall(input,j);
  return input;
}

function init(data,log) {
  return g(data);
}

module.exports = {init, solve1, solve2}