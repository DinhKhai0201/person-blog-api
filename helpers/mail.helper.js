const nodeMailer = require('nodemailer')
class MailHelper {
    sendMail(sendTo, sendSubject, sendBody) {
        let transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'xxx@xx.com',
                pass: 'xxxx'
            }
        });
        let mailOptions = {
            from: '"Krunal Lathiya" <xx@gmail.com>', // sender address
            to: sendTo,
            subject: sendSubject,
            text: sendBody,
            html: '<b>NodeJS Email Tutorial</b>' // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    }

}
module.exports = new MailHelper()