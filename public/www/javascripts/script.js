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
                data.message = '<strong>'+input.val()+'</strong> - no such meme here :(';
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
                    var channel = shortcuts[firstWord].channel;
                    socket.emit(channel, { text: message, name: sessionStorage.username, time: getTime() });
                }
            } // it's a meme!
            else {  
                var data = new Array; 
                data.message = input.val();
                data.name = "Server";
                data.time = getTime();
                socket.emit("meme", { text: message, name: sessionStorage.username, time: getTime() });
            }
        }
        
        else { // if no shortcut, send it to the wire
            //console.log("läheb");
            socket.emit('news', { text: message, name: sessionStorage.username, time: getTime() });
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

    socket.on('last', function (data) { 
        serialWriter(data);
    });
    


    
    /* PRINT TEMPLATES */
    // print news
    function writer(data) { 
        message = data.message || ''; name = data.name || ''; time = data.time || '';
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

    function paint(data) { 
        message = data.message || ''; name = data.name || ''; time = data.time || '';
        $("#jetzt").before('<div class="message center"><div class="time">'+time+'</div><p class="name"><strong>'+name+'</strong></p><img src="images/shortcuts/'+shortcuts[data.message].img+'" /></div>');
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
    

    function serialWriter(data) { 
        var singleMessage = Array();
        $.each(data, function(key, value) {
            singleMessage.message = value.title; 
            singleMessage.name = value.author; 
            singleMessage.time = value.time;

            // get the first word
            if(singleMessage.message.indexOf(" ") != -1) var firstWord = singleMessage.message.slice(0, singleMessage.message.indexOf(" "));
            else var firstWord = singleMessage.message;
            
            // is it a shortcut?
            if(firstWord in shortcuts) { 
                // it's a shortcut but no meme
                if(findMemeError(singleMessage.message) === "noMeme" || findMemeError(singleMessage.message) === "error"){ 
                    // well hello there
                    // hardcode often?
                    paint(singleMessage);
                } // it's a meme!
                else {  
                    memeIt(singleMessage);
                }
            }
            else { // if no shortcut, send it to the wire
                writer(singleMessage);
            }
        });
        delete singleMessage;
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
    
