const execSync = require('child_process').execSync;
const {intro,rerun} = require('./questions.js');

start();

function start() {
  console.log('');
  intro().then(answers=>
      answers.action==="create new"
         ? createNew(answers) : solve(answers));
}

function solve({year,day}) {
  execSync(`node ./solutions/${year}/${day}/solve.js`,{stdio: 'inherit'});
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