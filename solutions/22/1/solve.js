const fs = require('fs');

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const res = sumCalsAndSort(data);
  const topElveCountToSum = 3;

  console.log(
    res.splice(0,topElveCountToSum)
      .reduce((a,c)=>a+c,0));
});

function sumCalsAndSort(data) {
  let currentCal = 0;
  return data.split('\n')
    .reduce((p,c) =>  {
      if (c === '') {
        p.splice(
          p.findIndex(
            x => x<currentCal),
            0,currentCal);
        currentCal = 0;
      } else {
        currentCal += +c;
      }
      return p;
    },[]);
}