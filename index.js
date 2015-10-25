const url = require('url');
const path = require('path');
const gitUrlParse = require('git-url-parse');
const http = require('http');
const https = require('http');
const cp = require('child_process');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = function (srcs, dest, options, cb) {
  var i = 0;
  
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  if (!options) {
    options = {};
  }

  if (!srcs || srcs.length === 0) {
    if (typeof cb === 'function') {
      cb();
    }
  }

  if (!Array.isArray(srcs)) {
    srcs = [srcs];
  }

  function done() {
    if (++i === srcs.length) {
      if (typeof cb === 'function') {
        cb();
      }
    }
  }

  srcs.forEach(u => {
    // TODO add URL handling
    if (isURL(u)) {
      //TODO add git handling
      if (isGit(u)) {

      }
    } else if (isGit(u)) {

      // treat as from file system
    } else {
      var f = path.resolve(u);
      if (!isDir(f)) return;
      walkAndCopy(f, '', dest, options, cb);
    }
  });
}

function isURL(u) {
  return /^(https?\:){0,1}\/\/[^\/]+(.*)/.test(u);
}

function isGit(u) {
  return /(^git[@\:]|\.git$)/.test(u);
}


function walkAndCopy(f, dest, root, options, cb) {
  var files = fs.readdirSync(f);
  var i = 0;

  if (files.length === 0) {
    cb();
    return;
  }

  function done() {
    i += 1;
    if (i === files.length) {
      cb();
    }
  }

  files.forEach(name => {
    if (name === '.git') {
      console.warn(`!- [ignoring] ${path.join(f, name)}`)
      return done();
    }

    const fp = path.join(f, name);
    const fpStat = fs.statSync(fp);
    const dp = path.join(dest, name);
    const destDir = path.join(root, dest);

    if (fpStat.isDirectory()) {

      walkAndCopy(fp, dp, destDir, options, done);

    } else if (fpStat.isFile()) {

      if (!isDir(destDir)) {
        mkdirp.sync(destDir);
      }

      const fdestPath = path.join(destDir, name);

      if (exists(fdestPath) && !options.force) {
        console.error(`${fdestPath} could not be copied as a file of that name already exists`);
        done();
      } else {
        copy(fp, fdestPath, done);
      }
    } else {
      done();
    }
  });
}

function copy(src, dest, done) {
  fs.createReadStream(src)
    .pipe(fs.createWriteStream(dest))
    .on('finish', () => {
      console.log(`-> [copied] ${dest}`);
      done();
    });
}

function stat(p) {
  try {
    return fs.statSync(p);
  } catch (err) {
    return false;
  }
}

function exists(p) {
  return Boolean(stat(p));
}

function isDir(p) {
  const s = stat(p);
  return s && s.isDirectory();
}



