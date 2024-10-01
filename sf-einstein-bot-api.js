var axios = require('axios');

var accessToken; 

const checkSFToken = async () => {
    if (!accessToken)
        await generateSFToken();
}

const generateSFToken = async () => {
    const response = await axios.post(process.env.SF_TOKEN_ENDPOINT, new URLSearchParams({
        grant_type: 'client_credentials',  // Client credentials flow usually uses the "password" grant_type for Salesforce
        client_id: process.env.SF_CLIENT_ID,
        client_secret: process.env.SF_CLIENT_SECRET,
      }))
    // console.log('token response', response.data);
    accessToken = response.data.access_token;
}

const startBotSession = async (initialMessage) => {
    const botEndpoint = process.env.SF_BOT_BASEURL + '/v5.0.0/bots/'+ process.env.SF_BOT_ID + '/sessions';
    
    try {
        await checkSFToken();
        const response = await axios.post(
            botEndpoint,
            {
                "forceConfig": {
                  "endpoint": process.env.SF_BOT_FORCECONFIG
                },
                "externalSessionKey": "bd6b4fb6-0023-407f-9cb4-63ff3389674b",
                "message": {
                  "text": initialMessage
                }},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-Org-Id': process.env.SF_ORG_ID,
                    'X-Request-Id': 101,
                },
            }
        );

        console.log('Start Session Bot Response:', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error('Error interacting with Einstein Bot:', error);
        throw error;
    }
}

const continueBotSessionText = async (sessionId, sequenceId, text, inReplytoMessageId) => {
    const botEndpoint = process.env.SF_BOT_BASEURL + '/v5.0.0/sessions/'+ sessionId + '/messages';
    
    try {
        await checkSFToken();
        const response = await axios.post(
            botEndpoint,
            {
                "message": {
                    "sequenceId": sequenceId,
                    "type": "text",
                    "text": text,
                    "inReplyToMessageId": inReplytoMessageId
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-Org-Id': process.env.SF_ORG_ID,
                    'X-Request-Id': 101,
                },
            }
        );

        console.log('Continue Session Bot Response:', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error('Error interacting with Einstein Bot:', error);
        throw error;
    }
}

const continueBotSessionChoice = async (sessionId, sequenceId, choiceId, inReplytoMessageId) => {
    const botEndpoint = process.env.SF_BOT_BASEURL + '/v5.0.0/sessions/'+ sessionId + '/messages';

    try {
        await checkSFToken();
        const response = await axios.post(
            botEndpoint,
            {
                "message": {
                  "type": "choice",
                  "sequenceId": sequenceId,
                  "inReplyToMessageId": inReplytoMessageId,
                  "choiceId": choiceId
              
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-Org-Id': process.env.SF_ORG_ID,
                    'X-Request-Id': 101,
                },
            }
        );

        console.log('Continue Session Bot Response Choice:', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error('Error interacting with Einstein Bot:', error);
        throw error;
    }
}


const endBotSession = async (sessionId) => {
    const botEndpoint = process.env.SF_BOT_BASEURL + '/v5.0.0/sessions/'+ sessionId;
    
    try {
        await checkSFToken();
        const response = await axios.delete(
            botEndpoint,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-Org-Id': process.env.SF_ORG_ID,
                    'X-Request-Id': 101,
                    'X-Session-End-Reason': 'UserRequest'
                },
            }
        );

        console.log('End Chat Bot Response:', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error('Error interacting with Einstein Bot:', error);
        throw error;
    }
}


module.exports = {startBotSession, continueBotSessionText, continueBotSessionChoice, endBotSession};

