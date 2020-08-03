const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  slackBotAccessToken: process.env.SLACK_BOT_ACCESS_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  slackClientId: process.env.SLACK_CLIENT_ID,
  slackClientSecret:process.env.SLACK_CLIENT_SECRET,
  ngrokUrl:process.env.NGROK_URL
};