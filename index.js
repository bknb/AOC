const execSync = require('child_process').execSync;
const fs = require('fs');
const {intro,rerun} = require('./questions.js');
const generalSolver = require('./solver.js');

start();

function start() {
  console.log('');
  intro().then(answers=>
      answers.action==="create new"
         ? createNew(answers) : solve(answers));
}

function solve({year,day}) {
  const specialSolveFile = `./solutions/${year}/${day}/solve.js`; 
  if(fs.existsSync(specialSolveFile))
    execSync(`node ${specialSolveFile}`,{stdio: 'inherit'});
  else {
    generalSolver(year,day);
  }
  console.log('');
  rerun().then(({rerun}) => {
    if (rerun)
      solve({year,day});
  });
}

function createNew({year,day}) {
  execSync(`mkdir -p solutions/${year}/${day}`);
  execSync(`cp -n template/* solutions/${year}/${day}/`);
  console.log('test created or already existed');
  console.log('');
  start();
}

exports.start = start;