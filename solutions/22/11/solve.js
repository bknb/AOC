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
let normalizer = 1;

solveOptions().then(startSolver);
  
function solve1(input) {
  let counts = Array.from(Array(input.length)).map(()=>0);
  for(let i=20;i-->0;) {
    input.forEach(({items},j)=>log(`Monkey ${j}: ${items}`));
    log('inspect');
    input.forEach(({items,stress,next},j)=>{
      log(`Monkey ${j}: ${items}`)
      while(items.length) {
        let item = stress(items.pop())/3;
        counts[j]++;
        input[next(item)].items.push(item);
      }
    })
    log(("---"+i+" rounds to go---").blue)
  }
  log(counts);
  return counts.sort((a,b)=>a-b).slice(-2).reduce((a,c)=>a*c,1);
}

function solve2(input) {
  let counts = Array.from(Array(input.length)).fill(0);
  const allItems = [];
  input.forEach(monkey=>monkey.items=monkey.items.map(i=>allItems.push(i)-1));
  input.map(monkey=>monkey.lvls=allItems.map(lvl=>lvl%monkey.div));
  for(let i=1;i<=10000;i++) {
    input.forEach(({items,stress,next,lvls},j)=>{
      while(items.length) {
        const index = items.pop();
        input.forEach(({lvls,div})=>lvls[index]=stress(lvls[index]) % div)
        counts[j]++;
        input[next(lvls[index])].items.push(index);
      }
    });
    if (i===1 || i === 20 || i%1000 === 0) {
      log(`---Round ${i}---`.blue);
      input.forEach((a,j)=>log(`Monkey ${j}: ${counts[j]}`));
    }
  }
  return counts.sort((a,b)=>a-b).slice(-2).reduce((a,c)=>a*c,1);
}

function prepareInput(data) {
  return data.split('\n\n')
    .map(x=>x.split('\n').slice(1))
    .map(x=>{
      const div = x[2].match(/\d+/)[0];
      return {
        div,
        items: x[0].match(/\d+/g).map(y=>+y),
        stress: old=>eval(x[1].match(/new = (.*)$/)[1]),
        next: lvl=>lvl%div===0? +x[3].match(/\d+/)[0] : +x[4].match(/\d+/)[0]
      }
    });
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