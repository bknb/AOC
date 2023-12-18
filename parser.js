function grid(mapper) {
  const gridFactory = (input) => {
    const rawGrid = input.split('\n').map(r => r.split(''));
    return mapper ? rawGrid.map(r=>r.map(mapper)) : rawGrid;
  }

  gridFactory.boolean = (symbol = '#') => {
    mapper = c => c === symbol;
    return gridFactory;
  }

  gridFactory.number = () => {
    mapper = c => +c;
    return gridFactory;
  }

  gridFactory.complex = (dict) => {
    mapper = c => dict[c];
    return gridFactory;
  }

  return gridFactory
}

function linify(input) {
  return input.split('\n');
}

function lineWise(mappers = [], filters = []) {
  let q = [...mappers.map(m=>[m,true]),
           ...filters.map(f=>[f,false])];
  const lineWiseFactory = (lines) => {

    return q.reduce((a,[e,m])=>
        m?a.map(e):a.filter(e),lines);
  }

  lineWiseFactory.map = (mapper) => {
    q.push([mapper,true]);
    return lineWiseFactory;
  }

  lineWiseFactory.filter = (filter) => {
    q.push([filter,false]);
    return lineWiseFactory;
  }

  lineWiseFactory.numberfy = () => {
    q.push([(line) => line.map(d=>isNaN(d)?d:+d),true]);
    return lineWiseFactory;
  }

  lineWiseFactory.match = (regex = /[-\w]+/g) => {
    q.push([(line) => line.match(regex),true]);
    return lineWiseFactory;
  }

  lineWiseFactory.test = (regex) => {
    q.push([(line) => regex.test(line),false]);
    return lineWiseFactory;
  }

  return lineWiseFactory;
}

function multiSet(seperator = /^\s*$/, mapper) {
  const multiSetFactory = (input) => {
    let lines = input.split('\n');
    let next = lines.findIndex(l => seperator.test(l));
    const result = [];
    while (next !== -1) {
      if (next !== 0)
        result.push(lines.slice(0, next).join('\n'));
      lines = lines.slice(next+1);
      next = lines.findIndex(l => seperator.test(l));
    }
    result.push(lines.join('\n'));
    return mapper ? result.map(mapper) : result;
  }

  multiSetFactory.mapper = (newMapper) => {
    mapper = newMapper;
    return multiSetFactory;
  }
  
  return multiSetFactory;
}

module.exports = {grid, multiSet, lineWise, linify}