function solve1(input) {
  return input.map(x=>x.match(/\d+/g))
    .filter(x=>x)
    .reduce((c,[a,b])=>c+a*b,0);
}

function solve2(input) {
  return input
    .map(x=>x.match(/\d+/g)||/o\(/.test(x))
    .reduce(([r,t],x)=>
      typeof x === 'boolean' ? [r,x] :
      [t?r+x[0]*x[1]:r,t], [0,true])[0];
}

function init(data) {
  return data.match(/mul\(\d+,\d+\)|do(n't)?\(\)/g);
}

module.exports = {init, solve1, solve2};