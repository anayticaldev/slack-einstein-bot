# slack-bot-app


## How to Install
* Inside the root folder, execute the following command
```
npm install
```
## How to Run the App
* Create a `.env` file copying from `.env_copy`
* Fill `.env` with the valid credentials from Slack App and Salesforce
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

## Diagram
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