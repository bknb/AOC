const fs = require('fs');
const path = require('path').resolve(__dirname, 'input.txt');
fs.readFile(path, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(data.split('\n')
    .map(excractSections)
    .filter(doRangesOverlap).length);

  function excractSections(e) {
    const r = /(\d+)-(\d+),(\d+)-(\d+)/
      .exec(e)
      .slice(1,5)
      .map(e=>+e);
    //console.log(e,r);
    return r;
  }

  function isRangeContainedByOther(e) {
    const t = e[1]-e[0]>e[3]-e[2] 
      ? e[0]<=e[2]&&e[1]>=e[3]
      : e[0]>=e[2]&&e[1]<=e[3];
    //console.log(e,t);
    return t;
  }

  function doRangesOverlap(e) {
    const t = e[0]>e[2]
      ? e[0]>e[3]
      : e[0]<e[2] && e[1]<e[2];
    //console.log(e,t);
    return !t;
  }
});