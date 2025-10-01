#!/usr/bin/env node
const fs = require('fs');
const { program } = require('commander');

program
  .option('-i, --input <file>', 'input JSON file (NDJSON)')
  .option('-o, --output <file>', 'output file')
  .option('-d, --display', 'print result to console')
  .option('-v, --variety', 'show flower variety')
  .option('-l, --length <min>', 'min petal.length', v => Number(v));

program.parse(process.argv);
const opt = program.opts();

if (!opt.input) { console.error('Please, specify input file'); process.exit(1); }
if (!fs.existsSync(opt.input)) { console.error('Cannot find input file'); process.exit(1); }

const text = fs.readFileSync(opt.input, 'utf8');
const records = text.split(/\r?\n/).filter(Boolean).map(line => {
  try { return JSON.parse(line); } catch { return null; }
}).filter(Boolean);

let rows = records;
if (typeof opt.length === 'number' && !Number.isNaN(opt.length)) {
  rows = rows.filter(r => Number(r['petal.length']) > opt.length);
}

const lines = rows.map(r => {
  const len = r['petal.length'];
  const wid = r['petal.width'];
  const varName = r['variety'];
  return opt.variety ? `${len} ${wid} ${varName}` : `${len} ${wid}`;
});
const result = lines.join('\n');

if (opt.output) {
  fs.writeFileSync(opt.output, result + (result && !result.endsWith('\n') ? '\n' : ''));
}
if (opt.display) {
  if (result) process.stdout.write(result + (result.endsWith('\n') ? '' : '\n'));
}
