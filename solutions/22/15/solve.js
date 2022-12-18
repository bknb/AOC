const colors = require('colors');
const fs = require('fs');
const {solveOptions} = require('../../../questions.js');
const helper = require('../../../santasLittleHelper.js');

colors.setTheme({
  test: ['italic','bold'],
  main: ['bold','blue'],
  high1: ['green'],
  high2: ['red']
});

let debug, test, input;

solveOptions().then(startSolver);
  
function solve1() {
  let b = helper
    .getBounds(input.map(([s,b,d])=>[s,b,[s[0]+d,s[1]+d],[s[0]-d,s[1]-d]])
               .reduce((a,c)=>a.concat(c)));
  let impossible = 0;
  for(let i=b[0][1];i<=b[1][1];i++)
    if(checkImpossible(test?10:2000000,i))
      impossible++;

  function checkImpossible(x,y) {
    return input.some(([s,b,d])=>(b[0]!==x||b[1]!==y)&&d>=helper.d1([x,y],s));
  }
  return impossible;
}

function solve2() {
  let edges = input.reduce((a,[s1,[x1,y1],d1],i)=>
    a.concat(input.slice(i+1).map(([s2,[x2,y2],d2],j)=>
      [i,s1,i+j+1,s2,d1,d2,d1+d2>=helper.d1(s1,s2)])),[])
    .filter(([,,,,,,t])=>t);
    //.sort(([,,,a],[,,,b])=>b-a);

  log(edges);
  return null;
}

function newSolve2() {
  let size = test?20:4000000;
  let map = helper.create2DimArray(size+1,size+1,false);
  input.sort(([,,a],[,,b])=>b-a);
  steps=0;
  
  for(let j=(size>>1)+1;j-->0;)
    for(let k=size-j+1;k-->j;)
      for(let i=2;i-->0;) 
        for(let l=2;l-->0;) 
          if (i&1 && k>j && k<size-j) {
            let x = [i&1?k:j,i&1?j:k];
            if(l&1) x[i&1] = size-j;
            if(!checkImpossible(x))
              return frequence(x);
          }

  function checkImpossible([x,y]) {
    if(map[x][y]) return true;
    return input.some(([s,,d])=>{
      if(d>=helper.d1([x,y],s))
        return disableAndLog(x,y,d,s);
      return false;
    });
  }

  function disableAndLog(x,y,d,s) {
    helper.fillWithinBounds(map,helper.getBounds(
      [[x,y],[(s[0]<<1)-x,(s[1]<<1)-y]], [[0,0],[size,size]]));

    if(debug)
      log(helper.frameIt(
        helper.printMap(map),
        `${++steps}:(${[x,y]})${d}(${s})`));

    return true;
  }

  function frequence([x,y]) {
    return y*size+x;
  }
  return -1;
}

function oldSolve1() {
  let b = helper
    .getBounds(input.map(([s,b,d])=>[s,b,[s[0]+d,s[1]+d],[s[0]-d,s[1]-d]])
               .reduce((a,c)=>a.concat(c)));
  let map = helper.create2DimArray(b[1][0]-b[0][0]+1,b[1][1]-b[0][1]+1,0);
  
  input.forEach(([[x,y],,d],a)=>{
    for(let i=0;i<=d;i++)
      for(let j=y-(d-i);j<=y+(d-i);j++)
        if(helper.inBounds([x+i,j],b))
          map[x+i-b[0][0]][j-b[0][1]] = 1;
    for(let i=0;i>=-d;i--)
      for(let j=y-(d+i);j<=y+(d+i);j++)
        if(helper.inBounds([x+i,j],b))
          map[x+i-b[0][0]][j-b[0][1]] = 1;
  });
  
  input.forEach(([s,e])=>{
    map[s[0]-b[0][0]][s[1]-b[0][1]] = 2;
    map[e[0]-b[0][0]][e[1]-b[0][1]] = 3;
  });
  log(helper.frameIt(helper.printMap(map,[' ','#','S','B'])));
  return map[(test?10:2000000)-b[0][0]].filter(x=>x===1).length;
}

function oldSolve2() {
  let b = helper
    .getBounds(input.map(([s,b,d])=>[s,b,[s[0]+d,s[1]+d],[s[0]-d,s[1]-d]])
               .reduce((a,c)=>a.concat(c)));
  let map = helper.create2DimArray(b[1][0]-b[0][0]+1,b[1][1]-b[0][1]+1,0);
  
  input.forEach(([[x,y],,d],a)=>{
    for(let i=0;i<=d;i++)
      for(let j=y-(d-i);j<=y+(d-i);j++)
        if(helper.inBounds([x+i,j],b))
          map[x+i-b[0][0]][j-b[0][1]] = 1;
    for(let i=0;i>=-d;i--)
      for(let j=y-(d+i);j<=y+(d+i);j++)
        if(helper.inBounds([x+i,j],b))
          map[x+i-b[0][0]][j-b[0][1]] = 1;
  });
  
  input.forEach(([s,e])=>{
    map[s[0]-b[0][0]][s[1]-b[0][1]] = 2;
    map[e[0]-b[0][0]][e[1]-b[0][1]] = 3;
  });
  log(helper.frameIt(
    helper.printMap(
      map,[' ','#','S','B'],[[0-b[0][0],0-b[0][1]],[20-b[0][0],20-b[0][1]]])));
  return map[(test?10:2000000)-b[0][0]].filter(x=>x===1).length;
}

function init(data) {
  input = data.split('\n')
    .map(r=>[...r.matchAll(/x=(-?\d+), y=(-?\d+)/g)]
      .map(([,x,y])=>[+y,+x]))
    .map(([s,b])=>[s,b,helper.d1(s,b)]);
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