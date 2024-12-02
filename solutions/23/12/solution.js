const { sum, sumOfSums, prd } = require('../../../santasLittleHelper.js');
const { linify, lineWise } = require('../../../parser.js');
let input, log;

function solve1(inp, l) {
  input = inp, log = l;
  return sum(log(input.map(possibilities)));
}

function possibilities([p,n],i) {
  let oldP, oldN;
  log('start',i)
  do {
    if (!n.length) return 1;
    oldP = p;oldN = n;
    p = p.replace(/^\.+/g,'');
    p = p.match(/#+\?#+/g)
      ?.filter(m=>m.length>Math.max(...n))
      .reduce(a=>a.replace(/(#+)\?(#+)/,'$1.$2'),p) || p;
    log(p.match(/\.#+\./g)?.filter(m=>
      n.filter(n=>
        n===m.length-2).length===1))
    log(p,n)
    if (/^\?+$/.test(p)) return calc(p,n);
    let as = getAreas(n,p.length);
    p = addMandatory(p,as);
    log(p,n,'after mandatory')
    if (/^[^\?]*$/.test(p)) return 1;
    let blk = nBlk(p,/^\?+(?=\.)/);
    if (rngL(blk)<n[0]) 
      p = replace(p,blk,'');
    blk = nBlkU(p,/#+/g,n[0]);
    if (blk.length) {
      if (blk[0]===0) {
        p = p.slice(1+n[0]);
        n.shift();
        continue;
      }
      if (p[blk[1]]==='.') {
        p = p.slice(1+n[0]);
        n.shift();
        continue;
      }
      if (rngI(blk,as[0][3]).length) {
        p = replace(p,blk,'');
        if(!(n[0]-=rngL(blk))) {
          p = p.slice(1+blk[0]);
          n.shift();
        }
        continue;
      }
    }
    log(p,n);
    p = reverse(p); n = n.reverse();
    p = p.replace(/^\.+/g,'');
    log(p,n);
    if (/^\?+$/.test(p)) return calc(p,n);
    as = getAreas(n,p.length);
    p = addMandatory(p,as);
    if (/^[^\?]*$/.test(p)) return 1;
    blk = nBlk(p,/^\?+(?=\.)/);
    if (rngL(blk)<n[0]) 
      p = replace(p,blk,'');
    blk = nBlkU(p,/#+/g,n[0]);
    if (blk.length) {
      if (blk[0]===0) {
        p = p.slice(1+n[0]);
        n.shift();
        continue;
      }
      if (p[blk[1]]==='.') {
        p = p.slice(1+n[0]);
        n.shift();
        continue;
      }
      if (rngI(blk,as[0][3]).length) {
        p = replace(p,blk,'');
        if(!(n[0]-=rngL(blk))) {
          p = p.slice(1+blk[0]);
          n.shift();
        }
        continue;
      }
    }
    log(p,n);
    p = reverse(p); n = n.reverse();
  } while(oldP !== p || n.length !== oldN.length);
  const blks = p.match(/[#\?]+/g);
  const mands = blks.filter(b=>/#/.test(b));
  if (blks.every(b=>/^\?+$/.test(b)) && blks.length === n.length) 
    return prd(blks.map((b,j)=>possibilities([b,[n[j]]],i+'.'+j)));
  return -1;
}

function routine(p,n) {
  let blk = nBlk(p,/^\?+(?=\.)/);
  if (rngL(blk)<n[0]) 
    p = replace(p,blk,'');
  blk = nBlkU(p,/#+(?=\?)/g,n[0]);
  if (blk[0]===0) {
    p = p.slice(1+n[0]);
    n.shift();
    return;
  }
  if (rngI(blk,as[0][3]).length) {
    p = replace(p,blk,'');
    if(!(n[0]-=rngL(blk))) {
      p = p.slice(1+blk[0]);
      n.shift();
    }
    return;
  }
  blk = nBlkU(p,/#+(?=\.)/g,n[0]);
  if (blk.length) {
    p = p.slice(1+n[0]);
    n.shift();
    return;
  }
  log(p,n);
}

function reverse(p) {
  return p.split('').reverse().join('');
}

function addMandatory(p,as) {
  p = as.reduce((a,[,,m])=>replace(a,m),p);
  return as.slice(1).reduce((a,[,p],i)=>
    replace(a,rngGap(as[i][1],p),'.'),p);
}

function nBlk(p,regex) {
  const m = p.match(regex);
  return m ? [m.index,m.index+m[0].length] : [];
}

function nBlkU(p,regex,l) {
  return [...p.matchAll(regex)]
    ?.filter(m=>m.index<=l)
    .reduce((a,c)=>
      rngU(a,[c.index,c[0].length+c.index]),[]) || [];
}

function rngL(rng) {
  return rng[1] - rng[0];
}

function solve2(inp, l) {
  input = inp.slice(2,3), log = l;
  return null;
}

function replace(str, rng, val = '#') {
  if(!rng?.length) return str;
  const start = rng[0]!==-1 ? rng[0] : 0;
  let l = rng[1]-start;
  return str.slice(0,start) 
    + val.repeat(l) + str.slice(rng[1]);
}

function getAreas(nums,length) {
  return nums.map(ranges(length))
    .map(([bl,ls,rs])=>[bl,rngU(ls,rs),rngI(ls,rs),ls]);
}

function ranges(length) {
  return (bl,i,nums) => {
    const maxLeftr = minLengthFor(nums.slice(0,i+1));
    const minRightl = length - minLengthFor(nums.slice(i));
    return [bl,[maxLeftr-bl,maxLeftr],[minRightl,minRightl+bl]]
  }
}

function rngU(rng1,rng2) {
  if (!rng1.length || !rng2.length)
    return !rng1.length ? (!rng2.length ? [] : rng2) : rng1;
  const [l1,r1] = rng1, [l2,r2] = rng2;
  return [Math.min(l1,l2),Math.max(r1,r2)];
}

function rngI(rng1,rng2) {
  if (!rng1.length || !rng2.length) return [];
  const [maxL,minR] = rngHelper(rng1,rng2);
  return minR>=maxL?[maxL,minR]:[];
}

function rngGap(rng1,rng2) {
  if (!rng1.length || !rng2.length) return [];
  const [maxL,minR] = rngHelper(rng1,rng2);
  return minR<maxL?[minR,maxL]:[];
}

function rngHelper([l1,r1],[l2,r2]) {
  return [Math.max(l1,l2),Math.min(r1,r2)];
}

function minLengthFor(arr) {
  if (arr.length===0) return 0;
  return sum(...arr) + arr.length - 1;
}

function unfold([pattern,nums]) {
  const unfoldedPattern = Array(5).fill(pattern).join('?');
  const unfolledNums = Array(5).fill(nums).flat();
  return [unfoldedPattern,unfolledNums];
}

function init(data, log) {
  return lineWise().chunkify(/[^ ,]+/g)
    .map(([springs, ...nums]) => 
      [springs,nums.map(d => +d)])(linify(data));
}

function calc(pattern,nums) {
  let length = pattern.length;
  const total = sum(...nums)
  length -= total + nums.length - 2;
  return sumOfSums(length,nums.length);
}

module.exports = { init, solve1, solve2 }