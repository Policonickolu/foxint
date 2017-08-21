// File System
const fs = require('fs');
// DOM parser
const ch = require('cheerio');

const inputFileName = 'test.html';
const outputFileName = 'test-result.json';

// DOM accessor
var $ = ch.load(readCleanedFile(), {
            ignoreWhitespace: true,
            xmlMode: true,
        });

var orderDate = /\d{2}\/\d{2}\/\d{4}/.exec($('#intro').text())[0]
                  .split('/').reverse().join('-');


// FUNCTIONS ----------------------------------------------------------

(function process(){

  let result = {
    status: "ok",
    result: {
      trips: "",
      custom: {
        prices: getPrices()
      }
    }
  }

  writeFile(JSON.stringify(result, null, 2));

})();

/*
 *  Get all the prices from the order block of the email
 */
function getPrices(){

  let prices = [];

  $('.product-header td:last-child').each(function() {
    prices.push({
      value: parseFloat($(this).text().replace(',','.'))
    });

  });

  return prices;
}

/*
 * Read the inputfile and clean it to have proper HTML
 */
function readCleanedFile() {
  
  let file = fs.readFileSync(inputFileName, 'utf-8', (err, data) => {
    
    if (err) throw err;
    writeFile({
      "status": "error",
      "data": data
    });

  });

  file = file.replace(/\\[rn"]/g, function(match) {
    
    return match === '\\"' ? '"' : '';

  });

  return file;
}

/*
 * Write the result in outputfile
 */
function writeFile(content) {

  fs.writeFileSync(outputFileName, content, 'utf-8', (err, data) => {
    if (err) throw err;
    console.log(data);
  }); 

}