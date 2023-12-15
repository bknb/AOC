const {sum} = require('../../../santasLittleHelper.js');
const {...parser} = require('../../../parser.js');
let input, log;

function solve1(inp,l) {
  input = inp, log = l;
  return sum(...input.map(hashCode));
}

function hashCode(seq) {
  let current = 0;
  for (let c of seq) {
    current += c.charCodeAt(0);
    current *= 17;
    current = current % 256;
  }
  return current;
}

function solve2(inp,l) {
  input = inp, log = l;
  const boxes = Array(256).fill([]).map(x=>[]);
  const ins = input.map(seq=>[...seq.match(/\w+/g),/=/.test(seq)]);
  ins.forEach(([name,fl,eq])=> {
    const box = boxes[hashCode(name)];
    const index = box.findIndex(([n])=>n===name);
    if (!eq) index!==-1&&box.splice(index,1);
    else if (index===-1) box.push([name,fl]);
    else box[index][1] = fl;
  });
  return focusingPower(boxes);
}

function focusingPower(boxes) {
  return sum(...boxes.map((ls,i)=>
    ls.length&&sum(...ls.map(([lbl,fl],j)=>(i+1)*(j+1)*fl))));
}

function init(data,log) {
  return data.replace('\n','').split(',');
}

module.exports = {init, solve1, solve2}