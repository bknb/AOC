const fs = require('fs');

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const result = data.split('\n').filter(isNice2).length;
  console.log(result);
  

  function isNice(str) {
    if(str.includes('ab') || str.includes('cd')
       || str.includes('pq') || str.includes('xy'))
      return false;

    let vowelcount = 0;
    let last = '';
    let double = false;

    str.split('').forEach(c=>{
      if (!double) double = last === c;
      last = c;
      switch(c) {
        case 'a':case 'e':case 'i':case 'o':case 'u':vowelcount++;
      }
    });
    
    return vowelcount > 2 && double;
  }

  function isNice2(str) {
    console.log(str,hasRepeat() , hasSecondPair());
    return hasRepeat() && hasSecondPair();
    
    function hasRepeat() {
      for (let i=str.length;i-->2;)
        if (str[i] === str[i-2]) return true;
      return false;
    }

    function hasSecondPair() {
      for (let i=str.length;i-->3;)
        for (let j=i-1;j-->1;)
          if (str[i] === str[j] && str[i-1] === str[j-1])
            return str[i-1] + str[i];
      return false;
    }
  }
});