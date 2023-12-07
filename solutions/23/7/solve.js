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

const cards = ['2','3','4','5','6','7','8','9','10','T','J','Q','K','A'];
const cards2 = ['J','2','3','4','5','6','7','8','9','10','T','Q','K','A'];

solveOptions().then(startSolver);
  
function solve1() {
  log(input)
  const inp = log(input.map(([hand,bid])=>[cards.map(
    card=>[card,hand.filter(x=>x===card).length])
      .filter(([,count])=>count>0)
      .map(([card,count])=>[cards.indexOf(card),count])
      .sort(rankCards),bid,hand.map(x=>cards.indexOf(x))]))
    .sort(rank2);
  log(inp.map(([,,a])=>a.map(a=>cards[a]).join('')));
  return inp.reduce((a,[,bid],i)=>log(a+bid*(i+1),bid,i),0);
}

function solve2() {
  const inp = input.map(([hand,bid])=>[cards2.map(
    card=>[card,hand.filter(x=>x===card).length])
      .filter(([,count])=>count>0)
      .map(([card,count])=>[cards2.indexOf(card),count])
      .sort(rankCards),bid,hand.map(x=>cards2.indexOf(x))])
    .map(joker)
    .sort(rank2);
  log(inp.map(([a])=>a.map(([a,b])=>[cards2[a],b])));
  log(inp.map(([,,a])=>a.map(a=>cards2[a]).join('')));
  return inp.reduce((a,[,bid],i)=>log(a+bid*(i+1),bid,i),0);
}

function joker([s,b,a]) {
  log('before',s)
  const index = s.findIndex(([ca])=>ca===0);
  if (index !== -1) {
    const count = s[index][1];
    if (count != 5) {
      s.splice(index,1);
      s[0][1]+=count;
    }
  }
  log('after',s)
  return [s,b,a];
}

function rankCards([ca1,co1],[ca2,co2]) {
  if (co1 < co2) return 1;
  if (co1 > co2) return -1;
  if (ca1 < ca2) return 1;
  return -1;
}
function rank2(a,b) {
  const simple = simpleRank(a[0],b[0]);
  if (simple) return simple;
  for (let i=0;i<a[2].length;i++) 
    if (a[2][i]>b[2][i]) return 1;
    else if (a[2][i]<b[2][i]) return -1;
  return 0;
}

function rank([a],[b]) {
  const simple = simpleRank(a,b);
  if (simple) return simple;
  for (let i=0;i<a.length;i++) 
    if (a[i][0]>b[i][0]) return 1;
    else if (a[i][0]<b[i][0]) return -1;
  return 0;
}

function simpleRank(a,b) {
  log('simpleRank',a,b)
  for (let i=0;i<a.length;i++) 
    if (a[i][1]>b[i][1]) return 1;
    else if (a[i][1]<b[i][1]) return -1;
  return 0;
}

function init(data) {
  input = data.split('\n')
    .map(row=>
      row.match(/\w+/g))
    .map(([a,b])=>
      [a.split(''),+b]);
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
    const prepStart = performance.now();
    init(data);
    console.log(`prepared in ${(performance.now()-prepStart).toFixed(2)}ms\n`.yellow);

    if (options.includes("Part 1")) { 
      console.log('-------'+'\nPart 1:'.main+'\n-------');
      const start = performance.now();
      console.log('Solution: '.red.bold+solve1());
      console.log(`in ${(performance.now()-start).toFixed(2)}ms`.magenta);
      console.log('');
    }
    if (options.includes("Part 2")) { 
      console.log('-------'+'\nPart 2:'.main+'\n-------');
      const start = performance.now();
      console.log('Solution: '.red.bold+solve2());
      console.log(`in ${(performance.now()-start).toFixed(2)}ms`.magenta);
      console.log('');
    }
  }
}

function log(...text) {
  if(debug) console.log(...text);
  return text[0];
}