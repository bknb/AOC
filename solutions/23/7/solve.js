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

const cards = ['2','3','4','5','6','7','8','9','10','T','J','Q','K','A'];
const cards2 = ['J','2','3','4','5','6','7','8','9','10','T','Q','K','A'];

function solve1() {
  return calculateWin(preparedInput(cards).sort(compareHands));
}

function solve2() {
  return calculateWin(preparedInput(cards2).map(jokerfy).sort(compareHands));
}

function jokerfy([counts,...rest]) {
  if (counts.length>1) {
    const index = counts.findIndex(([card])=>card===0);
    if (index !== -1) {
      const count = counts.splice(index,1)[0][1];
      counts[0][1]+=count;
    }
  }
  return [counts,...rest];
}

function preparedInput(values) {
  return input.map(([hand,bid])=>[values.map(
    card=>[card,hand.filter(x=>x===card).length])
      .filter(([,count])=>count>0)
      .map(([card,count])=>[values.indexOf(card),count])
      .sort(([,a],[,b])=>b-a),bid,hand.map(x=>values.indexOf(x))]);
}

function calculateWin(sortedHands) {
  return sortedHands.reduce((accu,[,bid],rank)=>accu+bid*(rank+1),0);
}

function compareHands([counts1,,hand1],[counts2,,hand2]) {
  return typeCompare(counts1,counts2) || compare(hand1,hand2);
}

function typeCompare(counts1,counts2) {
  return compare(...[counts1,counts2].map(x=>x.map(([,y])=>y)));
}

function compare(l1,l2) {
  for (let i=0;i<l1.length;i++) 
    if (l1[i]!==l2[i]) 
      return l1[i]-l2[i];
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
    const prepTime = performance.now()-prepStart;
    console.log(`prepared in ${prepTime.toFixed(2)}ms\n`.yellow);

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