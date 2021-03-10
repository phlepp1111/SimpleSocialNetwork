const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("../secrets.json"); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-central-1",
});

exports.sendResetEmail = (emailTo, resetCode) =>
    ses
        .sendEmail({
            Source: "phlpp.neumann+SNEMAIL@gmail.com",
            Destination: {
                ToAddresses: [emailTo],
            },
            Message: {
                Body: {
                    Text: {
                        Data: "Here is your password reset code: " + resetCode,
                    },
                },
                Subject: {
                    Data: "Your Reset Code",
                },
            },
        })
        .promise()
        .then(() => console.log("email sent!"))
        .catch((error) => console.log(error));
