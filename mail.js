const nodemailer = require( 'nodemailer' );
const sparkPostTransport = require('nodemailer-sparkpost-transport');
const transporter = nodemailer.createTransport(sparkPostTransport());
const mailOptions = {
  from   : process.env.EMAIL_FROM, // sender address
  to     : process.env.EMAIL_TO, // list of receivers
  subject: '[Can Roca] ', // Subject line
  text   : '', // plain text body
  html   : '' // html body
};

module.exports = function( subject, text ) {
  console.warn( subject );

  if ( !process.env.EMAIL_FROM || !process.env.SPARKPOST_API_KEY || !process.env.EMAIL_TO ) {
    console.error( 'Email env vars are missing, cannot send alert emails' );
    return;
  }

  const mail = Object.assign({}, mailOptions );
  mail.subject += subject;
  mail.text = text;
  mail.html = text;

  transporter.sendMail( mail, ( error, info ) => {
    if ( error ) {
      return console.log( error );
    }
    console.log( 'Message %s sent: %s', info.messageId, info.response );
  });
};
