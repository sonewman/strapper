const program = require('commander');
const path = require('path');
const strapper = require('../');

program
  .option('-f, --force', 'copy')
  .parse(process.argv);

var dest = '.';
var srcs = [];

const l = program.args.length;
switch (program.args.length) {
  case 0:
    console.warn('no sources listed');
    process.exit();
    break;
  case 1:
    dest = path.resolve(dest);
    srcs = program.args.slice(0, l - 1);
    break;
  default:
    dest = path.resolve(program.args[l - 1] || dest);
    srcs = program.args.slice(0, l - 1);
}

strapper(srcs, dest, { force: program.force }, err => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log('bootstrap complete');
  }
});
