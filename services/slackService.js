
const axios = require('axios')
const { WebClient } = require('@slack/web-api');

const { slackBotAccessToken, 
        slackClientId,
        slackClientSecret,
        ngrokUrl } = require('../config');

const webClient = new WebClient(slackBotAccessToken);

module.exports =  {
     sendMessageForUserPermission: async (userId) => {
        await webClient.chat.postMessage({ 
            channel: userId,
               text: 'Hey, I wish to update your status on your behalf. Click here to grant me access!',
                blocks: [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Hey, I wish to update your status on your behalf. Click here to grant me access!"
                        }
                    },
                    {
                        "type": "actions",
                        "elements": [
                            {
                                "type": "button",
                                "url": `https://slack.com/oauth/v2/authorize?user_scope=users.profile:write&client_id=${slackClientId}&redirect_uri=${ngrokUrl}/authredirect`,
                                "value": "true",
                                "text": {
                                    "type": "plain_text",	
                                    "text": "Allow"
                                }
                            },
                            {
                                "type": "button",
                                "value": "false",
                                "text": {
                                    "type": "plain_text",	
                                    "text": "Dont allow"
                                }
                            }
                        ]
                    }
                ]
              });   
    },
    updateStatusForUser: async (text, emoji, userId, token) => {

        var body = {
            profile: {
                user: userId, //event.user <-- before
                status_text: text,
                status_emoji: emoji
            }
        };

        var response = await axios.post('https://slack.com/api/users.profile.set',
        body,
        {
            headers: {
                'X-Slack-User': userId,
                'Authorization': `Bearer ${token}`
            }
        })


    },
    requestUserToken: async (code) => {
        
        const config = {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
    
        const response = await axios.post('https://slack.com/api/oauth.v2.access?', 
         `client_id=${encodeURIComponent(slackClientId)}&client_secret=${encodeURIComponent(slackClientSecret)}&code=${encodeURIComponent(code)}`,
        config);
          
           const {data} = response;
        if(data.ok){
            

            return {
                ok: true,
                userId: data.authed_user.id, 
                token: data.authed_user.access_token
            }
        }

        return {
            ok:false
        }
          
    }
}