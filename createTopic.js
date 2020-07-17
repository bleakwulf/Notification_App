module.exports = (AWS, topicName) => {
    return new Promise((resolve, reject) => {
      try {
        const createTopic = new AWS.SNS({ apiVersion: "2010-03-31" })
          .createTopic({
            Name: topicName,
          })
          .promise()
        createTopic
          .then(data => {
            console.log(`Created Topic - ${topicName}`)
            console.log("data", data)
            topicARN = data.TopicArn;
            resolve(data.TopicArn)
          })
          .catch(err => {
            throw err
          })
      } catch (e) {
        reject(e)
      }
    })
  }