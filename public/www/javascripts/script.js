// JavaScript Document

$(document).ready(function() { 

    
    // hold focus on the text input, unless it's the log in screen.
	if ($("#username").is(":visible")) {
		$("#username").focus();			
	}
	else {
		$("#input").focus();			
	}

    //Catches info from user login box
    $('#login').on('submit', function(e) { 

        e.preventDefault();         
        var username = $('#username');
		username = username.val(); 
		name = String(username); //cl (username);
				
		if (username) { 
            $("#pleaseWait").show();
			$('#message1').hide();
            socket.emit('adduser', { username: username, time: getTime() });
            sessionStorage.username = username; // this can be achieved just with using "name"
		}
    });
    
    
    /* CATCH CONTENT FROM FORM */
    $('#send').on('submit', function(e) { 
       
        e.preventDefault(); 
        
        var input = $('#input'); 
        var message = input.val();
        
        // get the first word
        if (message === '') return false;
        message = message.trim(); 
        if(message.indexOf(" ") != -1) var firstWord = message.slice(0, message.indexOf(" "));
        else var firstWord = message;
        
        // is it a shortcut?
        if(firstWord in shortcuts) { 
            
            // is it a meme?
            // is it a meme with a typo?
            if(findMemeError(message) === "error") { 
                var data = new Array; 
                data.title = '<strong>'+input.val()+'</strong> - no such meme here :(';
                input.val('');
                data.name = "Server";
                data.time = getTime();
                writer(data);
            } // it's no meme, pass it on
            else if(findMemeError(message) === "noMeme"){ 
                if(message === "m") {
                    announcer('<strong>Meme it, bitch!</strong><br /><br /><strong>usage: <br /></strong>m fwp<br>m fwp text to top / text to bottom<br>m fwp text to top<br>m fwp / text to bottom<br><br><strong>Available memes:</strong><br /><strong>m fwp</strong> - First World Problem<br><strong>m bru</strong> - bottom text: "IMPOSSIBRU!!"<br /><strong>m baby</strong> - SuccessBaby<br /><strong>m yuno</strong> - Y U No?<br /><strong>m goodguy</strong> - Good Guy Greg<br /><strong>m man</strong> - Most interesting guy on earth<br /><strong>m simply</strong> - top text: "One does not simply"<br /><strong>m whatif</strong> - top text: "What if I told you?"<br /><strong>m scumb</strong> - Scumbag Steve<br /><strong>m scumg</strong> - Scumbag Stacy<br /><strong>m gf</strong> - Overly attached girlfriend<br /><strong>m fuckme</strong> - bottom text: "Fuck me, right?" <br /><strong>m nobody</strong> - Bottom text: "Ain&quot;t nobody got time for that"<br /><strong>m fa</strong> - Forever alone <br /><strong>m boat</strong> - I should buy a boat cat <br /><strong>m acc</strong> - top text: "challegne accepted" <br />');                
                }
                else { 
                    if(message === "r" || message === "r " ) {return false;} // r misfire 
                    else {
                        var channel = shortcuts[firstWord].channel; 
                        socket.emit(channel, { title: message, author: sessionStorage.username, time: getTime() });
                    }
                }
            } // it's a meme!
            else {  
                var data = new Array; 
                data.title = input.val();
                data.author = "Server";
                data.time = getTime();
                socket.emit("meme", { title: message, author: sessionStorage.username, time: getTime() });
            }
        }
        
        else { // if no shortcut, send it to the wire
            //console.log("läheb");
            socket.emit('news', { text: message, author: sessionStorage.username, time: getTime() });
        }
     
        input.val(''); // clear the text input. Or should it be - reset form?
    });
    

    
    /* PROCESS SERVER RESPONSES */
    socket.on('getUp', function () { 
        $('#jetzt').show();
        $("#input").focus();	
    });

    socket.on('paint', function (data) { 
        paint(data);
    });

    socket.on('meme', function (data) { 
        memeIt(data);
    });    
    
    socket.on('who', function (data) { 
        printWho(data);
    });

    socket.on('help', function (data) { 
        printHelp();
    });

    socket.on('news', function (data) { 
        writer(data);
    });

    socket.on('last', function (data) { //cl(data);
        serialWriter(data);
    });

    socket.on('roomHeader', function (data) { 
        $("#roomName").show();	
        $("#roomId").html("#"+data.room);	
    });
    
    
    


    
    /* PRINT TEMPLATES */
    // print news
    function writer(data) { //cl(data);
        message = data.title || ''; name = data.author || ''; time = data.time || '';
        message = findLinksAndImages(message); // find links and images
        var avatar = getAvatar(name);
        $("#jetzt").before('<div class="message"><img src="images/'+avatar+'" class="avatar" /><div class="time">'+time+'</div><p class="name"><strong>'+name+'</strong></p><p>'+message+'</p></div>');
        //makeBeep();
        //vibrate();
        scrollAndBeep(data);
    }
    
    // print announcements
    function announcer(message) {
        message = message || '';
        $("#jetzt").before('<div class="message announce"><p>'+message+'</p>');    
    }

    function paint(data) { //cl(data);
        title = data.title || ''; author = data.author || ''; time = data.time || '';
        $("#jetzt").before('<div class="message center"><div class="time">'+time+'</div><p class="name"><strong>'+author+'</strong></p><img src="images/shortcuts/'+shortcuts[title].img+'" /></div>');
        scrollAndBeep(data);
    }
    
    function printWho(data){
        var allUsers = []; 
        $.each(data, function(key, value) {
            if(allUsers != 'undefined'){
                allUsers = key + ', ' + allUsers;
            }
        });
        $("#jetzt").before('<div class="message announce"><div class="time">'+getTime()+'</div><p class="name"><strong>Online users:</strong></p>'+allUsers+'<p></p></div>');
    }

    function printHelp() { 
        announcer('<strong>w</strong> - who - who is here<br><strong>h</strong> - help - show this helpscreen here<br><strong>c</strong> - che cazzo - curse in Italian <!--<br><strong>y</strong> - yes - success baby --><br><strong>m</strong> - meme - create a meme <br>');
        scroll();
    }    
    

    function serialWriter(data) { /*cl(data);
        
        var array = $.map(data, function(value, index) {
            return [value];
        });
                                 
         */
        //cl(data);        
        
        for (var i=0;i<data.length;i++) {
            //cl(data[i]);
            if(data[i].title.indexOf(" ") != -1) var firstWord = data[i].title.slice(0, data[i].title.indexOf(" "));
            else var firstWord = data[i].title;
            //cl(firstWord);
            /*
            (function(first){
                if(firstWord in shortcuts) { 
                    //cl(message);
                    memeIt(data[i]);
                }
                else { // if no shortcut, send it to the wire
                    writer(data[i]);
                }
            }(i++));
            */
            

            if(firstWord in shortcuts) { 
                // it's a shortcut but no meme
                if(findMemeError(data[i].title) === "noMeme" || findMemeError(data[i].title) === "error"){ 
                    // well hello there
                    // hardcode often?
                    paint(data[i]); 
                } // it's a meme!
                else {  
                    memeIt(data[i]); 
                }
            }
            else { // if no shortcut, send it to the wire
                writer(data[i]);
            }
        }
        
        
        /*data.forEach(function(message){
            //console.log(message.title);
            if(message.title.indexOf(" ") != -1) var firstWord = message.title.slice(0, message.title.indexOf(" "));
            else var firstWord = message.title;
            //cl(firstWord);

            if(firstWord in shortcuts) { 
                //cl(message);
                memeIt(message);
            }
            
        });*/

        
        /*var singleMessage = Array();
        
        
        $.each(data, function(key, value) {
            singleMessage.message = value.title; 
            singleMessage.name = value.author; 
            singleMessage.time = value.time;
            
            //cl(singleMessage.name);

            // get the first word
            if(message.title.indexOf(" ") != -1) var firstWord = message.title.slice(0, message.title.indexOf(" "));
            else var firstWord = message.title;
            
            // is it a shortcut?
            if(firstWord in shortcuts) { 
                // it's a shortcut but no meme
                if(findMemeError(message.title) === "noMeme" || findMemeError(message.title) === "error"){ 
                    // well hello there
                    // hardcode often?
                    paint(message); 
                } // it's a meme!
                else {  
                    memeIt(message); 
                }
            }
            else { // if no shortcut, send it to the wire
                writer(message);
            }
        });
        delete singleMessage; */
    }
    
    // automagic link creation from URLs 
    function urlsToLinks(text) {
        var exp = /(\b(https?|ftp|file|http):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;        
        var match =  text.match(exp); // address
        
        if(match !== null){ // is link
            match = encodeURI(match); 
            return "<a href='#' target='blank' onclick='window.open(&quot;"+match+"&quot;, &quot;_blank&quot;, &quot;location=yes&quot;); return false;' style='color: #0066cc; text-decoration: underline; cursor: pointer;' >"+match+"</a>";
        } 
        else return text;

    }

    // automagic image creation from URLs
    function findLinksAndImages(text) {
        var exp = /(\b(https?|ftp|file|http):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]+(\.jpg|\.jpeg|\.png|\.gif|\.bmp))/ig;
        var match =  text.match(exp);
        if(match !== null){ // is image
            //return text.replace(exp,"<a href='$1' target='_blank'><img class='full' src='$1' /></a>"); 
            match = encodeURI(match); 
            return "<a href='#'  target='blank' onclick='window.open(&quot;"+match+"&quot;, &quot;_blank&quot;, &quot;location=yes&quot;); return false;' ><img class='full' src='"+match+"' /></a>";
        } 
        else { // is some other kind of link
            return urlsToLinks(text);
        }
    }

    // autoscroll to bottom of page
    function scroll() { 
        //if (name != username) document.getElementById('ping1').play();
        var height = $(document).height();
        //console.log(height);
        $(window).scrollTop(height); 
    }  
    
    // scroll and beep on command
    function scrollAndBeep(data) {
        if (sessionStorage.username != data.name) {
            document.getElementById('ping1').play();
            if(deviceActive === false) {
                makeBeep();
                vibrate();
            }
        }
        scroll();
    }
});

// get local time
function getTime() {
    var d = new Date();
    var n = d.getHours();
    var m = (d.getMinutes()<10?'0':'') + d.getMinutes();
    var time = n+':'+m;
    return time;
}

// shortcut for console.log
function cl(data) {
    console.log(data);
}


function getAvatar(name){
    switch(name) {
        case "4m4t3ur":
        var avatar = "4m4t3ur.jpeg";
        break;
            
        case "muusa":
        var avatar = "muusa.jpg";
        break;

        case "Server":
        var avatar = "be.png";
        break;
            
        default:
        var avatar = "drm.jpg";
        break;
    }
    return avatar;
}
    
