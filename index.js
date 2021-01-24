const fs = require('fs')
const path = require('path');

const args = process.argv.slice(2)
var out = null;

function getArgValue(arg) {
  let flag = args.indexOf(arg);
  if (flag>=0 && args.length>flag+1) {
    return args[flag+1];
  } else {
    return '';
  }
}

function getInputFilename() {
  return getArgValue('-i');
}

function getOutputFilename() { 
  return getArgValue('-o');
}

function include(filename, dir = '', spaces='') {
  if (dir=='') {
    dir = path.dirname(filename);
    filename = path.basename(filename); 
  }
  let srcPath = null;
  if (dir) {
    srcPath = `${dir}/${filename}`;
  } else {
    srcPath = filename;
  }
  var array = fs.readFileSync(srcPath).toString().split("\n");
  for(i in array) {
    let includePos = array[i].indexOf(`//INCLUDE`);
    if (includePos>=0) {
      let subSpaces = spaces + array[i].match(/^\s+/);
      let subSrcPath = array[i].substring(includePos).split(` `)[1];
      let subSrcDir = path.dirname(subSrcPath);
      let subSrcFilename = path.basename(subSrcPath);
      include(subSrcFilename,`${dir}/${subSrcDir}`, subSpaces);
    }
    if(out) {
      if (array[i]) out.write(spaces + array[i] + "\n");
    } else {
      if (array[i]) console.log(spaces + array[i]);
    }
  }
}

let ifn = getInputFilename();
let ofn = getOutputFilename();

if (fs.existsSync(ifn)) {
  if (ofn!='') {
    out = fs.createWriteStream(ofn, {
      flags: 'w' // 'a' means appending (old data will be preserved)
    });
  }
  include(ifn);
  if (out) out.end();
}

