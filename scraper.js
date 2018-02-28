var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug'
});

// extract cli arguments
// dates in form YYYY-MM-DD
// TODO: convert them into actions
var arrDate = casper.cli.get("arrive-date");
var deptDate = casper.cli.get("dept-date")

casper.start();

function runSteps() {
    // start the scrapping procedure...
    casper.thenOpen("https://secure.chenahotsprings.com/webres/webres.asp");

    // wait for the picker page to load up
    casper.waitForSelector('div.calendarDIV', function () {
        this.echo("Loaded page...");
    });

    // update the arriving and departing month
    casper.then(function () {
        // go to next month for arrival
        this.click("td.calendarmmyyyy tr td:last-child input[type=submit]");
    });

    // update the arriving and departing day
    casper.then(function () {
        // click the designated day button for arriving
        this.click("input[name=button1day][value='3']");
    });

    // submit the form
    casper.then(function () {
        // click the submit btn
        this.click("input.btnCal");
    });

    // wait for results..
    casper.waitForSelector('input.btnIDates', function () {
        // results should be fetched by now
        this.echo("Loaded results...");
    });

    casper.then(function () {
        var noRooms = "There are no rooms available online for these dates. Please select another date or call to make a reservation.";
        var result = this.evaluate(function () {
            return document.querySelector("div.SelectRoomLabel").innerText;
        });

        // echo out the results
        if (result == noRooms) {
            console.log("NO_ROOMS");
        } else {
            console.log("HAS_ROOMS");
        }
    });
}

function start() {
    runSteps();
    casper.run(function() {
        setTimeout(start, 2000);
    });
}

start()

