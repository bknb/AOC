const colors = require('colors');
const fs = require('fs');
const {solveOptions} = require('../../../questions.js');
const {...helper} = require('../../../santasLittleHelper.js');

colors.setTheme({
  test: ['italic','bold'],
  main: ['bold','blue'],
  high1: ['green'],
  high2: ['red']
});

let debug, test, input;

solveOptions().then(startSolver);
  
function solve1() {
  let map = [];
  const empty = helper.create2DimArray(4,4,false);
  const row = empty.map((r,i)=>r.map(()=>i===3));
  const cross = empty.map((r,i)=>r.map((c,j)=>(i>0&&j===1)||(i===2&&j<3)));
  const mirL = empty.map((r,i)=>r.map((c,j)=>(i>0&&j===2)||(i===3&&j<3)));
  const line = empty.map(r=>r.map((c,j)=>j===0));
  const block = empty.map((r,i)=>r.map((c,j)=>i>1&&j<2));
  const shapes = [row,cross,mirL,line,block];

  shapes.forEach(x=>log(helper.frameIt(helper.printMap(x))));

  for(let i=0;i<2;i++)
    letRockFall(shapes[i%5]);
  log(helper.frameIt(helper.printMap(map)))
  return map.length-map.findIndex(r=>r.some(c=>c));

  function letRockFall(s) {
    const highest = !map.length?map.findIndex(r=>r.some(c=>c)):0;
    map = helper.create2DimArray(7-highest,7,false).concat(map);
    rockStep(3,2);
    
    function rockStep(x,y) {
      log(helper.frameIt(
        helper.printMap(
          map.slice(x,x+4)),x+','+y+'->'+shapes.findIndex(x=>x===s)))
      let ny = input[0]+y;
      input.push(input.shift());
      const blocked = ny<0 || s.some(r=>r.some((c,j)=>
        c && ((j+ny)>=map[x].length || map[x][ny+j+1])));
      ny = blocked?y:ny;
      if(x===map.length-1||s[3].some((c,y)=>c&&map[x+1][y]))
        return map = map
          .map((r,i)=>(i<(x-3)||i>x)?r:
            r.map((c,j)=>j>=ny&&j<ny+4&&s[i-(x-3)][j-ny]));
      rockStep(x+1,ny);
    }
  }
}

function solve2() {
  return null;
}

function init(data) {
  input = data.split('').map(x=>x==='>'?1:-1);
}

function startSolver({options}) {
  console.log('');
  test = options.includes('Test');
  if (test) {
    console.log("~~TestRun~~".test);
  }
  const path = require('path')
    .resolve(__dirname, (test ? 'test' : 'input') + '.txt');
  fs.readFile(path, 'utf8', handleInput(options));
}

function handleInput(options) {
  return (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    debug = options.includes("Debug");
    init(data);
  
    if (options.includes("Part 1")) { 
      console.log('-------'+'\nPart 1:'.main+'\n-------');
      console.log('Solution:'.red.bold+solve1());
      console.log('');
    }
    if (options.includes("Part 2")) { 
      console.log('-------'+'\nPart 2:'.main+'\n-------');
      console.log('Solution:'.red.bold+solve2());
      console.log('');
    }
  }
}

function log(...text) {
  if(debug) console.log(...text);
  return text[0];
}