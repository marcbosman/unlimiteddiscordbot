var Discord = require('discord.js');
var bot = new Discord.Client();

const request = require('request');

bot.on('message', function(message){
  var content = message.content.toLowerCase().split(' ');

  if(content[0] == '!testrank'){
    var botMessage = '';
    var rankDir = '';
    var rankTime = '';
    var rankAvatar = '';

    request('https://maplestory.io/api/ranking/' + content[1], { json: true }, (err, res, body) => {
      if (err) { return console.log(err); }

      if(body.name == undefined){
        botMessage = 'Could not find the character, please try again';
        message.channel.send(botMessage);
        return;
      }

      if(body.rankDirection == 'up') {rankDir = ':arrow_up: ';}
      else if(body.rankDirection == 'down') {rankDir = ':arrow_down: '}
      else if(body.rankDirection == 'draw') {rankDir = ''}
      else {rankDir = body.rankDirection + ' ';}

      if(typeof body.got == 'string') {rankTime = body.got.split('+')[0];}
      if(typeof body.avatar == 'string') {rankAvatar = body.avatar.toLowerCase().split('/character/')[1];}

      botMessage = {
        "embed": {
          "title": "Ranking for " + body.name + ":",
          "color": 4342466,
          "timestamp": rankTime,
          "footer": {
            "text": "rankings last updated on (UTC)"
          },
          "thumbnail": {
            "url": 'https://maplestory.io/api/ranking/' + rankAvatar
          },
          "fields": [
            {
              "name": "Job",
              "value": body.job
            },
            {
              "name": "World",
              "value": body.world
            },
            {
              "name": "Rank",
              "value": body.ranking + ' (' + rankDir + body.rankMovement + ')'
            },
            {
              "name": "Level",
              "value": body.level,
              "inline": true
            },
            {
              "name": "Exp",
              "value": body.exp,
              "inline": true
            }
          ]
        }
      };

      message.channel.send(botMessage);
    });
  }
});

bot.login(process.env.BOT_TOKEN);
