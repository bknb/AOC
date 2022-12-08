const fs = require('fs');

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let current = 0;
  console.log('Floor: %d', data.split('').reduce((a,c)=>c==='('?++a:--a,0));
  console.log('First Basement: %d', 
              data.split('')
              .findIndex( c => {
                if (current<0)
                  return true;
                c==='(' ? ++current : --current;
                return false;
              }));
});