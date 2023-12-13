const { sum } = require('../../../santasLittleHelper.js');
let input, log;

function solve1(inp, l) {
  input = inp, log = l;
  input.map(patternSolutions).forEach(x=>log(x));
}

function solve2(inp, l) {
  input = inp, log = l;
  return null;
}

function patternSolutions([pat, nums]) {
  let oldPattern = '';
  let pattern = pat;
  do {
    oldPattern = pattern;
    pattern = trim(addImplicit(trim(pattern),nums));

    //log(pattern,nums);
    if (/^\?+#+/.test(pattern))
      pattern = step(pattern,nums);
    pattern = markMissing(reverse(pattern),nums.reverse());
    //log(pattern);

    if (/^\?+#+/.test(pattern))
      pattern = step(pattern,nums);
    pattern = markMissing(reverse(pattern),nums.reverse());

    //log(pattern);
    pattern = remove(pattern,nums);
    pattern = combine(pattern,nums);
    //log(pattern);
    if (nums[0] === 0) {
      pattern = pattern.slice(1);
      nums = nums.slice(1);
    }
    if (nums[nums.length-1] === 0) {
      pattern = pattern.slice(0,-1);
      nums = nums.slice(0,-1);
    }
    //log(pattern);

  } while (pattern !== oldPattern)

  if(!pattern) return 1;
  if(/^\?+#+\?+$/.test(pattern) && nums.length === 1)
    pattern = pattern.replace(/#+/,(x)=>{
      nums[0]-=x.length;
      return '';
    });
  if(/^\?*$/.test(pattern) && nums.length > 0)
    return solutions(nums,pattern.length);

  let chunks = chunk(pattern);
  chunks = clearChunks(chunks,nums);
  if (chunks.length === 1)
    return patternSolutions([chunks[0],nums]);
  return subProblems(chunks,nums);
}

function combine(pattern,nums) {
  if (nums.length === 1 && /#+\?+#+/.test(pattern))
    return pattern.replace(/#+\?+#+/g,(x)=>'#'.repeat(x.length));
  return pattern;
}

function chunk(p) {
  return p.match(/[^\.]+/g);
}

function clearChunks(chunks,nums) {
  let result = chunks;
  if (chunks[0].length < nums[0])
    result = chunks.slice(1);
  if (chunks[chunks.length-1].length < nums[nums.length-1])
    result = chunks.slice(0,-1);
  return result;
}

function subProblems(chunks,nums) {
  log(chunks,nums);
  const ls = chunks.map(x=>x.length);
  const ls2 = nums.map((x,i)=>minLengthFor(nums.slice(0,i+1))-1);
  log(ls,ls2);
  if (chunks[0].includes('#') && ls[0] < ls2[1])
    return patternSolutions([chunks[0],[nums[0]]])
      * subProblems(chunks.slice(1),nums.slice(1));
  return 1;
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

function solutions([first,...rest],length) {
  if (!rest.length) return length - first + 1;
  const minRest = minLengthFor(rest);
  if (first === length - minRest) return 1;
  let restSpace = length - first - 1;
  let sum = solutions([first], length - minRest);
  while (restSpace-- >= minRest)
    sum += solutions(rest, restSpace);
  return sum;
}

function minLengthFor(arr) {
  return sum(...arr) + arr.length;
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
  const lo = length-ml1-l, hi=ml2+l-1;
  return hi>=lo?[lo,hi]:[];
}

function init(data, log) {
  return data.split('\n').map(row => row.match(/[^ ,]+/g))
    .map(([springs, ...nums]) => [
      springs,
      nums.map(d => +d)]);
}

module.exports = { init, solve1, solve2 }