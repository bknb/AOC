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
let S, E;
let miniMap, pos;
const dir = [['^','v'],['<','>']];

solveOptions().then(startSolver);
  
function solve1() {
  return solve((path,next)=>[...path,next]);
}

function solve2() {
  return solve((path,next,h)=>h?[...path,next]:[next]);
}

function solve(nextPath) {
    log(`Start: ${S}, End: ${E}`);
  minMap = Array.from(Array(input.length))
    .map(()=>Array.from(Array(input[0].length)).fill(Number.MAX_VALUE));
  pos = [[[...S,heu(S[0],S[1],input[S[0]][S[1]]),'S',0],[]]];
  let min;
  let steps = 0;
  while(pos.length) {
    steps++;
    //log(pos.slice(0,3).map(([n,p])=>n[2]+n[3]+p.length),min && min.length);
    const [next,path] = pos.shift();
    const [x,y,s,d,h] = next;
    if (path.length && h!==path[path.length-1][4])
      log(`(${x}|${y})`.green+s+d+h+':'+path.length);
    if (s) {
      let e = input[x][y];
      let n = nextPath(path,next,h);
      for(let i=4;i-->0;) {
        const m = i>>1?1:-1;
        const [nx,ny] = i%2?[x,y+m]:[x+m,y];
        if (nx>=0 && nx<input.length
          && ny>=0 && ny<input[nx].length
          && input[nx][ny]-e<=1
          && minMap[nx][ny]>n.length
          && !(min && path.length+heu(nx,ny) >= min.length))
          insert(nx,ny,dir[i%2][i>>1],n);
      }
    }
    else min = path;
  }
  log(`Steps: ${steps}`)
  return min?.length;
}

function insert(x,y,s,n) {
  const e = [[x,y,heu(x,y,n.length-1),s,input[x][y]],n];
  let low=0;
  let high=pos.length;
  while (low < high) {
    const mid = (low + high) >>> 1;
    if (pos[mid][0][2] < e[0][2]) low = mid + 1;
    else high = mid;
  }
  minMap[x][y]=n.length;
  pos.splice(low,0,e);
}

function heu(x,y) {
  return Math.max(Math.abs(input[E[0]][E[1]]-input[x][y]),
                  Math.abs(E[0]-x)+Math.abs(E[1]-y));
}

function prepareInput(data) {
  return data.split('\n')
    .map((x,i)=>x.split('')
      .map((y,j)=>{
        if (y === 'S') {
          S = [i,j];
          return 0;
        }
        if (y === 'E') {
          E = [i,j];
          return 26;
        }
        return y.charCodeAt(0)-97;
      }));
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
    input = prepareInput(data);
  
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