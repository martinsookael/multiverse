From: https://github.com/451ee/t
Try it out: http://meie.tallinn.ee:3001


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

INSTALLATION 2:
-----------------
0. $ npm install forever -g
1. $ forever start t.js
2. $ crontab -u YOURUSERNAME -e
3. in the file write: 
3.1 @reboot /usr/local/bin/forever start /your/path/to/your/app.js
4. $ mongod --fork --logpath PATHTOYOURMONGOLOG/mongod.log // thisone starts mongo independently


SETUP
-------------

1. basic configuration is in conf.js
2. /public/stylesheets/fonts.styl - I use it to keep several installations with different fonts.


CURRENT STATUS
-------------

Uses:
Express, Jade and Stylus - as the base back- and frontend.
socket.io - for connecting people.
mongo - for database

//No database is currently attached.
//I kind of like the idea of a talker without a database + it makes development faster.

Usable on all screen sizes.
Little HTML+CSS.


PRIORITIES
--------

* lightweight on traffic
* lightweight
* works on every screen

TODO
--------

Current tasklist is here:
https://app.asana.com/-/share?s=7719476021228-pxHKCllHXsiHL17Dbn8QlqCeedhtgmC3TW8kWlUPShS-1888846333398


UPDATES
--------

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


WHY? 
----
+ I think the text based user interface deserves another go.
+ "Rooms" could be used for group chatting.
+ I started talking with two friends from a telnet talker I used to visit more than 10 years ago and it felt good to talk with them.


FIRST VERSION
-------------
/*
THIS INFO IS OUTDATED - I'M JUST KEEPING IT HERE TO REMIND ME OF THE BEGEINNING
*/

In case we should build it then the first version ought to be very basic, 
but doing those basic things very good.

Users:
+ Ability to log in and out. 
+ Twitter+FB+??? connect.
+ Name, profile pic. 
+ Perhaps some profile info, just text is fine.
+ Users can change names of other users for their view.
Administration+moderation are out of scope for the first version.

Rooms:
+ Room has a name (& perhaps a topic).
+ Every user can create public rooms.
+ Public room can be accessed by everyone. 
+ Every user can create private rooms for only these people they allow.

Communication: 
+ 3 basic ways for communication:
+ Just chatting = everyone in the same room gets your messages.
+ .t = .tell <user> <message> - send a private message.
+ .e = .emote would also be nice.
+ Hubot http://hubot.github.com

