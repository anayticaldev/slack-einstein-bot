const { App } = require("@slack/bolt");
const { processStepMiddleware } = require("@slack/bolt/dist/WorkflowStep");
const {startBotSession, continueBotSessionText, continueBotSessionChoice, endBotSession} = require("./sf-einstein-bot-api.js");
const {convertEinsteinResponseToSlackFormat} = require("./slack-responses.js");
require("dotenv").config();
// Initializes your app with credentials


const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode:true, // enable to use socket mode
  appToken: process.env.APP_TOKEN
});

var sessions = {};
/* Handle All Messages from Slack Channels*/
app.message(/./, async ({ command, say, message }) => {
    try {
      if (message.text.indexOf('endchat')!= -1)
        return;
      console.log('Message Received: ', message);
      let slackSession = message.user+''+message.channel+''+message.channel_type;
      console.log('Slack Session: ', slackSession);
      console.log('Existing Sessions: ', JSON.stringify(sessions));
      if (!sessions[slackSession]){
        sessions[slackSession] = {};
      }
      var sessionStart; 
      if (!sessions[slackSession].sessionId) {
        console.log('Start Einstein Bot Session');
        sessionStart = await startBotSession(message.text);
        sessions[slackSession].sessionId = sessionStart.sessionId;
      }else {
        console.log('Continue Einstein Bot Session: ', );
        sessionStart = await continueBotSessionText(sessions[slackSession].sessionId, new Date().getMilliseconds(),message.text, sessions[slackSession].inReplytoMessageId );
      }
      console.log('Sessions: ', JSON.stringify(sessions));
      for(let reply of sessionStart.messages){
        await say(convertEinsteinResponseToSlackFormat(reply, sessions[slackSession].sessionId));
        sessions[sessionStart.sessionId] = {   
          inReplytoMessageId: reply.id
        };
      }
      
    } catch (error) {
      console.error(error);
      say('Error: ', error.message);
    }
});

/* Handle Messages from Slack Channels that contains the keyword "endchat" */ 
app.message('endchat', async ({ command, say, message }) => {
  try {
    
    console.log('End Chat Message Received: ', message);
    let slackSession = message.user+''+message.channel+''+message.channel_type;
    console.log('Slack Session: ', slackSession);
    console.log('Existing Sessions: ', JSON.stringify(sessions));
    if (!sessions[slackSession]){
      sessions[slackSession] = {};
    }
    if (sessions[slackSession].sessionId) {
      await endBotSession(sessions[slackSession].sessionId);
      await say('Einstein ChatBot Sessions Ended: '+ sessions[slackSession].sessionId);
      sessions[sessions[slackSession].sessionId] = {};
      sessions[slackSession] = {};
    }
  } catch (error) {
    console.error(error);
    say('Error: ', error.message);
  }
});

/* Handle Button Actions from Slack Channels */
app.action(/./, async ({ action, ack, say }) => {
  await ack();
  if(action.action_id.indexOf('einstein_bot')!= -1) {
    let einsteiBotSessionId = action.action_id.split('|')[0];
    let einsteiBotInReplyToMessageId = action.value.split('|')[0];
    let einsteinBotChoiceId =  action.action_id.split('|')[1];
    console.log('Action: ', JSON.stringify(action));
    // Update the message to reflect the action
    let sessionStart = await continueBotSessionChoice(einsteiBotSessionId, new Date().getMilliseconds(), einsteinBotChoiceId, einsteiBotInReplyToMessageId );
    console.log('Session Start: ', JSON.stringify(sessionStart));
    for(let reply of sessionStart.messages){
      await say(convertEinsteinResponseToSlackFormat(reply, einsteiBotSessionId));
      sessions[einsteiBotSessionId].inReplytoMessageId = reply.id;
    }
  }
});

// app.shortcut(/./, async ({shortcut, ack, context}) => {
//   await ack();
//   console.log('ShortCut :', JSON.stringify(shortcut));
// });

// app.command(/./, async (action, ack) => {
//   await ack();
//   console.log('Signal Received Command: ', action);
// });

// app.event(/./, async ({ event, client, context }) => {
//   console.log('Signal Received Event: ', event);
// });

// app.options(/./, async ({ options, ack }) => {
//   // Get information specific to a team or channel
//   await ack();
//   console.log('Options: ', options);
// });

(async () => {
    const port = 3000
    await app.start(process.env.PORT || port);
    console.log('Slack Bot App Started!!');
    
  })();


