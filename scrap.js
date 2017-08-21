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
 *  Get the trips from the email
 */
function getTrips(){

  let trips = [];
  let $row = $('#block-command table.product-header').first();
  let tripRef = getTripInfo();

  let trip = {
    code: tripRef.code,
    name: tripRef.name,
    details:  {
                price: "",
                roundTrips: ""
              }
  }


  trips.push(trip);

  return trips;

}

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
 *  Get the name and ref of the orderer from the href link of the email
 *  
 *  We cannot use the discount card data
 *  because everyone doesn't necessarily have this card 
 */
function getTripInfo(){

  let link = $('.aftersale-web a').attr('href');
  let tripInfo = {};

  link = link.split(/[?&]/);
  tripInfo.name = link[1].split('=')[1];
  tripInfo.code = link[2].split('=')[1];

  return tripInfo;
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