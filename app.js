// const fs = require("fs");
// fs.writeFileSync("notes.txt", "This file was created by NodeJs");
// fs.appendFileSync("notes.txt", "\nMy name is Vimal");
const chalk = require("chalk");
const yargs = require("yargs");

const notes = require("./notes.js");
// console.log(notes());

// const validator = require("validator");
// console.log(validator.isEmail("vimalv86@gmail.com"));
// console.log(validator.isURL("vimalv86@gmail"));

// console.log(chalk.inverse.red("Error!"));

// console.log(process.argv);
// console.log(yargs.argv);

// Create add command
yargs.command({
  command: "add",
  describe: "Add a new note",
  builder: {
    title: {
      describe: "Note title",
      demandOption: true,
      type: "string",
    },
    body: {
      describe: "Note body",
      demandOption: true,
      type: "string",
    },
  },
  handler: (argv) => {
    notes.addNote(argv.title, argv.body);
  },
});

// Create remove command
yargs.command({
  command: "remove",
  describe: "Remove note",
  builder: {
    title: {
      describe: "Remove note",
      demandOption: true,
      type: "string",
    },
  },
  handler: (argv) => {
    notes.removeNote(argv.title);
  },
});

// Create list command
yargs.command({
  command: "list",
  describe: "List note",
  handler: () => {
    notes.listNotes();
  },
});

// Create read command
yargs.command({
  command: "read",
  describe: "Read note",
  builder: {
    title: {
      describe: "Read note",
      demandOption: true,
      type: "string",
    },
  },
  handler: (argv) => {
    notes.readNote(argv.title);
  },
});

console.log(yargs.argv);
