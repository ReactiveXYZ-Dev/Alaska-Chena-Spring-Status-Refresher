var cp = require('child_process');
var mailgun = require('mailgun.js');
var mailClient = mailgun.client({
    username: 'api',
    key: "key-e593ce801035acd418bf37df27feb6e2"
})

var sendMail = function() {
    // send email
    mailClient.messages.create('mail.classspy.com', {
        from: "Alaska Tour <internal@classspy.com>",
        to: ["jackiee1998@hotmail.com"],
        subject: "Rooms available for 3rd Mar!",
        html: "Come be quick! <a href='https://secure.chenahotsprings.com/webres/webres.asp'>Click here to register</a> ."
    })
    .then(msg => console.log(msg))
    .catch(err => console.log(err));
}

var scrape = function(refreshInterval) {
    // create scrapper process
    var p = cp.spawn("casperjs", ["scraper.js", "--interval=" + refreshInterval ]);
    console.log("=========== Start scrapping 3rd Mar Alaska Tour ==========");

    // register stdout listeneres
    p.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);

        if (data == "HAS_ROOMS\n") {
            console.log("GREAT!!!!");
            sendMail();
        } else if (data == "NO_ROOMS\n") {
            console.log("SHIT!!!");
        }

    });

    p.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    p.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

// Start scrapping...
const REFRESH_INTERVAL = 2; // in seconds

scrape(REFRESH_INTERVAL);