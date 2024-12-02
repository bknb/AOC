const {sum,create2DimArray} = require('../../../santasLittleHelper.js');
const {lineWise,linify} = require('../../../parser.js');
let input, log;

const dirMap=[[1,0],[0,1],[-1,0],[0,-1]];
const letterDir={R:0,D:1,L:2,U:3};

function solve1(inp,l) {
  input = inp, log = l;
  let LR = input.filter(([d])=>d%2===0).map(([d,l])=>l*(~~(d/2)?-1:1));
  let UD = input.filter(([d])=>d%2===1).map(([d,l])=>l*(~~(d/2)?-1:1));
  LR = LR.reduce((a,c,i)=>a.concat([c+(a.length?a[i-1]:0)]),[]);
  UD = UD.reduce((a,c,i)=>a.concat([c+(a.length?a[i-1]:0)]),[]);
  const [minX,maxX] = LR.reduce(([min,max],c)=>
    [Math.min(min,c),Math.max(max,c)],[Number.MAX_VALUE,Number.MIN_VALUE]);
  const [minY,maxY] = UD.reduce(([min,max],c)=>
    [Math.min(min,c),Math.max(max,c)],[Number.MAX_VALUE,Number.MIN_VALUE]);
  let ground = create2DimArray(maxY-minY+1,maxX-minX+1,0);
  let current = [-minX,-minY];
  ground[current[1]][current[0]] = ~~(input[input.length-1][0]/2);
  input.forEach(([d,l],i)=>{
    const [x,y] = current;
    const [nx,ny] = [x+dirMap[d][0]*l,y+dirMap[d][1]*l];
    const [fx,fy] = [Math.min(x,nx),Math.min(y,ny)];
    const [tx,ty] = [Math.max(x,nx),Math.max(y,ny)];
    if(tx===fx)
      for (let i = ty;i-->fy+1;)
        ground[i][tx] = 2;
    else
      for (let i = tx;i-->fx+1;)
        ground[ty][i] = 1;
    if (i !== input.length-1)
      ground[ny][nx] = ~~(d/2);
    const inc = ground[y][x];
    ground[y][x] = d%2 
      ?~~(d/2)?(inc?6:4):(inc?5:3)
      :~~(d/2)?(inc?3:4):(inc?5:6);
    current = [nx,ny];
  });
  ground = ground.map(r=>r.map((c,i)=>
    c===0?(r.slice(i+1).join('')
           .match(/2|61*3|51*4/g)?.length || 0)%2:c))
  return sum(...ground.map(row=>sum(...row.map(x=>!!x))));
}

function solve2(inp,l) {
  return null;
}

function init(data,log) {
  return lineWise().chunkify().map(([a,b,c])=>
    [letterDir[a],+b,c])(linify(data));
}

module.exports = {init, solve1, solve2}