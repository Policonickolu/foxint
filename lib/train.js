class Train {

  constructor($row){

    let $td = $row.find('td');

    this.travelWay = $td.eq(0).text().trim();
    this.departureTime = $td.eq(1).text().replace('h',':').trim();
    this.departureStation = $td.eq(2).text().trim();
    this.arrivalTime = $td.eq(7).text().replace('h',':').trim();
    this.arrivalStation = $td.eq(8).text().trim();
    this.type = $td.eq(3).text().trim();
    this.number = $td.eq(4).text().trim();
    this.passengers = [];
    
  }

}

module.exports = Train;
