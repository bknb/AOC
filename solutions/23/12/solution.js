const { sum, combi, sumOfSums} = require('../../../santasLittleHelper.js');
let input, log;

function solve1(inp, l) {
  input = inp, log = l;
  input = input.replace('.',' ').trim();
  let patterns = input.split(/\s+/);
  return sum(...patterns.map(bruteForce));
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

function bruteForce([pattern,nums]) {
  if (!pattern) return ~~!nums.length;
  if (!nums) return ~~!/#/.test(pattern);
  if (/^#+$/.test(pattern))
    return ~~(nums.length===1&&nums[0]===pattern.length);
  if (/^\?+$/.test(pattern))
    return solutions(pattern.length,nums);
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

function solutions(length,nums) {
  const total = sum(...nums)
  length -= total + nums.length - 2;
  return sumOfSums(length,nums.length);
}

function regex(nums) {
  return new RegExp(nums.map(n=>`#{${n}}`).join('\.+'));
}

function init(data, log) {
  return data.split('\n').map(row => row.match(/[^ ,]+/g))
    .map(([springs, ...nums]) => [
      springs,
      nums.map(d => +d)]);
}

module.exports = { init, solve1, solve2 }