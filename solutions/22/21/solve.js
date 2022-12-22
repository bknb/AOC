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
  const m = {};
  log(input)
  input
    .map(([i,t])=>[i,t.replaceAll(/([a-z]{4})/g,'m.$1()')])
    .forEach(([i,t])=>m[i]=()=>eval(t));
  log(m)
  return m.root();
}

function solve2() {
  const o = {};
  input.forEach(([id],i)=>o[id]=i);
  const ast = input.map(([,t])=>
    /\d+/.test(t)?+t:transformTerm(t));
  log(ast);
  const root = o.root;
  const humn = o.humn;
  const [left,right] = ast[root];
  const aim = calc(right);
  const path = humnPath(left,[]);
  return 
    
  (aim,path);

  function next(g,path) {
    const c = ast[path.shift()];
    if(!path.length) return g;
    log(g,path,c);
    const op = c[2];
    if(c[0]===path[0])
      switch(op) {
        case '+': return next(g-calc(c[1]),path);
        case '-': return next(g+calc(c[1]),path);
        case '*': return next(g/calc(c[1]),path);
        case '/': return next(g*calc(c[1]),path);
      }
    else
      switch(op) {
        case '+': return next(g-calc(c[0]),path);
        case '-': return next(calc(c[0])-g,path);
        case '*': return next(g/calc(c[0]),path);
        case '/': return next(calc(c[0])/g,path);
      }
  }
  function humnPath(root,path) {
    if(typeof ast[root] === 'number')
      if(root===humn) return path.concat([humn]);
      else return null;
    const r = ast[root];
    const leftPath = humnPath(r[0],path.concat([root]));
    if(leftPath) return leftPath;
    return humnPath(r[1],path.concat([root]));
  }

  function transformTerm(t) {
    const [,a,op,b] = t.match(/([a-z]{4}) ([\+\-\*/]) ([a-z]{4})/);
    return [o[a],o[b],op];
  }

  function calc(t) {
    const c = ast[t];
    if(typeof c === 'number') return c;
    log(c)
    let [a,b,o] = c;
    a = calc(a);
    b = calc(b);
    switch(o) {
      case '+': return a+b;
      case '-': return a-b;
      case '*': return a*b;
      case '/': return a/b;
    }
  }
}

function init(data) {
  input = data.split('\n')
    .map(x=>x.match(/([a-z]{4}): (.*)/))
    .map(([,i,t])=>[i,t]);
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