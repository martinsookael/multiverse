
// Test if deploy e-mails arrive
var shortcuts = Array();

shortcuts = {
    "c":{
        "img" : "che.png",
        "channel": "paint",
    },
    "mybody":{ 
        "img" : "mybody.gif",
        "channel": "paint",
    },
    "mybody2":{ 
        "img" : "mybody2.gif",
        "channel": "paint",
    },
    "lol":{ 
        "img" : "lol.gif",
        "channel": "paint",
    },
    "dance":{ 
        "img" : "dance.gif",
        "channel": "paint",
    },
    "selffive":{ 
        "img" : "selffive.gif",
        "channel": "paint",
    },
    "think":{ 
        "img" : "think.jpg",
        "channel": "paint",
    },
    ".merka":{ 
        "img" : "merka.gif",
        "channel": "paint",
    },
    ".martin":{ 
        "img" : "martin.jpg",
        "channel": "paint",
    },
    ".murphy":{ 
        "img" : "murphy.jpg",
        "channel": "paint",
    },
    "spread":{ 
        "img" : "spread.jpg",
        "channel": "paint",
    },
    "bullshit":{ 
        "img" : "bullshit.gif",
        "channel": "paint",
    },
    "itson":{ 
        "img" : "itson.gif",
        "channel": "paint",
    },
    "bond":{ 
        "img" : "bond.gif",
        "channel": "paint",
    },
    "nofuck":{ 
        "img" : "nofuck.gif",
        "channel": "paint",
    },
    "üttekoma":{ 
        "img" : "yttekoma.jpg",
        "channel": "paint",
    },
    "okeiko1":{ 
        "img" : "okeiko1.gif",
        "channel": "paint",
    },
    "m":{ 
        "channel":"meme" 
    },
    "w":{ 
        "channel":"who" 
    },
    "h":{ 
        "channel":"help" 
    },
    "l":{ 
        "channel":"last" 
    },
    "r":{ 
        "channel":"room" 
    },
    "soundon":{ 
        "channel":"room" 
    },
    "soundoff":{ 
        "channel":"room" 
    },
}


/*
function shortCuts(data) { 
    //console.log(data.channel);
    
    switch(data.channel){
            
        case("paint"):
            //socket.emit('news', { text: message, name: sessionStorage.username, time: getTime() });
        break;
    
    
    
    
    
    
    
    
    
    }
    
    
    //return data;
}*/




//console.log(shortcuts.dance.img);

/*
function findPatterns(message) {
    // get the first word
    if (message === '') return false;
    message = message.trim(); 
    if(message.indexOf(" ") != -1) var firstWord = message.slice(0, message.indexOf(" "));
    else var firstWord = message;
    
    // is it a shortcut?
    if(firstWord in shortcuts) { 
        console.log(shortcuts[firstWord].img); 
    }
    
    // if no shortcut, send it to the wire
    else {
        socket.emit('news', { text: message, name: sessionStorage.username, time: getTime() });
    }
}

*/


/*
function findShortcut(data) { 
    //console.log(data.message);
    return data;
}
*/

/*
function findShortcut(data) { 
    input = data.message;
    cuts = new Array();
    var i = 0;
    $.each(shortcuts, function(key, value) {
        cuts[i][name] = value.name;
        cuts[i][name] = value.name;
        i++;
    });
    var shortCutIndex = $.inArray(input, cuts);
    cl(cuts);
    
    $("#jetzt").before('<div class="message"><div id="time">'+data.time+'</div><p id="name"><strong>'+data.name+'</strong></p> <img src="/shortcuts/'+cuts[shortCutIndex]+'" class="full" /></p></div>');

    return shortCutIndex;
}


function printShortcut(data, scIndex) { 
    cuts = new Array();
    var i = 0;
    $.each(shortcuts, function(key, value) {
        cuts[i] = value.name;
        i++;
    });
    cl(cuts[scIndex]['img']);
    $("#jetzt").before('<div class="message"><div id="time">'+data.time+'</div><p id="name"><strong>'+data.name+'</strong></p> <img src="/shortcuts/'+cuts[scIndex]+'" class="full" /></p></div>');
}

*/




/*
cuts = [
    {
        "name": "c",
        "img" : "che.png",
        "channel": "painter",
    },{
        "name": "mybody",
        "img" : "mybody.gif",
        "channel": "painter",
    },{
        "name": "mybody2",
        "img" : "mybody2.gif",
        "channel": "painter",
    },{
        "name": "lol",
        "img" : "lol.gif",
        "channel": "painter",
    },{
        "name": "dance",
        "img" : "dance.gif",
        "channel": "painter",
    },{
        "name": "selffive",
        "img" : "selffive.gif",
        "channel": "painter",
    },{
        "name": "i",
        "img" : "idea.jpeg",
        "channel": "painter",
    },{
        "name": "8",
        "img" : "note.gif",
        "channel": "painter",
    },{
        "name": "y",
        "img" : "yes.jpg",
        "channel": "painter",
    },{
        "name": "m",
        //"img" : "che.png",
        "channel": "meme",
    },{
        "name": "h",
        //"img" : "che.png",
        "channel": "help",
    },{
        "name": "w",
        //"img" : "che.png",
        "channel": "who",
    },{
        "name": "l",
        //"img" : "che.png",
        "channel": "last",
    }
]
*/
