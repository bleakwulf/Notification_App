module.exports = (AWS, topicArn, subject, message) => {
    return new Promise((resolve, reject) => {
        try {
            const sendMessage = new AWS.SNS({ apiVersion: "2010-03-31" })
                .publish({
                    Subject: subject,
                    Message: message,
                    TopicArn: topicArn
                }).promise();

            sendMessage
                .then( data => {
                    resolve(true);
                }).catch(err => {
                    throw err
                });

        } catch (e) {
            reject(e)
        }
    })
}