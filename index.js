var cp = require('child_process');
var mailgun = require('mailgun.js');
var mailClient = mailgun.client({
    username: 'api',
    key: ""
})

var sendMail = function() {
    // send email
    mailClient.messages.create('mail.example.com', {
        from: "Alaska Tour <internal@example.com>",
        to: ["example@example.com"],
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
