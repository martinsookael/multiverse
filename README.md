From: https://github.com/martinsookael/multiverse
Try it out: https://www.multiverse.im

Multiverse
==========

Command line based open source web chatroom


WAS IST DAS?
-------------

An idea to combine:
+ command line (telnet talker) interface
+ Node.js
+ HTML5

The big idea is to work on a interface for webapp where all the commands are insterted via keyboard.
This enables fast creation of functionality without being stuck in the design and user implementation phase.

INSTALLATION
-------------

0. Assuming you have node and npm installed
1. download the package
or
2. git clone git@github.com:451ee/t.git .
3. sudo npm install
4. I tend to get "node-gyp rebuild 2> builderror.log" but nevertheless the stuff seams to work
5. go to yourdomain:3001


SETUP
-------------

1. basic configuration and database is in conf.js
2. /public/stylesheets/fonts.styl - I use it to keep several installations with different fonts.

HEROKU:
heroku labs:enable websockets
heroku addons:add mongolab  

DATABASE:
Either start with:  
USER='xxx' PASS='xxx' HOST='xxx' DB='xxx' DBPORT=xxx COLLECTION='xxx' node t.js
or edit conf.js with accurate database credidentials.


UPDATES
--------

05th July 2014 - Code now being re-opensourced.

25 - 26 Apr 2014 Garage48 Health and Wellness hackathlon:
Added: Angular support, First API, routing, meme help and other stuff

22nd Oct 2013
Android App + Heroku hosting + www.multiverse.im
Since the Android app was together with the web app so the code got really messy.
Stoped keeping it open sourced.

12th of Oct 2013
Now works with MongoDb.

around 10th of Oct
Now supports memeing

5th of Oct 2013
Now detects width for Android devices.
Now detects links to images and URLs and autogenerates them.

14th of Sept 2013
added support for listing online users and printing who is connected and who not. Also first (hidden) support for users.
Users and rooms are from this tutorial - http://psitsmike.com/2011/10/node-js-and-socket-io-multiroom-chat-tutorial/

Also first very primitive soundnotifications. I found this tutorial useful here:
http://www.storiesinflight.com/html5/audio.html

13th of Sept 2013
added socket.io support. Should now be multiplayer.

1st of June 2013
added express.
<a href="http://jsx.ms/wp-content/uploads/2013/01/its-something.jpg">Node.js now used to display statical page.</a>
Old mockup still there in in public/mockup.html

Spring 2013
Humble beginnings:
https://github.com/451ee/t


WHY?
----
+ I think the text based user interface deserves another go.
+ "Rooms" could be used for group chatting.
+ I started talking with two friends from a telnet talker I used to visit more than 10 years ago and it felt good to talk with them.
