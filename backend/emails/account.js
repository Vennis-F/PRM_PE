const mailgun = require('mailgun-js');

const mg = mailgun({
    apiKey: process.env.MAILGUN_KEY,
    domain: process.env.MAILGUN_DOMAIN,
});

const verifyAccount = (email, url) => {
    const data = {
        from: 'Excited User <me@samples.mailgun.org>',
        to: `${email}`,
        subject: 'Xác nhận tài khoản bạn đăng ký?',
        html: `<body>Ấn vào đây để xác nhận: <a href=${url}>XÁC NHẬN</a></body>`,
    };

    mg.messages().send(data, function (error, body) {
        if (error) return console.log(error);
        console.log(body);
    });
};

module.exports = {
    verifyAccount,
};
