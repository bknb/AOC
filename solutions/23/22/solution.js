const {...helper} = require('../../../santasLittleHelper.js');
const {linify,lineWise} = require('../../../parser.js');
let input, log;

function solve1(inp,l) {
  input = inp, log = l;
  input = input.map(c=>c.sort(([,,z1],[,,z2])=>z1-z2))
    .sort(([[,,z1]],[[,,z2]])=>z1-z2);

  for (let i = 0; i < input.length; i++) {
    input[i] = fall(input[i],input.slice(0,i));
    input.sort(([[,,z1]],[[,,z2]])=>z1-z2)
  }

  log(input)
  
  return input.filter(disolvable).length;
}

function disolvable(e,i,arr) {
  const allOther = arr.slice(0,i).concat(arr.slice(i+1));
  return arr.slice(i+1)
    .filter(([[,,z]])=>z===e[1][2]+1)
    .filter(o=>overlap(e,o))
    .filter(o=>fall(o,allOther)[0][2]!==o[0][2])
    .length === 0;
}

function fall (e,arr) {
  const lower = arr
    .filter(([,[,,z2]])=>z2<e[0][2])
    .sort(([,,z1],[,,z2])=>z2-z1);
  const [[x1,y1,z1],[x2,y2,z2]] = e;
  for (let j=lower.length;j-->0;)
    if (overlap(lower[j],e))
      return [[x1,y1,lower[j][1][2]+1],
        [x2,y2,lower[j][1][2]+z2-z1+1]];
  return [[x1,y1,1],[x2,y2,1]];
}

function overlap([[x11,y11],[x12,y12]],[[x21,y21],[x22,y22]]) {
  // log([[x11,x12],[x21,x22],intersects(x11,x12,x21,x22)],
  //     [[y11,y12],[y21,y22],intersects(y11,y12,y21,y22)])
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
  return null;
}

function init(data,log) {
  return lineWise().match()
    .map(([a,b,c,d,e,f])=>[[+a,+b,+c],[+d,+e,+f]])(linify(data));
}

module.exports = {init, solve1, solve2}