# botkit-storage-dynamodb

A DynamoDB storage module for Botkit.

## Usage

You should have three tables already created in your DynamoDB database: namespace + teams, namespace + users and namespace + channels.

Namespace is the namespace passed into the module. If the namespace is, for example, "testSlack" then the table's you'll want to precreate are: testSlackteams, testSlackusers, testSlackchannels.

Each table should configure 'id' as the primary key.

Passing AWS into the module is optional. If it's not passed in it will be created. If you need to do use a custom configuration you can pass AWS in. 


```
var AWS = require('aws-sdk');
AWS.config.loadFromPath('awscfg.json');

var Dynamo_Store = require('botkit-storage-dynamodb');
var dynamo_store = new Dynamo_Store({AWS: AWS, namespace: "testSlack"});

var controller = Botkit.slackbot({
  storage: dynamo_store
}).configureSlackApp(
  {
    clientId: appcfg.Slack.clientId,
    clientSecret: appcfg.Slack.clientSecret,
    scopes: ['commands','bot', 'chat:write:user']
  }
);
```

```javascript
// then you can use the Botkit storage api, make sure you have an id property
var beans = {id: 'cool', beans: ['pinto', 'garbanzo']};
controller.storage.teams.save(beans, function(err, result) {
  if (err) throw err;
  controller.storage.teams.get('cool', function(err, data) {
    if (err) throw err;
    console.log('We just got:', data);
  });  
});

```
