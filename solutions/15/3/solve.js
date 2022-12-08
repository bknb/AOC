const fs = require('fs');

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const santaD = [];
  const botD = [];
  let isBot = false;
  const visited = {'0-0':true};
  let count = 0;
  let x = 0;
  let y = 0;
  
  data.split('').forEach((d,i)=>i%2===0?santaD.push(d):botD.push(d));
  
  x = 0;
  y = 0;
  santaD.forEach(d=> {
    switch(d) {
      case '^': --y; break;
      case '>': ++x; break;
      case 'v': ++y; break;
      case '<': --x; break;
    }
    const coord = x+'-'+y;
    if (!visited[coord]) count++;
    visited[coord] = true;
  });

  count++;
  x = 0;
  y = 0;
  botD.forEach(d=> {
    switch(d) {
      case '^': --y; break;
      case '>': ++x; break;
      case 'v': ++y; break;
      case '<': --x; break;
    }
    const coord = x+'-'+y;
    if (!visited[coord]) count++;
    visited[coord] = true;
  });

  console.log(count);
});