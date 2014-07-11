From: https://github.com/martinsookael/multiverse
Try it out: https://www.multiverse.im

Multiverse
==========

The most dynamic chat meets the
world’s fastest meme-generator*

![A meme sample](https://raw.github.com/martinsookael/multiverse/master/public/www/images/memeSample1.png)

Command line based chat, use commands to bring out gif-s and create memes.

It's currently pretty hackable.
I'd love to find the equilibrium between hackable and secure.

Using command line enables fast creation of functionality without being stuck in the design and user implementation phase.
It's easy - you don't have to use any buttons, you use commands.
Espesialy good for tiny screens - like mobile for example.

INSTALLATION
-------------

0. Assuming you have node and npm installed
1. download the package - https://github.com/martinsookael/multiverse/archive/master.zip
or
2. git clone git@github.com:martinsookael/multiverse.git .
3. sudo npm install
4. I tend to get "node-gyp rebuild 2> builderror.log" but nevertheless the stuff seams to work
5. go to conf.js and set "usesDb" to "false" if you don't plan to use database. Also the port can be set from there.
6. node t.js
5. go to yourdomain:3001 or however you configured it.


SETUP
-------------

1. basic configuration and database is in conf.js
2. /public/stylesheets/fonts.styl - I use it to keep several installations with different fonts.

HEROKU:
heroku labs:enable websockets
heroku addons:add mongolab  

DATABASE:
Either start with:  
"USER='xxx' PASS='xxx' HOST='xxx' DB='xxx' DBPORT=xxx COLLECTION='xxx' node t.js"  

or edit conf.js with accurate database credidentials.

![A second meme sample](https://raw.github.com/martinsookael/multiverse/master/public/www/images/memeSample2.png)


UPDATES
--------

10th July 2014 - 4m4t3ur cakeday in Reddit. We made a post and got a bunch of awesome feedback.

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
