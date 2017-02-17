"use strict";
/**
  * Stats for
  *   1. n of files by lang
  *   2. n of bytes by lang
  * TODO: add verbose ooption for loggins
  * TODO: use nconf to get config of opts:
  *   verbose
  *   exlude-paths=NIL
  *   depth=INFINITY
  *   format-size:2after dot
  */

let fs = require("fs");
let path = require("path");
let assert = require("assert");

const TYPE_FILE = Symbol();
const TYPE_DIR = Symbol();

let targetpath = process.argv[2];

// TODO: return info object so we don't pollute global space
function traverseDir(dirPath, foundFile) {
  let dir;

  dir = path.resolve(dirPath);
  assert.strictEqual(exists(dir), TYPE_DIR);
  dir = fs.readdirSync(dir);
  dir.forEach((filePath) => {
    filePath = path.resolve(dirPath, filePath);
    let fileType = exists(filePath);
    switch(fileType) {
      case TYPE_DIR:
        traverseDir(filePath, foundFile);
        break;
      case TYPE_FILE:
        foundFile(filePath);
        break;
      default:
        // skip
        break;
    }
  }, void(0));
}

// stats we want
let nFiles = 0;
let extensions = [];

function put() {
  let size, totalSize = 0;

  console.log("\n\n");
  extensions.forEach((extArr) => {
    totalSize += extArr[2];
    size = byteToHuman(extArr[2])
    console.log(`${extArr[0]} ${extArr[1]} ${size}`)
  });

  totalSize = byteToHuman(totalSize);
  console.log("-------------");
  console.log(`found ${nFiles} ${totalSize}`);
}

function byteToHuman(bytes) {
  bytes = +bytes;

  let units = ["b", "kb", "mb", "gb", "tb", "?", "??", "???", "????"];
  let count, dotInd;

  for (count = 0; bytes > 1024; bytes = bytes / 1024, count++) ;

  bytes = String(bytes);
  dotInd = bytes.indexOf(".");

  if (~~dotInd) bytes = bytes.slice(0, dotInd +3);

  return "" + bytes + units[count];
}

function checkExtension (ext, byteCount) {
  if (ext.length === 0) ext = "<no-ext>";
  byteCount = +byteCount;
  let found = false;
  for (let extArr of extensions) {
    if (extArr[0] === ext) {
      extArr[1] += 1;
      extArr[2] += byteCount;
      found = true;
      break;
    }
  }

  if (found === false) extensions.push([ext, 1, +byteCount]);
}

function foundFile (filePath) {
  //console.log("file found: " + filePath);
  let buffer, fileParsed;
  nFiles +=  1;
  fileParsed = path.parse(filePath);
  buffer = fs.readFileSync(filePath);
  //console.log(fileParsed.ext, buffer.length);
  checkExtension(fileParsed.ext, buffer.length);
}

function exists (path) {
  let stat;

  stat = fs.statSync(path);
  if (stat == null) return null;
  else if (stat.isFile()) return TYPE_FILE;
  else if (stat.isDirectory()) return TYPE_DIR;
  // something we don't care about
  else return null;
}

// usage
/*
traverseDir(targetpath, foundFile);
put();
*/
