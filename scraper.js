var casper = require('casper').create();

casper.start("https://secure.chenahotsprings.com/webres/webres.asp");

casper.waitForSelector('div.calendarDIV', function() {
    this.echo("Loaded page...");
});

casper.then(function() {
    // go to next month for arrival
    this.click("td.calendarmmyyyy tr td:last-child input[type=submit]");
});

casper.then(function() {
    // click the 3rd March button for arrival
    this.click("input[name=button1day][value='3']");
});

casper.then(function() {
    // click the submit btn
    this.click("input.btnCal");
});

casper.waitForSelector('input.btnIDates', function() {
    // results should be fetched by now
    this.echo("Loaded results...");
});

casper.then(function() {
    var noRooms = "There are no rooms available online for these dates. Please select another date or call to make a reservation.";
    var result = this.evaluate(function() {
        return document.querySelector("div.SelectRoomLabel").innerText;
    });

    // echo out the results
    if (result == noRooms) {
        console.log("NO_ROOMS");
    } else {
        console.log("HAS_ROOMS");
    }
});

casper.run();

