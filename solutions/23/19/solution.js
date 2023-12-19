const {sum} = require('../../../santasLittleHelper.js');
const {multiSet, linify, lineWise} = require('../../../parser.js');
let input, log;

function solve1(inp,l) {
  input = inp, log = l;
  const iMap = input[0]
  return sum(...input[1].filter(([x,m,a,s])=>
    resolve({x,m,a,s},'in')).map(vs=>sum(...vs)));

  function resolve(e,wf) {
    if (wf === 'A') return true;
    if (wf === 'R') return false;
    const nwf = iMap[wf].slice(1)
      .find(([a,b,c])=>b==='>'?e[a]>+c:e[a]<+c)
    return resolve(e,nwf?nwf[3]:iMap[wf][0]);
  }
}

function solve2(inp,l) {
  input = inp, log = l;
  return null;
}

function init(data,log) {
  const sets = multiSet()(data);
  sets[0] = linify(sets[0]).reduce((a,r)=>{
    const l = r.match(/^\w+/);
    a[l] = r.match(/\w[<>]\d+:\w+/g).map(x=>x.match(/<|>|\w+/g));
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