# Security Command Center LINE Notify

## Steps

- Create LINE Bot with Messaging API
- Enable Security Command Center finding notifications for Pub/Sub
- Create a Cloud Function to send notification

## LINE Bot Messaging API

- Getting started with the Messaging API https://developers.line.biz/en/docs/messaging-api/getting-started/#using-console
- Replace token with your line bot token, go to Providers > Channel > Messaging API > Channel access token
- Also Enable "Allow bot to join group chats"
- Get the ID of the target recipient (groupId)
  - You can get groupId from https://developers.line.biz/en/docs/messaging-api/group-chats/#receiving-webhook-events
    Ex. Create a Webhook reciever on https://httpdump.app/ or "Request Bin" https://pipedream.com/requestbin
    Add your Request Bin URL in "Webhook URL" on Messaging API page
    Send a message in a group that has your bot
    You will get a HTTP Webhook with body.events.[0].source.groupId

## Enable Security Command Center finding notifications for PubSub

- Go to https://cloud.google.com/security-command-center/docs/how-to-notifications

## Create a Cloud Function for LINE chat notifications

Use the example from Slack chat notification, but use the cloud fucntion code from scc-line.js and package.json
https://cloud.google.com/security-command-center/docs/how-to-enable-real-time-notifications#slack

Do not forget to REPLACE the Authorization Bearer Token (line 16) and target groupId (line 56)