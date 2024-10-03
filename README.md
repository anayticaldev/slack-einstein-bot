# Slack Bot Integration with Salesforce Einstein Bot

This project is a custom Slack bot that seamlessly relays messages between a Slack channel and a Salesforce Einstein Bot. The bot captures user inputs from Slack, forwards them to the Einstein Bot via API, and returns Einstein Bot responses to the Slack channel, enabling a fluid, interactive conversation.

## How It Works:
1. **User Interaction**: A user invokes the bot in Slack with a predefined keyword or by mentioning it.
2. **Slack Bot Captures Message**: The custom bot listens for messages in the Slack channel.
3. **Message Relayed to Einstein Bot**: The bot starts a session with the Einstein Bot by sending the initial message.
4. **Einstein Bot Response**: The Einstein Bot responds based on pre-configured dialogs or next actions.
5. **Response Delivered to Slack**: The bot forwards the Einstein Bot's response back to the Slack channel.
6. **User Responds**: The user can reply via text or interactive buttons in Slack.
7. **Session Continuation**: The bot listens for further user responses and continues the session by sending the user’s input to the Einstein Bot.

This integration allows users to have real-time, automated conversations within Slack, powered by Salesforce Einstein Bot's AI capabilities.

## Prerequisites
* Create a Slack App from the `slack_app_manifest.yaml`
* On Slack App Settings, Generate a App Level Token ("Basic Information >> App-Level Tokens >> Generate Token") witht he following scopes
```
authorizations:read, 
app_configurations:write,
connections:write
``` 
* On Salesforce, create a connected app that supports Client Credentials Flow, the generate Client Id and Secret
* On Salesforce, create a Einstei Bot API Connector, getting ForceConfig, Bot URL and Bot Id
* on Salesforce, get your Org Id and Domain prefix. 
* Create a `.env` file by copying from `.env_copy`
* Fill `.env` with the information from Slack App and Salesforce collected above.

## How to Install
* Inside the root folder, execute the following command
```
npm install
```
## How to Run the App

* Start the application by running the command below
```
npm start
```

## OpenSource Dependencies
```
npm install @slack/bolt
npm install dotenv
npm install axios
```

## PlantUML Diagram
```
@startuml
!theme materia-outline
actor user
participant Slack as slack
participant "Slack Bot Custom App" as bot
participant "SF Einstein Bot API" as sfbot

user -> slack: Invoke the Bot with a predefined keywork or mention
slack -> bot: Bot will be listening to messages and capturing them
bot -> sfbot: Start a session with Einstein Bot sending the initial message
sfbot -> bot: Will respond based on the pre-defined Dialogs/Next actions
bot-> slack: Forward the message received from Einstein Bot to the Slack Channel
user -> slack: Respond to the message received either via Text or Buttons
slack -> bot: Bot will be listening to messages/buttons and capturing them
bot -> sfbot: Continue a session with Einstein Bot sending the user's message
sfbot -> bot: Will respond based on the pre-defined Dialogs/Next actions

@enduml
```