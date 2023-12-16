const { sum, sumOfSums } = require('../../../santasLittleHelper.js');
const { linify, lineWise } = require('../../../parser.js');
let input, log;

function solve1(inp, l) {
  input = inp, log = l;
  return sum(...log(input.map(possibilities)));
}

function possibilities([p,n]) {
  p = p.replace(/^\.+|\.+$/g,'');
  const areas = getAreas(n,p.length);
  p = updatePattern(p,areas);
  const unknownRanges = getRanges(p,/\?+/g);
  if(!unknownRanges.length)  return 1;
  const blockRanges = getRanges(p,/#+/g);
  p = log(cleanArea(p,areas));
  const chunkRanges = getRanges(p,/[^\.]+/g);
  return [p,areas.map(([a])=>a)];
}

function cleanArea(pattern,areas) {
  const blockRanges = getRanges(pattern,/#+/g);
  pattern = clean(blockRanges.length-1,areas.length-1,pattern);
  return clean(0,0,pattern);
  function clean(i,j,p) {
    log(blockRanges[i],areas[j],p);
    if (rangeLength(blockRanges[i]) == areas[j][0]
        && isInRange(blockRanges[i], areas[j][1])
        && rngIntersect(blockRanges[i], areas[j][2]).length) {
      areas.splice(j,1);
      return replaceArea(p,borderedRange(blockRanges[i]),'.');
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
    .map(([bl,ls,rs])=>[bl,rngUnion(ls,rs),rngIntersect(ls,rs)]);
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

function markUnpossible(pattern,areas) {
  
}

function minLengthFor(arr) {
  if (arr.length===0) return 0;
  return sum(...arr) + arr.length - 1;
}

function unfold([pattern,nums]) {
  const unfoldedPattern = Array(5).fill(pattern).flat().join('?');
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