const {sum, rangeSum,prd} = require('../../../santasLittleHelper.js');
const {multiSet, linify, lineWise} = require('../../../parser.js');
let input, log;

function solve1(inp,l) {
  input = inp, log = l;
  const iMap = input[0];
  return sum(input[1].map(([x,m,a,s])=>
    resolve({x,m,a,s},'in')));

  function resolve(e,wf) {
    if (wf === 'A') return sum(Object.values(e));
    if (wf === 'R') return 0;
    const nwf = iMap[wf].slice(1)
      .find(([a,b,c])=>b==='>'?e[a]>+c:e[a]<+c)
    return resolve(e,nwf?nwf[3]:iMap[wf][0]);
  }
}

function solve2(inp,l) {
  input = inp, log = l;
  const iMap = input[0];
  const rng = [1,4000];
  const all = {x:[...rng],m:[...rng],a:[...rng],s:[...rng]}
  return resolve(all,'in');

  function resolve(e,wf) {
    log(e,wf)
    if (wf === 'A') return prd(log(Object.values(e).map(([l,h])=>h-l+1),e));
    if (wf === 'R') return 0;

    let rest, d, total = 0;
    for (let i=1;i<iMap[wf].length;i++) {
      [rest,e,d] = split(e,...iMap[wf][i]);
      total += resolve(rest,d);
    }
    
    return total + resolve(e,iMap[wf][0]);
  }

  function split(e,a,b,v,d) {
    const splitted = {...e}, rest = {...e};
    splitted[a] = rngIntersect(e[a],b==='<'?[0,+v-1]:[+v+1,4000]);
    rest[a] = rngIntersect(e[a],b==='<'?[+v,4000]:[0,+v]);
    return [splitted,rest,d];
  }
}

function rngIntersect(rng1,rng2) {
  if (!rng1.length || !rng2.length) return [];
  const [maxL,minR] = rngHelper(rng1,rng2);
  return minR>=maxL?[maxL,minR]:[];
}

function rngHelper([l1,r1],[l2,r2]) {
  return [Math.max(l1,l2),Math.min(r1,r2)];
}

function init(data,log) {
  const sets = multiSet()(data);
  sets[0] = linify(sets[0]).reduce((a,r)=>{
    const l = r.match(/^\w+/);
    a[l] = r.match(/\w[<>]\d+:\w+/g)?.map(x=>x.match(/<|>|\w+/g)) || [];
    a[l].unshift(r.match(/\w+(?=})/)[0]);
    return a;
  },{});
  sets[1] = lineWise().match(/\d+/g).numberfy()(linify(sets[1]));
  return sets;
}

function chunk(array, chunk_size){
  if(array.length == 0) return [];
  else return [array.splice(0, chunk_size)].concat(chunk(array, chunk_size))
}

module.exports = {init, solve1, solve2}