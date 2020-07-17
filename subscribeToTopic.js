module.exports = (AWS, email, topicArn) => {
    return new Promise((resolve, reject) => {
        try {
            const subscribe = new AWS.SNS({ apiVersion: "2010-03-31" })
                .subscribe({
                    Protocol: 'EMAIL', 
                    TopicArn: topicArn,
                    Endpoint: email
                }).promise();

            subscribe
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