var aws = require('aws-sdk');
var ejs = require('ejs');

async function sendEmailNotifications() {
    // Initialize the email parameters
    const sender = "abc@xyz.com";
    const recipient = "xyz@abc.com";
    const subject = " Amazon SES Notification Demo";

    // JSON Object to dynamically populate the HTML email Template
    let emailData = {};
    const today = new Date();
    const month = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    const date = today.getDate() + '-' + month[today.getMonth()]; + '-' + today.getFullYear();
    emailData.date = date;
    const validTill = new Date();
    validTill.setDate(today.getDate() + 10)
    emailData.validTill = validTill.getDate() + '-' + month[validTill.getMonth()] + '-' + validTill.getFullYear();
    
    // Use ejs templating engine to render HTML string.
    const body_html = await ejs.renderFile(__dirname + '/views/email-template.ejs', {emailData: emailData}).then((output) => output);

    // The character encoding for the email.
    const charset = "UTF-8";

    // Create a new SES object. 
    var ses = new aws.SES();

    // Create sendEmail params object
    let params = {
        Source: sender,
        Destination: {
            ToAddresses: [
                recipient
            ],
        },
        Message: {
            Subject: {
                Data: subject,
                Charset: charset
            },
            Body: {
                Html: {
                    Data: body_html,
                    Charset: charset
                }
            }
        }
    };

    //Create the promise and call the method
    var sendPromise = ses.sendEmail(params).promise();
    sendPromise.then(function (data) {
        console.log("Email sent! Message ID: ", data.MessageId);
    }).catch(function (err) {
        // If something goes wrong, print an error message.
        console.log(err.message);
    });
}

// call to send email
sendEmailNotifications();
