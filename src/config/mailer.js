import nodeMailer from "nodemailer";

let adminEmail = "kingtruong2541@gmail.com";
let adminpass = "Quangvuong123";
let mailport = "465";
let mailhost = 'smtp.gmail.com';
let sendMail = (to, subject, htmlContent) => {
  let transporter = nodeMailer.createTransport({
    host: mailhost,
    port: mailport,
    secure: true,
    auth: {
      user: adminEmail,
      pass: adminpass
    }
  });
  let options = {
    from: adminEmail,
    to: to,
    subject: subject,
    html: htmlContent
  };
  return transporter.sendMail(options);

};
module.exports = sendMail;
