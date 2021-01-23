const fs = require('fs')
const path = require('path');
console.log(process.cwd());
let args = process.argv.slice(2)

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
    if (array[i]) console.log(spaces + array[i]);
  }
}

if (fs.existsSync(args[0])) {
  include(args[0]);
}
