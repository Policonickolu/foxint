class Passenger {

  constructor($row){

    this.type =  $row.next().text().includes("Billet échangeable") ? "échangeable" : "non échangeable",
    this.age =  $row.text().match(/\(.*\)/)[0];
    
  }

}

module.exports = Passenger;
