const {create2DimArray, printMap, frameIt, sum} = require('../../../santasLittleHelper.js');
const {grid} = require('../../../parser.js');
let input, log;

const dirMap=[[1,0],[0,1],[-1,0],[0,-1]];
const partDict = {
  '-': [[0],[0,2],[2],[0,2]],
  '|': [[1,3],[1],[1,3],[3]],
  '/': [[3],[2],[1],[0]],
  '\\': [[1],[0],[3],[2]],
  '.': [[0],[1],[2],[3]]
}
const dirDict = ['>','v','<','^'];

function solve1(inp,l) {
  input = inp, log = l
  return beam(0,0,0);
}

function solve2(inp,l) {
  input = inp, log = l;
  const startGroup = Array(input.length)
    .fill().map((_,i)=>[0,i,0]);
  console.log(input[0].length);
  startGroup.push(...Array(input[0].length)
                   .fill().map((_,i)=>[i,0,1]));
  //startGroup.push(...Array(input.length)
                 //  .fill().map((_,i)=>[input.length-1,i,2]));
  //startGroup.push(...Array(input[0].length)
                 //  .fill().map((_,i)=>[i,input[0].length-1,3]));
  return Math.max(...log(startGroup.map(s=>beam(...s))));
}

function beam(x,y,d) {
  const ins = partDict[input[y][x]][d].map(nd=>[x,y,nd]);
  const energyMap = create2DimArray(input[0].length,input.length,false);
  let current;
  while(log(current = ins.shift())) {
    const [x,y,dir] = current;
    log(frameIt(printMap(energyMap,x=>x.length?dirDict[x[0]]:' ')),ins);
    if (energyMap[y][x]) 
      if(energyMap[y][x].includes(dir)) continue;
      else energyMap[y][x].push(dir);
    else energyMap[y][x]=[dir];

    let [deltaX,deltaY] = dirMap[dir];
    let [newX,newY] = [x+deltaX,y+deltaY];
    if (!(newX<0 || newX>=input[0].length 
          || newY<0 || newY>=input.length)) {
      partDict[input[newY][newX]][dir]
        .forEach((newDir)=>ins.push([newX,newY,newDir]));
    }
  }
  return sum(...energyMap.map(x=>sum(...x.map(y=>!!y))));
}

function init(data,log) {
  return grid()(data);
}

module.exports = {init, solve1, solve2}