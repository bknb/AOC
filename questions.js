const fs = require('fs');
const inquirer = require('inquirer');

exports.intro = ()=>inquirer
  .prompt([
    {
      type: "list",
      name: "action",
      message: "What do you want",
      choices: ['create new', 'solve'],
      default: "solve"
    },
    {
      type: "list",
      name: "year",
      message: "Select a year",
      when: ({action})=>action==="solve",
      choices: getDirectories('./solutions').sort((a,b)=>b-a)
    },
    {
      type: "list",
      name: "day",
      message: "Select a day",
      when: ({action})=>action==="solve",
      choices: ({year})=>getDirectories(`./solutions/${year}`)
        .sort((a,b)=>b-a)
    },
    {
      type: "input",
      name: "year",
      message: "Which year",
      when: ({action})=>action==="create new"
    },
    {
      type: "input",
      name: "day",
      message: "What day",
      when: ({action})=>action==="create new"
    }
  ]);

exports.rerun = ()=>inquirer
  .prompt([
    {
      type: "confirm",
      name: "rerun",
      message: "Want to rerun it"
    }
  ]);

exports.solveOptions = ()=>inquirer
  .prompt([
    {
      type: "checkbox",
      name: "options",
      message: "What do you want",
      choices: [{
        name: 'Test',
        checked: true
      },{
        name: 'Debug',
        checked: false
      },{
        name: 'Part 1',
        checked: true
      },{
        name: 'Part 2',
        checked: true
      }]
    },
  ]);

function getDirectories(path) {
  return fs.readdirSync(path, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => +item.name);
}

function lastChoice() {
  return this.choices[this.choices.length-1]
}