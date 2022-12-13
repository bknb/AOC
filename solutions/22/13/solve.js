const colors = require('colors');
const fs = require('fs');
const {solveOptions} = require('../../../questions.js');

colors.setTheme({
  test: ['italic','bold'],
  main: ['bold','blue'],
  high1: ['green'],
  high2: ['red']
});

let debug, test, input;

solveOptions().then(startSolver);
  
function solve1() {
  const res = input.map(([l,r])=>rightOrder(l,r));
  log(res);
  return res.reduce((a,c,i)=>c<1?a+i+1:a,0);
}

function solve2() {
  const d1 = [[2]];
  const d2 = [[6]];
  const res = input.reduce((a,c)=>a.concat(c),[])
    .concat([d1,d2]);
  log(res);
  res.sort(rightOrder);
  let div1 = res.findIndex(x=>x===d1)+1;
  let div2 = res.findIndex(x=>x===d2)+1;
  log(res);
  return div1 * div2;
}

function prepareData(data) {
  return data.split('\n\n')
    .map(p=>p.split('\n').map(r=>JSON.parse(r)));
}
  
function rightOrder(l,r) {
  const lType = typeof l, rType = typeof r;
  switch(lType) {
    case 'undefined': return -2;
    case 'number':
      log('Compare',l,r);
      switch(rType) {
        case 'undefined': return 2;
        case 'number': return l===r?0:l>r?3:-3;
        default: return rightOrder([l],r);   
      }
    default:
      switch(rType) {
        case 'undefined': return 5;
        case 'number': return rightOrder(l,[r])
        default:
          if (l.length === 0 && r.length === 0)
            return 0;
          let res = rightOrder(l[0],r[0]);
          if(res !== 0) return res<<1;
          else return rightOrder(l.slice(1),r.slice(1));
      }
  }
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
    input = prepareData(data);
  
    if (options.includes("Part 1")) { 
      console.log('-------'+'\nPart 1:'.main+'\n-------');
      console.log(solve1());
      console.log('');
    }
    if (options.includes("Part 2")) { 
      console.log('-------'+'\nPart 2:'.main+'\n-------');
      console.log(solve2());
      console.log('');
    }
  }
}

function log(...text) {
  if(debug) console.log(...text);
}