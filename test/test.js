const strapper = require('../');
const should = require('chai').should();

const fs = require('fs');
const del = require('del');
const mkdirp = require('mkdirp');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const destDir = path.join(__dirname, 'dest');

function compareTree(a, b) {
  var afiles = fs.readdirSync(a);
  var bfiles = fs.readdirSync(b);

  afiles.length.should.equal(bfiles.length);

  afiles.forEach((aname, i) => {
    var bname = bfiles[i];
    aname.should.equal(bname);

    var apath = path.join(a, aname);
    var astat = fs.statSync(apath);

    var bpath = path.join(b, bname);
    var bstat = fs.statSync(bpath);

    if (astat.isFile()) {
      bstat.isFile().should.equal(true);
      fs.readFileSync(apath, 'utf8')
        .should.equal(fs.readFileSync(bpath, 'utf8'));

    } else if (astat.isDirectory()) {
      bstat.isDirectory().should.equal(true);
      compareTree(apath, bpath);
    }
  });
}

describe('strapper', () => {

  beforeEach(() => {
    mkdirp.sync(destDir);
  });

  afterEach(() => {
    del.sync(destDir);
  });

  it('should copy all files from the src to the dest directory', done => {

    strapper(srcDir, destDir, err => {
      compareTree(srcDir, destDir);
      done();
    });
  });
});
