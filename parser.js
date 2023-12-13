function grid(mapper) {
  const gridFactory = (input) => {
    const rawGrid = input.split('\n').map(r => r.split(''));
    return mapper ? rawGrid.map(mapper) : rawGrid;
  }

  gridFactory.boolean = (symbol = '#') => {
    mapper = (r) => r.map(c => c === symbol);
    return gridFactory;
  }

  gridFactory.number = () => {
    mapper = (r) => r.map(c => +c);
    return gridFactory;
  }

  gridFactory.complex = (dict) => {
    mapper = (r) => r.map(c => dict[c]);
    return gridFactory;
  }

  return gridFactory
}

function lineWise(mappers = [], filters = []) {
  const lineWiseFactory = (input) => {
    const lines = input.split('\n');
    
    while (mappers.length || filters.length) {
      const mapper = mappers.shift();
      const filter = filters.shift();
      if (mapper) lines.map(mapper);
      if (filter) lines.filter(filter);
    }

    return lines;
  }

  lineWiseFactory.addMapper = (mapper) => {
    mappers.push(mapper);
    return lineWiseFactory;
  }

  lineWiseFactory.addFilter = (filter) => {
    filters.push(filter);
    return lineWiseFactory;
  }

  lineWiseFactory.addMatchMapper = (regex = /\w+/g) => {
    mappers.push((line) => line.match(regex));
    return lineWiseFactory;
  }

  lineWiseFactory.addTestFilter = (regex) => {
    filters.push((line) => regex.test(line));
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

module.exports = {grid, multiSet, lineWise}