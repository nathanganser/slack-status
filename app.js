
const express = require('express')
const bodyParser = require('body-parser')
const { createEventAdapter } = require('@slack/events-api')
const databaseService = require('./services/databaseService')
const slackService = require('./services/slackService')
const { signingSecret } = require('./config'); 


const port = process.env.PORT || 3000;
const app = express();

const slackEvents = createEventAdapter(signingSecret);

app.use('/slack/events', slackEvents.expressMiddleware());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/closeme', async (req, res) => {
  
    res.send("<!DOCTYPE html>\n<html>\n    <head>\n    </head>\n <body>\n      <h1>Hello World!</h1>\n  <script type='text/javascript'>window.onload = () => { window.close() } </script>  </body>\n</html>")
})

app.get('/authredirect', async (req, res) => {
    
      var response = await slackService.requestUserToken(req.query.code);

      if(response.ok){
         await databaseService.save(response.userId, response.token)
      }

    res.send("<script type='text/javascript'>window.onload = () => { open(location, '_self').close();  } </script>")
})

slackEvents.on('message', async (event) => {
    console.log(event)
    try {

        if (event.subtype && event.subtype == 'channel_join') {
            slackService.sendMessageForUserPermission(event.user)  
        } else {
            
            switch (event.type) {
                case 'message':
                    var emojiRegex = /:(.+?):/g;
                    var emojis = event.text.match(emojiRegex);

                    var statusEmoji = emojis ? emojis[0] : "";
                    var statusText = emojis ? event.text.replace(emojiRegex, '') : event.text;

                    var userData = databaseService.get(event.user);

                    if(userData)
                    {
                        await slackService.updateStatusForUser(statusText,
                            statusEmoji, 
                            userData.userId,
                            userData.token)
                    }

                    break;

                default:
                    break;
            }
        }



    } catch (e) {
        console.log(e)
    }
});

// Starts server
app.listen(port, async () => {
    console.log('Bot is listening on port ' + port)
    await databaseService.init();
});