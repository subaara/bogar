var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');

// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
var auth = {
  auth: {
    api_key: 'key-8usharpj3a9t7-10hgav0qpgq48ruzf1',
    domain: 'postmaster@sandboxe117e3b2491c421fa8fb48413dbdc37f.mailgun.org'
  }
}

var nodemailerMailgun = nodemailer.createTransport(mg(auth));

nodemailerMailgun.sendMail({
  from: 'no-reply@kumalti.com',
  to: 'subashtrying@gmail.com',
  subject: 'Hey you, awesome!',
  text: 'Mailgun rocks, pow pow!',
}, function (err, info) {
  if (err) {
    console.log('Error: ' + err);
  }
  else {
    console.log('Response: ' + info);
  }
});