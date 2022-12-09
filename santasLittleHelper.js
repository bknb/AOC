exports.getBounds = (a)=>{
  const max = [Number.MIN_VALUE,Number.MIN_VALUE];
  const min = [Number.MAX_VALUE,Number.MAX_VALUE];
  for(let i=a.length;i-->0;)
    for(let j=2;j-->0;) {
      if(a[i][j] > max[j]) max[j] = a[i][j];
      if(a[i][j] < min[j]) min[j] = a[i][j];
    }
  return [min,max];
}