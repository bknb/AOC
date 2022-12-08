const colors = require('colors');
const fs = require('fs');
const {solveOptions} = require('../../../questions.js');

colors.setTheme({
  test: ['italic','bold'],
  main: ['bold','blue'],
  high1: ['green'],
  high2: ['red']
});

let debug, test;

let visible = [];

solveOptions().then(startSolver);
  
function solve1(input) {
  init(input);
  for(let i=0;i<input.length;i++)
    for(let j=0;j<input[i].length;j++)
      visible[i][j] = getVisible(input,i,j)
      
  printTree(input);

  return visible.map(x=>x.filter(y=>y).length)
    .reduce((a,c)=>a+c,0);
}

function solve2(input) {
  visible = input.map((r,x)=>
      r.map((c,y)=>
        sceneScore(input,x,y)));
  
  printScore(input);
  
  return Math.max(...visible.map(x=>Math.max(...x)));
}

function sceneScore(tree,x,y) {
  return [[tree[x],y],[tree.map(r=>r[y]),x]]
    .map(l=>[l[0].slice(0,l[1]).reverse(),l[0].slice(l[1]+1)])
    .reduce((a,c)=>a.concat(c),[])
    .map(firstTree)
    .reduce((a,c)=>a*c,1);

  function firstTree(items) {
    //log(x,y,items.join(''));
    const result = items
      .findIndex(e=>e>=tree[x][y]);
    return result === -1 ? items.length : result+1;
  }
}

function getVisible(tree,x,y) {
  let count = 0;
  up();
  down();
  right();
  left();
  return count;

  function up() {
    for(let i=x;i-->0;)
      if(tree[x][y]<=tree[i][y])
        return;
    count++;
  }
  function down() {
    for(let i=x+1;i<tree.length;i++)
      if(tree[x][y]<=tree[i][y])
        return;
    count++;
  }
  function left() {
    for(let i=y;i-->0;)
      if(tree[x][y]<=tree[x][i])
        return;
    count++;
  }
  function right() {
    for(let i=y+1;i<tree[0].length;i++)
      if(tree[x][y]<=tree[x][i])
        return;
    count++;
  }
}

function printScore(tree) {
  for(let i=0;i<tree.length;i++) {
    let row = '';
    for(let j=0;j<tree[i].length;j++)
      row += visible[i][j] < 2 
        ? tree[i][j].green
        : (visible[i][j] < 4 
           ? tree[i][j].blue
           : (visible[i][j] < 16  
              ? tree[i][j].yellow
              : (visible[i][j] < 64 
                ? tree[i][j].red
                 : tree[i][j])));
    log(row);
  }
}

function printTree(tree) {
  for(let i=0;i<tree.length;i++) {
    let row = '';
    for(let j=0;j<tree[i].length;j++)
      row += visible[i][j] === 1 
        ? tree[i][j].green
        : (visible[i][j] === 2 
           ? tree[i][j].blue
           : (visible[i][j] === 3  
              ? tree[i][j].yellow
              : (visible[i][j] === 4 
                 ? tree[i][j].red
                 : tree[i][j])));
    log(row);
  }
}

function prepareInput(data) {
  return data.split('\n').map(x=>x.split(''));
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
    const input = prepareInput(data);
  
    if (options.includes("Part 1")) { 
      console.log('-------'+'\nPart 1:'.main+'\n-------');
      console.log(solve1(input));
      console.log('');
    }
    if (options.includes("Part 2")) { 
      console.log('-------'+'\nPart 2:'.main+'\n-------');
      console.log(solve2(input));
      console.log('');
    }
  }
}

function log(...text) {
  if(debug) console.log(...text);
}