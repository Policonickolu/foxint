// File System
const fs = require('fs');

var exp = module.exports = {};

/*
 * Read the inputfile and clean it to have proper HTML
 */
exp.readCleanedFile = function(inputFileName) {
  
  let file = fs.readFileSync(inputFileName, 'utf-8', (err, data) => {
    
    if (err) throw err;
    writeFile({
      "status": "error",
      "data": data
    });

  });

  file = file.replace(/\\[rn"]|<br>/g, function(match) {
    
    return match === '\\"' ? '"' : '';

  });

  return file;
}

/*
 * Write the result in outputfile
 */
exp.writeFile = function(content, outputFileName) {

  fs.writeFileSync(outputFileName, content, 'utf-8', (err, data) => {
    if (err) throw err;
    console.log(data);
  }); 

}