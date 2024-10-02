//SF TO Slack

const convertEinsteinResponseToSlackFormat = (message, sessionId) => {
    console.log('Einstein Bot Messages: ', JSON.stringify(message));
    if (message.type == 'text')
        return textResponse(message);
    else if (message.type == 'choices')
        return choiceResponse(message, sessionId);
}


const textResponse = (message) => {
    return {text: message.text};
}

const choiceResponse = (message, sessionId) => {
    var elements = [];
    for (let choice of message.choices){
      elements.push({
        "type": "button",
        "text": {
          "type": "plain_text",
          "emoji": true,
          "text": choice.label
        },
        "value": message.id,
        "action_id": sessionId+'|'+choice.id+'|einstein_bot'
      });
    }

    const reply = {
      "text": "Choose one option: ",
      "blocks": [
        {
          "type": "actions",
          "elements": elements
        }
      ]
    }
    return reply;
}

module.exports = {convertEinsteinResponseToSlackFormat};
/*
    messages: [
    {
      id: '7b3de591-0c81-4932-a580-ecfd41c8b902',
      schedule: [Object],
      type: 'text',
      text: "Hi, I'm MyBot, a digital assistant."
    },
    {
      id: 'b3fe4986-7133-4a68-9c90-bd46aa9cf260',
      schedule: [Object],
      type: 'choices',
      widget: 'menu',
      choices: [Array]
    }
  ],
*/