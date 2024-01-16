const url = require('url');
const https = require('https');

function postMessage(message) {
    const body = JSON.stringify(message);
    // Your Line Developers Api https://developers.line.biz/en/
    // This is using PUSH_MESSAGE API https://developers.line.biz/en/reference/messaging-api/#send-push-message
    // Getting started with the Messaging API https://developers.line.biz/en/docs/messaging-api/getting-started/#using-console
    const webHookUrl = "https://api.line.me/v2/bot/message/push";
    const options = url.parse(webHookUrl);
    options.method = 'POST';
    options.headers = {
        'Content-Type': 'application/json',
        // Replace token with your line bot token, go to Providers > Channel > Messaging API > Channel access token
        // Also Enable "Allow bot to join group chats"
        'Authorization': 'Bearer hqo41LnfpgzYu/....',
        'Content-Length': Buffer.byteLength(body),
    };

    const postReq = https.request(options, (res) => {
        const chunks = [];
        res.setEncoding('utf8');
        res.on('data', (chunk) => chunks.push(chunk));
        return res;
    });

    postReq.write(body);
    postReq.end();
}

function processEvent(inmessage) {
    'use strict';
    const message = JSON.parse(inmessage);
    // console.log(message.finding.severity);
    const category = message.finding.category;
    const ScannerName = message.finding.sourceProperties.ScannerName;
    const findingClass = message.finding.findingClass;
    const Explanation = message.finding.sourceProperties.Explanation;
    const state = message.finding.state;
    const severity = message.finding.severity;
    const externalUri = message.finding.externalUri;
    const Recommendation = message.finding.sourceProperties.Recommendation;
    const projectDisplayName = message.resource.projectDisplayName;   
    const eventTime = message.finding.eventTime;
    const eventTimeObj = new Date(eventTime);
    const when = eventTimeObj.toUTCString();       

    
    const LINEMessages = {
        // ID of the target recipient, ex "groupId"
        // You can get groupId from https://developers.line.biz/en/docs/messaging-api/group-chats/#receiving-webhook-events
        // Ex. Create a Webhook reciever on https://httpdump.app/ or "Request Bin" https://pipedream.com/requestbin
        // Add your Request Bin URL in "Webhook URL" on Messaging API page
        // Send a message in a group that has your bot
        // You will get a HTTP Webhook with body.events.[0].source.groupId
        "to": "C8a6a8160614e455c87df4857d07646fe",
        "messages": [
            {
                type: "text",
                text: `Google Cloud SCC Alert! - Severity: ${severity}, Alert Name: ${category} InProject: ${projectDisplayName} Time: ${when} Finding: ${findingClass} Recommendation: ${Recommendation}`
            }
        ]
    };

    postMessage(LINEMessages, (response) => {
        if (response.statusCode < 400) {
            console.info('Message posted successfully');
            callback(null);
        } else if (response.statusCode < 500) {
            console.error(`Error posting message to Google API: ${response.statusCode} - ${response.statusMessage}`);
            callback(null);
        } else {
            callback(`Server error when processing message: ${response.statusCode} - ${response.statusMessage}`);
        }
    });
}

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {object} pubsubMessage The Cloud Pub/Sub Message object.
 * @param {string} pubsubMessage.data The "data" property of the Cloud Pub/Sub Message.
 */
exports.linemessages = pubsubMessage => {
  const inmessage = Buffer.from(pubsubMessage.data, 'base64').toString();
  console.log(inmessage);
  processEvent(inmessage);
};