const {...helper} = require('../../../santasLittleHelper.js');
const {multiSet, linify, lineWise} = require('../../../parser.js');
let input, log;

function solve1(inp,l) {
  input = inp, log = l;
  return input.map(count(1000));
}

function count(n) {
  return function inner(set)  {
    let bc;
    const ffs = {}, cos = {};
    for (let [key,value] of Object.entries(set))
      if (value[0] === null) bc = value.slice(1);
      else value[0] ? ffs[key] = value.slice(1)
        : cos[key] = value.slice(1);
    const status = {...ffs};
    for (let key of Object.keys(status))
      status[key] = false;

    let cl = 0,ch = 0, cycle = 0;

    do {
      cl++;cycle++;
      const q = bc.map(key => [key,false]);
      while (q.length) {
        const [k,v] = q.shift();
        if (ffs[k] && !v) q.push(...ffs[k].map(key => [key,true]));
        if (cos[k]) {
          if (v.length===1)
            q.push([key,!v[0]]);
          else
        }
      }
    } while (status.values().some(on=>on))
    
    return cycle*cl*ch;
  }
}

function solve2(inp,l) {
  input = inp, log = l;
  return input.map(count(10**14));
}

function init(data,log) {
  return multiSet().mapper(linify)(data)
    .map(lineWise().match(/[%&]|\w+/g)
         .map(([o,...rest])=>/[%&]/.test(o)
           ?[o==='%',...rest]:[null,o,...rest]))
    .map(l=>l.reduce((a,[ff,o,...i])=>{
      a[o] = [ff,...i];
      return a;
    },{}));
}

module.exports = {init, solve1, solve2}