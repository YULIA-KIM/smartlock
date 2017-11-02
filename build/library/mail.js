'use strict';

var smtpConfig = require('../config/mailsmtp');
var nodemailer = require('nodemailer');

/*
  let mailOptions = {
      from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
      to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: '<b>Hello world?</b>' // html body
  };
*/
module.exports = function (mailOptions) {
  return new Promise(function (resolve, reject) {
    var transporter = nodemailer.createTransport(smtpConfig);

    mailOptions.from = '"SmartLock" <smartlock.bc@gmail.com>'; // sender address

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};