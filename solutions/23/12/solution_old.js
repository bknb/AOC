const { sum, combi, sumOfSums, prd} = require('../../../santasLittleHelper.js');
let input, log;

function solve1(inp, l) {
  input = inp, log = l;
  
  let inputcopy = input.map(([p,n])=>[p,[...n]]);
  let start = performance.now();
  const fast = inputcopy.map(divEtImp);
  console.log(performance.now() - start);
  start = performance.now();
  const brut = input.map(([p,n])=>brutforce(p,n));
  console.log(performance.now() - start);
  fast.forEach((f, i) => f!==brut[i]?console.log(f, brut[i], i):'');
  return sum(...brut);
}

function solve2(inp, l) {
  input = inp.slice(2,3), log = l;
  return sum(...log(input.map(unfold).map(divEtImp)));
}

function unfold([pattern,nums]) {
  const unfoldedPattern = Array(5).fill(pattern).flat().join('?');
  const unfolledNums = Array(5).fill(nums).flat();
  return [unfoldedPattern,unfolledNums];
}

function reduce(pattern,nums) {
  let oldPattern = '';
  console.log(pattern, nums);
  do {
    oldPattern = pattern;
    pattern = addImplicit(pattern,nums);

    pattern = markMissing(reverse(pattern),nums.reverse());
    pattern = markMissing(reverse(pattern),nums.reverse());

    pattern = remove(pattern,nums);
    pattern = combine(pattern,nums);

    [pattern,nums] = clean(pattern,nums);

  } while (pattern !== oldPattern)
  console.log(pattern, nums);
  return [pattern,nums];
}

function divEtImp([pattern,nums]) {
  let patterns = pattern.replaceAll('.',' ').trim().split(/\s+/);
  return divEtImpStep(patterns,nums);
}

function divEtImpStep(patterns,nums) {
  log(patterns,nums);
  if (!valid(patterns,nums)) return 0;
  if (!patterns.length) return ~~!nums.length;
  if (patterns.length===1) return solve(patterns[0],nums);
  let sum = 0;
  for (let i=0; i<=nums.length; i++) {
    const s = log(solve(patterns[0],nums.slice(0,i)));
    if (s) sum += s*log(divEtImpStep(patterns.slice(1),nums.slice(i)));
  }
  return sum;
}

function valid(ps,nums) {
  const allNums = sum(...nums);
  return sum(...ps.map(c=>c.length))
             +ps.length-1>=minLengthFor(nums)
    && sum(...ps.map(c=>minNumsFor(c)))<=allNums;
}

function minLengthFor(arr) {
  return sum(...arr) + arr.length -1;
}

function minNumsFor(pattern) {
  return (pattern.match(/#/g) || []).length;
}

function solve(pattern,nums) {
  if (!pattern) return ~~!nums.length;
  if (!nums.length) return ~~!/#/.test(pattern);
  if (pattern.length<minLengthFor(nums))
    return 0;
  [pattern,nums] = reduce(pattern,nums);
  const allSet=minNumsFor(pattern), totalNums=sum(...nums);
  if (totalNums<=allSet) 
    return totalNums<allSet?0:~~regex(nums).test(pattern);
  if (/^#+$/.test(pattern))
    return ~~(nums.length===1&&nums[0]===pattern.length);
  if (/^\?+$/.test(pattern))
    return calc(pattern,nums);
  const maxNum = Math.max(...nums);
  const maxCount = nums.filter(n => n===maxNum).length;
  const rgx = regex2(maxNum);
  if ((pattern.match(rgx)||[]).length === maxCount) {
    const patterns = pattern.split(rgx);
    const numss = splitNums(maxNum,nums);
    return prd(...patterns.map((p,i)=>divEtImpStep([p],numss[i])));
  }
  return brutforce(pattern,nums);
}

function splitNums(count,nums) {
  const index = nums.findIndex(n => n===count);
  if (index === -1) return  [nums];
  return [nums.slice(0,index)].concat(splitNums(count,nums.slice(index+1)));
}

function brutforce(pattern,nums) {
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

function calc(pattern,nums) {
  let length = pattern.length;
  const total = sum(...nums)
  length -= total + nums.length - 2;
  return sumOfSums(length,nums.length);
}

function regex2(n) {
  return new RegExp(`[^#]#{${n}}[^#]`,'g');
}

function regex(nums) {
  return new RegExp(nums.map(n=>`#{${n}}`).join('[^#]+'));
}

function init(data, log) {
  return data.split('\n').map(row => row.match(/[^ ,]+/g))
    .map(([springs, ...nums]) => [
      springs,
      nums.map(d => +d)]);
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

function markMissing(pattern, nums) {
  const regex = `.(?=(?=.{0,${nums[nums.length-1]-1}}$)[^#]*#)`;
  return pattern.replace(new RegExp(regex,'g'),'#');
}

function combine(pattern,nums) {
  if (nums.length === 1)
    return pattern.replace(/#+\?+#+/g,x=>
      '#'.repeat(x.length));
  return pattern;
}

function remove(pattern, nums) {
  return pattern.replace(/^#+/,x=>
    !isNan(nums[0]-=x.length) && '')
    .replace(/#+$/,x=>
      !isNaN(nums[nums.length-1]-=x.length) && '');
}

function clean(pattern, nums) {
  if (nums[0] === 0) {
    pattern = pattern.slice(1);
    nums = nums.slice(1);
  }
  if (nums[nums.length-1] === 0) {
    pattern = pattern.slice(0,-1);
    nums = nums.slice(0,-1);
  }
  return [pattern,nums];
}

function reverse(pattern) {
  return pattern.split('').reverse().join('');
}

module.exports = { init, solve1, solve2 }