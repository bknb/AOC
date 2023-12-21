const {...helper} = require('../../../santasLittleHelper.js');
const {multiSet, linify, lineWise} = require('../../../parser.js');
let input, log;

function solve1(inp,l) {
  input = inp, log = l;
  return input.map(count(1000));
}

function count(n) {
  return function inner(set)  {
    log('START'.bold)
    let bc;
    const ffs = {}, cos = {};
    for (let [key,value] of Object.entries(set))
      if (value[0] === null) bc = value.slice(1);
      else value[0] ? ffs[key] = value.slice(1)
        : cos[key] = value.slice(1);
    const ffss = {};
    for (let key of Object.keys(ffs))
      ffss[key] = false;
    const coss = {};
    for (let key of Object.keys(cos)) {
      coss[key] = {};
      for (let [fk,fv] of Object.entries(ffs))
        if (fv.includes(key))
          coss[key][fk] = false;
    }

    let c = [0,0], cycle = 0;
    const cc = [];

    let isC = false;
    do {
      cycle++;c[0]++;
      const q = bc.map(key => [key,false,null]);
      while (q.length) {
        const [k,v,pk] = q.shift();
        c[~~v]++;
        // log(pk,v?'-high->':'-low->',k);
        if (ffs[k]) {
          if (!v) {
            ffss[k] = !ffss[k];
            q.push(...ffs[k].map(key => [key,ffss[k],k]));
          }
          continue;
        }
        if (cos[k]) {
          coss[k][pk] = v;
          q.push(...cos[k].map(key =>
            [key,!Object.values(coss[k]).every(on=>on),k]));
        }
      }
      cc.push([...c]);
    } while (isC = Object.values(ffss).some(on=>on) && cycle < n);
    log(c,cc);
    if (isC) {
      const r = n%cycle;
      return (~~(n/cycle))**2*c.reduce((a,c)=>a*c)+(cc[r][1]*cc[r][0]);
    }
    return c.reduce((a,c)=>a*c);
  }
}

function solve2(inp,l) {
  input = inp, log = l;
  let bc;
  let set = input[0];
  const ffs = {}, cos = {};
  for (let [key,value] of Object.entries(set))
    if (value[0] === null) bc = value.slice(1);
    else value[0] ? ffs[key] = value.slice(1)
      : cos[key] = value.slice(1);
    const ffss = {};
    for (let key of Object.keys(ffs))
      ffss[key] = false;
    const coss = {};
    for (let key of Object.keys(cos)) {
      coss[key] = {};
      for (let [fk,fv] of Object.entries(ffs))
        if (fv.includes(key))
          coss[key][fk] = false;
  }

  let cycle = 0;

  do {
    cycle++;
    const q = bc.map(key => [key,false,null]);
    while (q.length) {
      const [k,v,pk] = q.shift();
      // log(pk,v?'-high->':'-low->',k);
      log(Object.values(coss).map(b=>
        Object.values(b).map(b=>b?1:0).join('')).join(','));
      if (k==='rx' && !v) break;
      if (ffs[k] && !v)
        if (!v) {
          ffss[k] = !ffss[k];
          q.push(...ffs[k].map(key => [key,ffss[k],k]));
        }
      if (cos[k]) {
        coss[k][pk] = v;
        q.push(...cos[k].map(key =>
          [key,!Object.values(coss[k]).every(on=>on),k]));
      }
    }
  } while (true);
  return cycle;
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