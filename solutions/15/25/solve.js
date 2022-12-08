const row = 2947;
const col = 3029;

let code = 20151125;
const factor = 252533;
const mod = 33554393;

let i = sumNToM(1,row-1) + sumNToM(row+1,col+row-1);

for (;i-->0;) code = (code * factor) % mod;

console.log(code);

function sumNToM(n,m) {
  return (m - n + 1) * (m + n) / 2;
}