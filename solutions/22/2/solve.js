const fs = require('fs');

const RPSMap = {
  'A': 0,
  'B': 1,
  'C': 2,
  'X': [[0,0,0],[2,0,1]],
  'Y': [[1,1,1],[0,1,2]],
  'Z': [[2,2,2],[1,2,0]],
};

const scenario = 2;

const printMap = ['R','P','S'];

const winScoreFactor = 3;
const scoreMap = [1,2,3];
const winMap = [[1,2,0],[0,1,2],[2,0,1]];

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const res = data.split('\n')
    .map(evalRow)
    .reduce((a,c)=>a+c,0);

  console.log(res);
});

function evalRow(row) {
  let [you, me] = row.split(' ');
  you = RPSMap[you];
  me = RPSMap[me][scenario-1][you];
  const score = winMap[you][me] * winScoreFactor + scoreMap[me];
  console.log('%s: %s->%s=>%d',row,printMap[me],printMap[you],score);
  return score;
}