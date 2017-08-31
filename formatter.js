var exp = module.exports = {};

/*
 * Format the Data
 */
exp.format = function(data){

  let result = {
    status: "ok",
    result: {
      trips: data.trips.map(formatTrip),
      custom: {
        prices: data.prices.map((price) => { return {value: price}; })
      }
    }
  };

  return JSON.stringify(result, null, 2);

};

/*
 * Format the Trip object
 */
var formatTrip = function(trip){

  let tr = {
    code: trip.code,
    name: trip.name,
    details: {
      price: trip.price,
      roundTrips: []
    }
  }

  tr.details.roundTrips = trip.dates.map(formatRoundTrip);

  return tr;
}

/*
 * Format the RoundTrip object
 */
var formatRoundTrip = function(roundTrip){

  let rt = {
    type: roundTrip.trains[0].travelWay,
    date: roundTrip.date,
    trains: [] 
  };

  rt.trains = roundTrip.trains.map(formatTrain);

  return rt;
}

/*
 * Format the train object
 */
var formatTrain = function(train){

  delete train.travelWay;

  return train;
}