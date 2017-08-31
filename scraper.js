var exp = module.exports = {};

var Train = require('./train');
var Passenger = require('./passenger');

/*
 * Crawl the HTML row by row to get desired data
 */
exp.getDataFromHTML = function($){

  // Crawl the command block

  let $rows = $('#block-command td.digital-box-cell').children();

  let data = getDataFromCommandBlock($rows);

  // Crawl the travel block

  for(var i = 0; i < data.trips.length; i++){
    let $travel = $('#travel-'+i);
    data.trips[i].name = $travel.find('td.pnr-name span').text().replace(/&nbsp;/g,'').trim();
    data.trips[i].code = $travel.find('td.pnr-ref span').text().replace(/&nbsp;/g,'').trim();
  }

  return data;
}

/*
 * Get data by crawling the html Command block
 */
function getDataFromCommandBlock($rows){

  let trips = [];
  let prices = [];
  let orderDate = "";

  let tripId = dateId = trainId = -1;

  for(var i = 0; i < $rows.length; i++){

    $row = $rows.eq(i);

    switch(categoryOf($row)) {
      
      case 'product-header':
        tripId++;
        dateId = trainId = -1;
        let price = getPrice($row);
        trips[tripId] = {price: price, dates: []};
        prices.push(price);
        break;
      
      case 'product-travel-date':
        dateId++;
        trainId = -1;
        trips[tripId].dates[dateId] = {
          date: getDate($row, orderDate).toISOString().replace('T',' '),
          trains: []
        };
        break;
      
      case 'product-details':
        trainId++;
        trips[tripId].dates[dateId].trains[trainId] = new Train($row);
        break;
      
      case 'passengers':
        trips[tripId].dates[dateId].trains[trainId].passengers = getPassengers($row);
        break;

      case 'intro':
        let od = $row.text().match(/\d{2}\/\d{2}\/\d{4}/)[0];
        orderDate = new Date(od.split('/').reverse().join('-'));
        break;

      case 'cards':
        prices = prices.concat(getCardsPrices($row));

    }
  }

  return {
    trips: trips,
    prices: prices
  };
}

/*
 * Get the price in the travel header
 */
function getPrice($row){

  let price = $row.find('td:last-child').text().replace(',','.');

  return parseFloat(price);
}

/*
 * Get the date (dd/mm) in the HTML row and guess the year with the order date.
 */
function getDate($row, orderDate){
        

  let date = new Date(new Date($row.text().trim()).toLocaleDateString());

  let year = orderDate.getFullYear();

  date.setFullYear(year);

  if(date < orderDate){
    date.setFullYear(year + 1);
  }

  return date;
}

/*
 * Get the passengers list
 */
function getPassengers($row){

  let passengers = [];

  $typologies = $row.find('td.typology');
  for(var i = 0; i < $typologies.length; i++){

    passengers.push(new Passenger($typologies.eq(i)));
  
  }

  return passengers;
}

/*
 * Get the prices of the buyed cards 
 */
function getCardsPrices($row){

  let prices = []
  
  let $amounts = $row.find('.product-header td.amount');

  for(var i = 0; i < $amounts.length; i++){
    prices.push(parseFloat($amounts.text().replace(',','.')));
  }

  return prices;
}

/*
 * Define a category name for the HTML row to know how to act according to.
 */
function categoryOf(el){

  res = el.attr('id') || el.attr('class');

  if(!res && el.find('td').hasClass('product-travel-date')){
    res = "product-travel-date";
  }

  return res;
}