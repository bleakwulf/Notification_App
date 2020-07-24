const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const PORT = process.env.PORT;

const AWS = require("aws-sdk");

const express = require("express");
const app = express();

app.use(express.json());

const checkIfTopicExists = require("./checkIfTopicExists");
const createTopic = require("./createTopic");
const subscribeToTopic = require("./subscribeToTopic");
const sendEmail = require("./sendMessage");

AWS.config.update({
    region: AWS_REGION, 
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  });

app.listen(PORT, () => {
    console.log(`Notification Server is running in port ${PORT}`);
});

app.get("/", async(req, res) => { 
    res.status(200).send("Welcome to Notification Server!");
});

app.post("/registerUser", async(req, res) => {
    const { email } = req.body; 
    const topic = email.replace(/\./gi, '-').replace('@', '__');
    let topicARN = ''

    const ifTopicExists = await checkIfTopicExists(AWS, topic)
        .catch(error => {
            res.status(500).send('A topic already exists for this user, verify with your Admin for manual registration.');
        });

    if (!ifTopicExists) {
        let topicARN = await createTopic(AWS, topic);

        let subscribe = await subscribeToTopic(AWS, email, topicARN)
            .catch( error => {
                res.status(500).send('Error on attempt to register user for notification.');
            });

        // ideally, upon subscription (even pending confirmation)
        // topicARN should be stored into user profile for future references
        //  e.g., message sending

        res.status(200).send('User subscribed to receive notification, for user confirmation.');
        
    } else {
        res.status(500).send('A topic already exists for this user, verify with your Admin for manual registration.');
    }
});


app.post("/sendMessage", async(req, res) => {
    const { topicARN, email, subject, message } = req.body;

    // ideally, topicARN should not be related via request body
    // would be better if topicARN is stored along with users profile which can be retrieved via provided email

    let sendMessage = await sendEmail(AWS, topicARN, subject, message)
        .then( data => {
            res.status(200).send('Message published successfully.');
        }).catch( error => {
            res.status(500).send('Error encountered in publishing message.');
        });
});