const {...helper} = require('../../../santasLittleHelper.js');
const {linify,lineWise} = require('../../../parser.js');
let input, log;

function solve1(inp,l) {
  input = inp, log = l;
  let bs = [...input].map(b=>[...b].sort(([,,z1],[,,z2])=>z1-z2))
    .sort(([[,,z1]],[[,,z2]])=>z1-z2);
  bs.forEach(()=>bs=bs.map(fall));
  return log(bs).filter(disolvable).length;
}

function fall(b,i,bs) {
  return getLoweset(
    b, bs.slice(0,i)
    .filter(([,[,,z]])=>z<b[0][2])
    .sort(([,[,,z1]],[,[,,z2]])=>z1-z2));

  function getLoweset(b,lbs) {
    const newB = (z)=>
      [[b[0][0],b[0][1],z],[b[1][0],b[1][1],b[1][2]-b[0][2]+z]]
    for (let i=lbs.length;i-->0;)
      if (overlap(b,lbs[i]))
        return newB(lbs[i][1][2]+1);
    return newB(1);
  }
}

function disolvable(e,i,arr) {
  return arr.slice(i+1)
    .filter(([[,,z]])=>z===e[1][2]+1)
    .filter(o=>overlap(e,o))
    .filter(o=>arr.filter(([,[,,z]])=>z===o[0][2]-1)
      .filter(d=>overlap(o,d)).length<2)
    .length === 0;
}

function willFall(e,arr) {
  const bwf = arr
    .filter(([[,,z]])=>z===e[1][2]+1)
    .filter(o=>overlap(e,o))
    .filter(o=>arr.filter(([,[,,z]])=>z===o[0][2]-1)
      .filter(d=>overlap(o,d)).length<2);
  if (!bwf.length) return bwf;
  const set = new Set(bwf.map(b=>b.map(es=>es.join()).join('|')));
  bwf.forEach(b=>
    willFall(b,arr).forEach(wf=>set.add(log(wf))));
  return Array.from(set);
}

function overlap([[x11,y11],[x12,y12]],[[x21,y21],[x22,y22]]) {
  return intersects(x11,x12,x21,x22) && intersects(y11,y12,y21,y22);
}

function intersects(r11,r12,r21,r22) {
  [r11,r12] = [r11,r12].sort((a,b)=>a-b);
  [r21,r22] = [r21,r22].sort((a,b)=>a-b);
  [[r11,r12],[r21,r22]] = 
    [[r11,r12],[r21,r22]].sort(([a],[b])=>a-b);
  return r12 >= r21;
}

function solve2(inp,l) {
  input = inp, log = l;
  let bs = [...input].map(b=>[...b].sort(([,,z1],[,,z2])=>z1-z2))
    .sort(([[,,z1]],[[,,z2]])=>z1-z2);
  bs.forEach(()=>bs=bs.map(fall));

  bs.filter(([,,z])=>z===1).map([])
  
  return log(bs.map((b,i)=>willFall(b,bs.slice(i+1)))).reduce((a,c)=>a+c.length,0);
}

function decoTouching()

function init(data,log) {
  return lineWise().chunkify()
    .map(([a,b,c,d,e,f])=>[[+a,+b,+c],[+d,+e,+f]])(linify(data));
}

module.exports = {init, solve1, solve2}