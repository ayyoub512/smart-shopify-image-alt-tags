const sgMail = require("@sendgrid/mail");
sgMail.setApiKey("YOUR_SENDGRID_KEY");

const status1 = (shop, email) => {
    const msg = {
        to: email, // Change to your recipient
        from: "care@zoose.net", // Change to your verified sender
        subject: "Images proceede",
        text: "and easy to do anywhere, even with Node.js",
        html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    };

    sgMail
        .send(msg)
        .then(() => {
            console.log("Email sent");
        })
        .catch((error) => {
            console.error(error);
        });
};

const status_1 = (shop, email) => {
    const msg = {
        to: email, // Change to your recipient
        from: "care@zoose.net", // Change to your verified sender
        subject: "Something went wrong while processing AltTextApp request",
        text: "Something went wrong while processing AltTextApp request",
        html: "<strong>Re-authenticate</strong>",
    };

    sgMail
        .send(msg)
        .then(() => {
            console.log("Email sent");
        })
        .catch((error) => {
            console.error(error);
        });
};

module.exports = {
    status1,
    status_1,
};
