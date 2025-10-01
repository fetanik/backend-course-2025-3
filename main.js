#!/usr/bin/env node
const fs = require('fs');
const { program } = require('commander');

program
  .option('-i, --input <file>', 'input JSON file (NDJSON)')
  .option('-o, --output <file>', 'output file')
  .option('-d, --display', 'print result to console');

program.parse(process.argv);
const opt = program.opts();

if (!opt.input) {
  console.error('Please, specify input file');
  process.exit(1);
}
if (!fs.existsSync(opt.input)) {
  console.error('Cannot find input file');
  process.exit(1);
}

const content = fs.readFileSync(opt.input, 'utf8');

if (opt.output) fs.writeFileSync(opt.output, content);
if (opt.display) process.stdout.write(content);
