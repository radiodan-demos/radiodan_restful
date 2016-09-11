var express = require('express'),
  client = require('radiodan-client');

console.log('Radiodan simple restful is awake');

var radiodan = client.create();

var playlist = ["crowd.mp3"];

// Get the player object called `main`
// as specified in ./config/radiodan-config.json
var player = radiodan.player.get('main');

// Listen for updates to the music database
// to make sure that we've loaded any
// audio files in `./audio` before we try
// and play them
player.on('database.update.start', function() {
  console.log('database.update.start');
});
player.on('database.update.end', function() {
  console.log('database.update.end');
  init();
});
player.on('database.modified', function() {
  console.log('database.update.modified');
});


// Tell the player to update its database, discovering
// any audio files in the music directory specified in
// the config file.

player.updateDatabase();

// When the music database is updated then
// this will run (see `player.on` code above)
// Add everything to the playlist and then play it

function init() {
  console.log("init!");
  player.on('player', function (info) {
    //console.log('player event fired with data: ', info)
    time_elapsed = info.time;
  });

}

// add everything to the playlist and start to play it

function play() {
  start_time = new Date().getTime();
  player.add({
      clear: true,
      playlist: playlist
  }).then(player.play()).then(function(){
      console.log("playing has started");
  });
}

// stop playing

function stop() {
  player.stop().then(function(){
    console.log("stopped");
 });
}

/*
  Web
  This makes a web server available at
  localhost on the specified port, the
  default is 5000 so going to
  http://localhost:5000/ in a web browser
  will load `index.html` in ./static.
*/
var web = express(),
  port = process.env.WEB_PORT || process.env.PORT || 5000;

// Use the radiodan middleware to enable
// the web pages to send commands to this
// radio
web.use('/radiodan',
  client.middleware({
    crossOrigin: true
  })
);

// Make all files in ./static available to web
// pages
web.use(express.static(__dirname + '/static'));

web.get('/play',function(req,res){
  console.log("playing");
  play();
  res.send('playing');
});

web.get('/stop',function(req,res){
  console.log("stopping");
  stop();
  res.send('stopping');
});

web.listen(port);

console.log('Listening on port ' + port);

