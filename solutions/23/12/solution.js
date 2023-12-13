const { sum, prd, sumOfSums, combi, dist} = require('../../../santasLittleHelper.js');
let input, log;

function solve1(inp, l) {
  input = inp, log = l;
  
  let inputcopy = input.map(([p,n])=>[p,[...n]]);
  let start = performance.now();
  const fast = inputcopy.map(patternSolutions);
  console.log(performance.now() - start);
  start = performance.now();
  const brut = input.map(bruteForce);
  console.log(performance.now() - start);
  fast.forEach((f, i) => f!==brut[i]?console.log(f, brut[i], i):'');
  
  return sum(...log(fast));
}

function solve2(inp, l) {
  input = inp.slice(1,2), log = l;
  return sum(...input.map(unfold).map(patternSolutions));
}

function unfold([pattern,nums]) {
  const unfoldedPattern = Array(5).fill(pattern).flat().join('?');
  const unfolledNums = Array(5).fill(nums).flat();
  return [unfoldedPattern,unfolledNums];
}

function patternSolutions([pat, nums]) {
  let pattern = pat;

  if (nums.length === 0) return 1;
  let oldPattern = '';
  log(pattern,nums);
  do {
    oldPattern = pattern;
    pattern = trim(addImplicit(trim(pattern),nums));
    
    if (/^\?+#+/.test(pattern))
      pattern = step(pattern,nums);
    pattern = markMissing(reverse(pattern),nums.reverse());
    if((pattern.match(/#/g) || []).length>sum(...nums))
      return 0;

    if (/^\?+#+/.test(pattern))
      pattern = step(pattern,nums);
    if((pattern.match(/#/g) || []).length>sum(...nums))
      return 0;
    pattern = markMissing(reverse(pattern),nums.reverse());
    
    pattern = remove(pattern,nums);
    pattern = combine(pattern,nums);
    
    if (nums[0] === 0) {
      pattern = pattern.slice(1);
      nums = nums.slice(1);
    }
    if (nums[nums.length-1] === 0) {
      pattern = pattern.slice(0,-1);
      nums = nums.slice(0,-1);
    }
  
  } while (pattern !== oldPattern)

  if(!pattern || !nums.length) return 1;
  if(/^\?+#+\?+$/.test(pattern) && nums.length === 1)
    pattern = pattern.replace(/(\?+)(#+)(\?+)/,(x,l,m,r)=>{
      nums[0]-=m.length;
      return '?'.repeat(Math.min(l.length,r.length)*2);
    });
  if(/^\?*$/.test(pattern) && nums.length > 0)
    return nums[0] === 0 ? 1 : solutions(pattern.length,nums);

  const chunks = log(chunk(pattern,nums),nums);
  if (chunks.length === 1)
    return bruteForce([pattern,nums]);
    
  const dists = dist(nums,chunks.map((_,i)=>i));
  log(dists);

  let tests = dists.map((d)=>chunks.map((c,i) => 
    [c,d.filter(([,j])=>i===j).map(([n])=>n)]));
  tests = tests.filter(t=>t.every(isValid));
  tests.forEach(x=>log(x));

  return sum(...tests.map(t=>prd(...t.map(patternSolutions))));
}

function getTests(pattern,nums) {
  const tests = [];
  
}

function isValid([p,n]) {
  const f = n[0], l = n[n.length-1];
  return (p.match(/#/g) || []).length<=sum(...n)
    && minLengthFor(n)<=p.length
    && !new RegExp(`^\\?{0,${f}}#{${f+1},}|#{${l+1},}\\?{0,${l}}$`).test(p);
}

function chunk(p,nums) {
  const max = Math.max(...nums);
  return log(p.replace(/(#+)\?(#+)/,(x,l,r)=>
    x.length>max?l+'.'+r:x),p)
    .match(/[^\.]+/g);
}

function bruteForce([pattern,nums]) {
  const pattarr = pattern.split('');
  const regEx = regex(nums);
  let indices = pattarr.map((x,i)=>[x==='?',i])
    .filter(([x])=>x>0).map(([,i])=>i);
  const total = sum(...nums)-(pattern.match(/#/g) || []).length;
  let combis = combi(indices,total);
  if (combis.length === 0) return 1;
  return combis.map(c=>
    pattarr.map((x,i)=>c.includes(i)?'#':x).join(''))
      .filter(x=>regEx.test(x)).length;
}

function regex(nums) {
  return new RegExp(nums.map(n=>`#{${n}}`).join('\.+'));
}

function combine(pattern,nums) {
  if (nums.length === 1 && /#+\?+#+/.test(pattern))
    return pattern.replace(/#+\?+#+/g,(x)=>'#'.repeat(x.length));
  return pattern;
}

function step(pattern,nums) {
  let seq = sequence(pattern);
  if (seq[0][1] <= nums[0] && nums[0] < seq[1][1] + seq[0][1])
    return pattern.slice(seq[1][1]+seq[0][1]-nums[0]);
  return pattern;
}

function remove(pattern, nums) {
  const result = pattern.replace(/^#+/,x=>{
    nums[0]-=x.length;
    return '';
  });
  return result.replace(/#+$/,x=>{
    nums[nums.length-1]-=x.length;
    return '';
  });
}

function reverse(pattern) {
  return pattern.split('').reverse().join('');
}

function trim(pattern) {
  return pattern.replace(/^\.*|\.*$/g,'');
}

function markMissing(pattern, nums) {
  const regex = `.(?=(?=.{0,${nums[nums.length-1]-1}}$)[^#]*#)`;
  return pattern.replace(new RegExp(regex,'g'),'#');
}

function sequence(p) {
  return p.match(/\.+|\?+|#+/g).map(s => [s[0], s.length]);
}

function solutions(length,nums) {
  const total = sum(...nums)
  length -= total + nums.length - 2;
  return sumOfSums(length,nums.length);
}

function minLengthFor(arr) {
  return sum(...arr) + arr.length -1;
}

function addImplicit(pattern, nums) {
  return nums.map((_,i,a)=>
    ranges(a,i,pattern.length))
    .filter(x=>x.length)
    .reduce((a,[l,h])=>
      a.replace(new RegExp(`.(?=.{${l},${h}}$)`,'g'),'#'),pattern);
}

function ranges(arr, i, length) {
  const l = arr[i];
  const ml1 = minLengthFor(arr.slice(0,i));
  const ml2 = minLengthFor(arr.slice(i+1));
  const lo = length-ml1-l-1, hi=ml2+l;
  return hi>=lo?[lo,hi]:[];
}

function init(data, log) {
  return data.split('\n').map(row => row.match(/[^ ,]+/g))
    .map(([springs, ...nums]) => [
      springs,
      nums.map(d => +d)]);
}

module.exports = { init, solve1, solve2 }