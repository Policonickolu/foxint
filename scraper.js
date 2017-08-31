var exp = module.exports = {};

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
        break;
      
      case 'product-details':
        break;
      
      case 'passengers':
        break;

      case 'intro':
        break;

      case 'cards':

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
 * Define a category name for the HTML row to know how to act according to.
 */
function categoryOf(el){

  res = el.attr('id') || el.attr('class');

  if(!res && el.find('td').hasClass('product-travel-date')){
    res = "product-travel-date";
  }

  return res;
}