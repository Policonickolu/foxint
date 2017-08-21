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
      trips: getTrips(),
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
  
  $('#block-command table.product-header').each(function(i) {

    let $row = $(this).first();
    let tripInfo = getTripInfo(i);

    let trip = {
      code: tripInfo.code,
      name: tripInfo.name,
      details:  {
                  price: getPrice($(this)),
                  roundTrips: getRoundTrips($row)
                }
    }

    trips.push(trip);

  });

  return trips;

}

/*
 *  Get the round trips from the email by reading through its rows
 */
function getRoundTrips($row){
    
  let roundTrips = [];

  $row = $row.next();

  while(!$row.hasClass('product-header') && $row != ""){

    if($row.find('td').hasClass('product-travel-date')){

      roundTrips.push(getRoundTrip($row));

    }

    $row = $row.next();

  }

  return roundTrips;
}

/*
 *  Get the round trip from the email by reading through its rows
 *  from a trip date to the next trip date
 */
function getRoundTrip($rowDate){
  
  let rt = {
    type: "",
    date: "",
    trains: []
  };

  rt.date = new Date(checkDate($rowDate.text().trim()));
  rt.date = rt.date.toISOString().replace('T',' ');

  let $row = $rowDate.next();

  while(!$row.find('td').hasClass('product-travel-date')
        && $row != ""){

    if($row.hasClass('product-details')){

      if(rt.type === "")
        rt.type = $row.find('td.travel-way').text().trim();

      rt.trains.push(getTrain($row));

    }

    $row = $row.next();
  }

  return rt;

}

/*
 *  Get a train details from a details row of the email
 */
function getTrain($rowDetails){

  let $td = $rowDetails.find('td');

  let train = {
    departureTime     : $td.eq(1).text().replace('h',':').trim(),
    departureStation  : $td.eq(2).text().trim(),
    arrivalTime       : $td.eq(7).text().replace('h',':').trim(),
    arrivalStation    : $td.eq(8).text().trim(),
    type              : $td.eq(3).text().trim(),
    number            : $td.eq(4).text().trim(),
    passengers        : getPassengers($rowDetails.next())
  };

  return train;

}

/*
 *  Get passengers list from a passengers row of the email
 */
function getPassengers($rowPassengers) {

  let passengers = [];

  $rowPassengers.find('td.typology').each(function() {

    passengers.push({
      type: $(this).next().text().includes("Billet échangeable") ? "échangeable" : "non échangeable",
      age: /\(.*\)/.exec($(this).text())[0]
    });

  });

  return passengers;
}

function getPrice($row) {
 
  let price = $row.find('td:last-child').text();
  price = price.replace(',','.');

  return parseFloat(price);
  
}

/*
 *  Get all the prices from the order block of the email
 */
function getPrices() {

  let prices = [];

  $('.product-header td:last-child').each(function() {
    prices.push({
      value: parseFloat($(this).text().replace(',','.'))
    });

  });

  return prices;
}

/*
 *  Get the total price from the payment block of the email
 */
function getTotalPrice(){

  let price = $('#block-payment .total-amount tr td:last-child').text();
  price = price.replace(',','.');

  return parseFloat(price);
}

/*
 *  Get the name and ref of the orderer from the href link of the email
 *  
 *  We cannot use the discount card data
 *  because everyone doesn't necessarily have this card 
 */
function getTripInfo(index){

  let $pnr = $('#block-travel .block-pnr').eq(index);

  let tripInfo = {
    name      : $pnr.find('td.pnr-name span').text().replace(/&nbsp;/g,'').trim(),
    code      : $pnr.find('td.pnr-ref span').text().replace(/&nbsp;/g,'').trim()
  }

  return tripInfo;
}

/*
 * Add the year to the travel date, same year of the order date
 * or next year if the travel is after 31 december 
 */
function checkDate(day){

  let date1 = new Date(day);
  let date2 = new Date(orderDate);

  date1.setFullYear(date2.getFullYear());

  if(date1 < date2){
    date1.setFullYear(date1.getFullYear() + 1);
  }

  return date1.toLocaleDateString();
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

