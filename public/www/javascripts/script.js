// JavaScript Document

$(document).ready(function() { 
    
    sessionStorage.username = false;
    sessionStorage.room = "multiverse";
        
    // hold focus on the text input, unless it's the log in screen.
	if ($("#username").is(":visible")) {
		$("#username").focus();			
		//$("#username").keypress(); // didn't help, at least not for android.
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

    
    // check weather user is writing
    var sentFalse = true;
    setInterval(checkTyping, 3000);    
    function checkTyping(){
        var isWritten = $("#input").val();
        if(isWritten !== '' ){ // something is written
            socket.emit('writing', {user: sessionStorage.username, writing: true, room: sessionStorage.room});
            sentFalse = false;
        }
        else { // is not written
            if(sentFalse === false) {  // send it only once
                socket.emit('writing', {user: sessionStorage.username, writing: false, room: sessionStorage.room});
                sentFalse = true;        
            }
        }
    }
    
    
    /* CATCH CONTENT FROM FORM */
    $('#send').on('submit', function(e) { 
       
        e.preventDefault(); 
        
        var rndNumb=Math.floor(Math.random()*1000000);
        var nid = "p"+rndNumb;
        
        var input = $('#input'); 
        var message = input.val();
        
        c.push({id:nid, message:message}); // add this to local command list

        // get the first word
        if (message === '') return false;
        message = message.trim(); 
        if(message.indexOf(" ") != -1) var firstWord = message.slice(0, message.indexOf(" "));
        else var firstWord = message;

        // get geoinfo
        var city ='';
        if (typeof(geoip_city) != "undefined") { 
            city = geoip_city()+", "+geoip_region()+", "+geoip_country_name();
        }
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
                    announcer('<strong>Meme it, bitch!</strong><br /><br /><strong>usage: <br /></strong>m fwp<br>m fwp text to top / text to bottom<br>m fwp text to top<br>m fwp / text to bottom<br><br><strong>Available memes:</strong><br /><strong>m fwp</strong> - First World Problem<br><strong>m bru</strong> - bottom text: "IMPOSSIBRU!!"<br /><strong>m baby</strong> - SuccessBaby<br /><strong>m yuno</strong> - Y U No?<br /><strong>m goodguy</strong> - Good Guy Greg<br /><strong>m man</strong> - Most interesting guy on earth<br /><strong>m simply</strong> - top text: "One does not simply"<br /><strong>m whatif</strong> - top text: "What if I told you?"<br /><strong>m scumb</strong> - Scumbag Steve<br /><strong>m scumg</strong> - Scumbag Stacy<br /><strong>m gf</strong> - Overly attached girlfriend<br /><strong>m fuckme</strong> - bottom text: "Fuck me, right?" <br /><strong>m nobody</strong> - Bottom text: "Ain&quot;t nobody got time for that"<br /><strong>m fa</strong> - Forever alone <br /><strong>m boat</strong> - I should buy a boat cat <br /><strong>m acc</strong> - top text: "challegne accepted" <br /><strong>m notbad</strong> - bottom text: "not bad" <br /><strong>m yoda</strong> - master yoda<br /><strong>m soclose</strong> - so close<br /><strong>m africa</strong> - top text: so you"re telling me<br /><strong>m aliens</strong> - bottom text "aliens"<br /><strong>m brian</strong> - bad luck Brian<br /><strong>m dawg</strong> - yo dawg, i heard...<br /><strong>m high</strong> - bottom text: "is too damn high"<br /><strong>m isee</strong> - bottom text: i see what you did there<br /><strong>m notsure</strong> - not sure...<br />');                
                scroll();
                }
                
                else { 
                    if(message === "r" || message === "r " ) {return false;} // r misfire 
                    else {
                        var channel = shortcuts[firstWord].channel; 
                        socket.emit(channel, { title: message, author: sessionStorage.username, time: getTime(), city: city, nid:nid });
                    }
                }
            } // it's a meme!
            else {  
                var data = new Array; 
                data.title = input.val();
                data.author = "Server";
                data.time = getTime();
                socket.emit("meme", { title: message, author: sessionStorage.username, time: getTime(), city: city, nid: nid });
            }
        }
        
        else { // if no shortcut, send it to the wire
            socket.emit('news', { text: message, author: sessionStorage.username, time: getTime(), city: city, nid: nid}, function(feedBack) {
                //console.log(feedBack); // fires when server has seen it
            });
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
        scrollAndBeep(data);
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
    
    socket.on('roomHeader', function (data) { 
        $("#roomName").show();	
        $("#roomId").html("#"+data.room);	
        sessionStorage.room = data.room;
    });

    // let know if users have seen the message
    socket.on('nsa', function (data) { 
        //serialWriter(data);
        var thePost = "#"+data.nid;
        var author = $(thePost).find(".name").find("strong").html();
                                      
        if(sessionStorage.username != data.name && data.name != author) {
            //$(thePost).find(".content").append("<span class='gray small'> &#10003;"+data.name+"</div>");
            $(thePost).find(".viewers").find(".tick").show();
            $(thePost).find(".viewers").append("&nbsp;"+data.name+",");
        }
    });

    
    // let know if a user is writing    
    socket.on('writing', function (data) { 
        if(data.writing === true) {
            if(data.user !== sessionStorage.username) { 
                $("#isWriting").remove();
                $("#jetzt").before('<span id="isWriting" class="gray small">'+data.user+' is wrting</span>');
            }
        }
        else {  
            $("#isWriting").remove(); 
        }
    });
    

    function writer(data) { 
        if(sessionStorage.username != "false") { // hides news from non logged ins
            message = data.title || ''; name = data.author || ''; time = data.time || '';  city = data.city || ''; nid = data.nid || ''; 
            message = findLinksAndImages(message); // find links and images
            var avatar = getAvatar(name);
            $("#isWriting").remove();
            $("#jetzt").before('<div class="message" id="'+nid+'"><img src="images/'+avatar+'" class="avatar" /><div class="time">'+time+'</div><div class="place small">'+city+'</div><p class="name"><strong>'+name+'</strong></p><p>'+message+'<span class="viewers gray small"><span class="tick hidden">&nbsp;&nbsp;&#10003;</span></span></p></div>');
            scrollAndBeep(data);
            
            socket.emit('nsa', { nid: data.nid, name: sessionStorage.username, room: data.room });
        }
    }
    
    // print announcements
    function announcer(message) {
        message = message || '';
        $("#jetzt").before('<div class="message announce"><p>'+message+'</p>');    
    }

    function paint(data) { 
        title = data.title || ''; author = data.author || ''; time = data.time || ''; city = data.city || '';
        var avatar = getAvatar(name);
        $("#isWriting").remove();
        $("#jetzt").before('<div class="message" id="'+nid+'"><img src="images/'+avatar+'" class="avatar" /><div class="time">'+time+'</div><div class="place small">'+city+'</div><p class="name"><strong>'+author+'</strong></p><img class="full" src="images/shortcuts/'+shortcuts[title].img+'" /><span class="viewers"></span></div>');
        scrollAndBeep(data);
        socket.emit('nsa', { nid: data.nid, name: sessionStorage.username, room: data.room });
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
        announcer('Write the following letter and press enter<br /> <strong>w</strong> - <strong>who</strong> is here<br><strong>h</strong> - show this <strong>help</strong>screen here<br><strong>c</strong> - <strong>curse</strong> in Italian <!--<br><strong>y</strong> - yes - success baby --><br><strong>m</strong> - create a <strong>meme</strong> <br>');
        scroll();
    }    
    

    function serialWriter(data) {        
        
        for (var i=0;i<data.length;i++) {
            if(data[i].title.indexOf(" ") != -1) var firstWord = data[i].title.slice(0, data[i].title.indexOf(" "));
            else var firstWord = data[i].title;    

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
        $(window).scrollTop(height); 
    }  
    
    // scroll and beep on command
    function scrollAndBeep(data) {
        if (sessionStorage.username != data.author) {
            document.getElementById('ping1').play();
            if(deviceActive === false) {
                makeBeep();
                vibrate();
            }
        }
        scroll();
    }
    
    
    // up and down arrows bring up last commands
    var c = new Array;
    c.push({id:"", message:""});
    var cIndex = 0;

    $(document).keydown(function(e){
        if (e.keyCode == 38) { 
            cIndex--;
            var command = $(c).get(cIndex);
            $("#input").val(command.message);
            //c.pop();
            return false;
        }
    });

    $(document).keydown(function(e){
        if (e.keyCode == 40) { 
            cIndex++;
            var command = $(c).get(cIndex);
            $("#input").val(command.message);
            //c.pop();
            return false;
        }
    });  
    
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

        case "Greta":
        var avatar = "greta.jpg";
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
    
