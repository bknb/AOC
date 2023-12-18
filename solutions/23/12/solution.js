const { sum, sumOfSums } = require('../../../santasLittleHelper.js');
const { linify, lineWise } = require('../../../parser.js');
let input, log;

function solve1(inp, l) {
  input = inp, log = l;
  return sum(...log(input.map(possibilities)));
}

function possibilities([p,n]) {
  let oldP = '', areas = [[]];
  do {
    oldP = p;
    if (!p.length) return 1;
    p = p.replace(/^\.+|\.+$/g,'');
    if (/^\?+$/.test(p)) return calc(p,n);
    areas = getAreas(n,p.length);
    p = updatePattern(p,areas);
    if(!getRanges(p,/\?+/g).length) return 1;
  } while(oldP !== p);
  return [p,areas.map(([a])=>a)];
}

function cleanArea(pattern,as) {
  const blkRngs = getRanges(pattern,/#+/g);
  pattern = clean(pattern,true);
  return clean(pattern);
  function clean(p,switched) {
    const blkRng = blkRngs[switched?blkRngs.length-1:0];
    const a = as[switched?as.length-1:0];
    const lri = switched?4:3;
    log(blkRng,a,p);
    if (rangeLength(blkRng) == a[0]
        && rngIntersect(blkRng, a[lri]).length) {
      as.splice(switched?-1:0,1);
      return replaceArea(p,borderedRange(blkRng),'.');
    }
    return p;
  }
}

function updatePattern(p,as) {
  p = as.reduce((a,[,,m])=>replaceArea(a,m),p);
  return as.slice(1).reduce((a,[,p],i)=>
    replaceArea(a,rngGap(as[i][1],p),'.'),p);
}

function rangeLength(rng) {
  return rng[1] - rng[0];
}

function borderedRange(rng) {
  return [rng[0]-1, rng[1]+1];
}

function getRanges(p,regex) {
  return Array.from(p.matchAll(regex),(m)=>
    [m.index,m.index+m[0].length]);
}

function solve2(inp, l) {
  input = inp.slice(2,3), log = l;
  return null;
}

function replaceArea(str, rng, val = '#') {
  if(!rng?.length) return str;
  const start = rng[0]!==-1 ? rng[0] : 0;
  let l = rng[1]-start;
  return str.slice(0,start) 
    + val.repeat(l) + str.slice(rng[1]);
}

function getAreas(nums,length) {
  return nums.map(ranges(length))
    .map(([bl,ls,rs])=>[bl,rngUnion(ls,rs),rngIntersect(ls,rs),ls,rs]);
}

function ranges(length) {
  return (bl,i,nums) => {
    const maxLeftr = minLengthFor(nums.slice(0,i+1));
    const minRightl = length - minLengthFor(nums.slice(i));
    return [bl,[maxLeftr-bl,maxLeftr],[minRightl,minRightl+bl]]
  }
}

function isInRange(rng1,rng2) {
  if (!rng1.length || !rng2.length) return [];
  return rngHelper(rng1,rng2).every((x,i)=>x===rng1[i]);
}

function rngUnion(rng1,rng2) {
  if (!rng1.length || !rng2.length)
    return !rng1.length ? (!rng2.length ? [] : rng2) : rng1;
  const [l1,r1] = rng1, [l2,r2] = rng2;
  return [Math.min(l1,l2),Math.max(r1,r2)];
}

function rngIntersect(rng1,rng2) {
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
  return lineWise().match(/[^ ,]+/g)
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