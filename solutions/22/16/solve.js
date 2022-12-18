const colors = require('colors');
const fs = require('fs');
const {solveOptions} = require('../../../questions.js');
const {rng,...helper} = require('../../../santasLittleHelper.js');

colors.setTheme({
  test: ['italic','bold'],
  main: ['bold','blue'],
  high1: ['green'],
  high2: ['red']
});

let debug, test, input;

solveOptions().then(startSolver);
  
function solve1() {
  log(input)
  input = input.map(([r,ids],i)=>
      [r,input.map((p,j)=>i===j?0:ids.includes(j)?1:Infinity)]);
  const rates = input.map(([r,])=>r);
  const ds = input.map(([,d])=>d);

  createDistances();

  log(helper.frameIt(
    helper.printMap(
      ds,rng(0,10)
      .concat(
        rng(65,75).map(x=>String.fromCharCode(x).red))),
    'distances'));

  return findMax(0,30,[],ds.map(()=>true));

  function findMax(s,r,c,vs) {
    //log(s,r,c);
    if(r<=0) return c;
    let scores = ds[s]
      .map((d,i)=>[i,vs[i]*rates[i]*(r-(d+1)),d+1])
      .filter(([,s])=>s>0)
      //.sort(([,a],[,b])=>b-a);

    let max = scores.map(([i,s,d])=>
      findMax(i,r-d,c.concat([s,i,d]),vs.map((v,j)=>i===j?false:v)))
      .reduce((a,x)=>
        x.reduce((b,[y])=>b+y,0)>a.reduce((b,[y])=>b+y,0)
        ?x:a,c.concat([[0]]));
    return max;
  }

  function createDistances() {
     for(let r=ds.length-1;r-->0;)
       for(let i=0;i<ds.length-1;i++)
         for(let j=i+1;j<ds.length;j++)
           if(ds[i][j]===Infinity)
             ds[j][i]=ds[i][j]=Math.min(
               ...[...Array(input.length-1).keys()]
               .filter(x=>x!==j
                 && ds[i][x]!==Infinity
                 && ds[x][j]!==Infinity)
               .map(x=>ds[i][x]+ds[x][j]));
  }
}

function solve2() {
  return null;
}

function init(data) {
  const parseRegex = /Valve (\w{2}).*rate=(\d+).*valves? ((\w{2}(, )?)*)/;
  input = data.split('\n')
    .map(r=>r.match(parseRegex))
    .map(([,v,r,vs])=>
      [v,+r,vs.split(', ')]);
  input = input.map(([,r,ids])=>
    [r,ids.map(id=>input.findIndex(p=>p[0]===id))]);
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