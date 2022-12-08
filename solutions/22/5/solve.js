const fs = require('fs');
const path = require('path').resolve(__dirname, 'input.txt');
fs.readFile(path, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let input = data.split('\n');
  let status = input.splice(0, input.findIndex(x => x.match(/^$/)) + 1);

  transformInput();
  transformStatus();

  input.forEach(x => {
    status[x[2] - 1].push(...status[x[1] - 1].splice(-x[0], x[0]).reverse());
  });

  /*input.forEach(x=>{
    status[x[2]-1].push(...status[x[1]-1].splice(-x[0],x[0]));
  });*/

  console.log(status.map(x => x.reverse()[0]).join(''));

  //console.log(input,status);

  function transformStatus() {
    status = status.slice(0, -2)
      .map(r => r.match(/[\[ ].[\] ] ?/g))
      .map(r => r.map(x => /[A-Z ]/.exec(x)[0]));

    const result = [];
    for (let i = status.length; i-- > 0;)
      status[i].forEach((x, i) => {
        if (!result[i]) result[i] = [];
        if (x != ' ') result[i].push(x);
      })
    status = result;
  }

  function transformInput() {
    input = input.map(x => /(\d+) from (\d+) to (\d+)/.exec(x).slice(1, 4))
  }
});