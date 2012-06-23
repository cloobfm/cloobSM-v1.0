/*!
 * cloob.js
 *
 * Copyright 2012, ambert@cloob.fm
 *
 * This is the core library of all of the cloob player functionality
 */

 /* Get some stuff from the StackMob Website */

StackMob.init({
    appName: "cloobjson",
    clientSubdomain: "ambertyeung",
    apiVersion: 0
});

//Define your user by initializing StackMob.User with your JSON.
var user = new StackMob.User({ username: 'bzl', password: 'bzl' , position: 'baller' });

//Define your Mix classes once on the page.
var mix = StackMob.Model.extend({schemaName: 'mix'}),
    track = StackMob.Model.extend({schemaName: 'track'}),
    mix_track = StackMob.Model.extend({schemaName: 'mix_track'});
    
var mixes = StackMob.Collection.extend({model: mix});

function getSMJSON () {
    var mixIndex = 0;
    var returnJSON = {
        'MixName': '',
        'Artist': '',
        'Country': '',
        'MixArt': '',
        'Duration': '',
        'MixURL': '',
        'Tracks': []
    };

    var allMixes = new mixes();
    allMixes.fetchExtended(2, {
        success: function(collection) {
            var allMixesJSON = collection.toJSON();
            returnJSON = {
                'MixName': allMixesJSON[0].name,
                'Artist': allMixesJSON[0].artist,
                'Country': allMixesJSON[0].country,
                'MixArt': allMixesJSON[0].artwork,
                'Duration': allMixesJSON[0].duration,
                'MixURL': allMixesJSON[0].url
            };

            for(var i = 0; i < allMixesJSON[0].mix_track.length; i+=1) {
                var position = allMixesJSON[0].mix_track[i].position - 1;
                returnJSON.Tracks[position] = {
                    "Title": allMixesJSON[0].mix_track[i].track.title,
                    "Artist": allMixesJSON[0].mix_track[i].track.artist,
                    "Remix": allMixesJSON[0].mix_track[i].track.remix,
                    "StartTime": allMixesJSON[0].mix_track[i].start_time
                };
            }

            console.debug(returnJSON);
        }
    });


};

/* 
 *	unselectable
 *	------------
 *	function for disallowing the selecting of text
 *	primarily used for the numbers on the track map
 *	
 */

 (function($) {
    "use strict";
    $.fn.unselectable = function() {
        return this.each(function() {
            $(this)
            .css('-moz-user-select', 'none')
            // FF
            .css('-khtml-user-select', 'none')
            // Safari, Google Chrome
            .css('user-select', 'none');
            // CSS 3
            if ($.browser.msie) {
                // IE
                $(this).each(function() {
                    this.ondrag = function() {
                        return false;
                    };
                });
                $(this).each(function() {
                    this.onselectstart = function() {
                        return (false);
                    };
                });
            } else if ($.browser.opera) {
                $(this).attr('unselectable', 'on');
            }
        });
    };
} (jQuery));


/* 
 *	Global soundManager object parameters
 *	------------
 *	initiate the basic aspects of a single soundManager object
 *  gets the basic music player stuff going like the sound URL
 *	
 */

soundManager.url = 'swf/'; 
soundManager.flashVersion = 9;
soundManager.debugMode = false;
soundManager.consoleOnly = false;
//This line brought back the debug window in the 20120318 build
soundManager.onready(function() {
    var mySound = soundManager.createSound({
        id: 'fp90',
        //url: 'http://www.archive.org/download/Cloob.fm20110804Cloob.fm0090Podcast/20110804Cloob.fm0090Yellow5ive.mp3'
        //url: 'http://audio.cloob.fm.s3.amazonaws.com/MORGANPAGE_Podcast_Episode_64.m4a'
        //url: 'http://localhost:8888/cloobfp0.1/mix/SHM-20120217-EM.mp3'
        //url: 'http://audio.cloob.fm.s3.amazonaws.com/SHM-20120217-EM.mp3'  <!-- EDIT FOR LIVE SITE-->
        //url: 'http://audio.cloob.fm.s3.amazonaws.com/MADEON-20120128-EM.mp3'  <!-- EDIT FOR LIVE SITE-->
        //url: 'http://localhost:8888/cloobfp0.1/mix/MADEON-20120128-EM.mp3'
        //url: 'http://localhost:8888/cloobfp0.1/mix/ATISH0024.mp3'
        //url: 'http://www.archive.org/download/Cloob.fm20101221Cloob.fm0086Podcast/20101221Cloob.fm0086JAMbertOfranl.mp3'
        //url: 'http://media.soundcloud.com/stream/yBKO3txAr1lE?stream_token=oFY9o' // for Beach Disco
        //url: 'http://soundcloud.com/morganpage/morgan-page-podcast-episode-63/download/stream'
        //url: 'http://soundcloud.com/jamberto/20110712-cloob-fm-10-minute/download/stream'
        //url: 'http://media.soundcloud.com/stream/iCawzAC16wAQ?stream_token=sR7Qm'
        //url: 'http://media.soundcloud.com/stream/HtdbP5paFa0P?stream_token=2kP5W'
    });
    //setTrackBreaks(); // This function allows the track names to be updated as the mix progresses
});


/* 
 *	Global Variables List
 *	------------
 *	Let's be real, real developers will vomit over this, 
 *  will need to kill these sooner than later and encapsulate the cloob object
 *	
 */

// Global Variables
var current_pumps = 0;
var last_pump_time = 0;
var pump_string = 0;
var LOOP_COUNTER = 0;
var LOOP_LENGTH = 5;
var LOOP_POSITION = 0;
var LOOP_ON = false;
var TRACK_ENDPOINTS = {'start' : 0, 'end' : 0};
var DOCUMENT_TITLE = document.title;
var MIX_NAME = "";
var MIX_DATA = "";
var CURRENT_TRACK = 0;
var DOUBLE_CLICK_SPEED = 500;  //estimated double click speed in ms
var TRACK_MAP_WIDTH = 960;
var TIME_OUT = 0;
var JSON_FILE = getSMJSON();
//var JSON_FILE = "json/ATISH0024.json";
//var JSON_FILE = "json/20101221-CLOOBFM-0086.json";
//var JSON_FILE = "json/MADEON-20120128-EM.json";
//var JSON_FILE = "json/SHM-20120217-EM.json";
//var JSON_FILE = "json/PROFOXBLOOD-BEACHDISCO.json";
var TITLE_TIMER = 0;
var SCRUB_LENGTH = 8000; // in milliseconds
var FPUMP_STATUS = false;



/* 
 *  fistPump
 *	------------
 *	core fistpump technology
 *	tied to the pump button object will do the pump placements on the map
 *	probably should create a data structure that will handle the pump placements
 *  will help big time to know where the pump markers went and change different views
 */

function fistPump() {
    var s = soundManager.getSoundById('fp90');
    var duration = 0;
    var position = 0;
    var marker_scale = 0;
    var pump_strength = 10;

	if(!FPUMP_STATUS) {
		return;
	}

    if (s.loaded) {
        duration = s.duration;
    } else {
        duration = s.durationEstimate;
    }

    if (s.playState != 0 && !s.paused) {
        position = s.position;
        delta_T = position - last_pump_time;

        if (delta_T < 500 && delta_T >= 0) {
            //nearly on the beat for 128BPM
            pump_string++;
            pump_strength = pump_string * 10 + 10;
            if (pump_strength > 1400) pump_strength = 1400;
        } else {
            pump_string = 0;
        }

        $('#num_user_current_pumps-838').text(addCommas(++current_pumps));
        soundManager._writeDebug('Fist Pump Speed is: ' + delta_T);
        soundManager._writeDebug('Fist Pump Position is: ' + position);

        last_pump_time = position;
        marker_scale = position / duration;
        $('#track_map_load_overlay').before('<div class="pump_marker" style="left:' + (calc_pump_pos(marker_scale)) + 'px; height:' + pump_strength + '%;" title="' + position + '"></div>');

        $('#fpump_container').fadeTo(25, 0.80).delay(15).fadeTo(25, 0.15);

    }
};

/* 
 *	calc_pump_pos()
 *	------------
 *  calculates the relative pump position helper function
 *	
 */

function calc_pump_pos(marker_scale) {
    return (Math.round(TRACK_MAP_WIDTH * marker_scale));
};


/* 
 *	calc_play_pos
 *	------------
 *  calculates the play position from the pixel value relative to the width in %
 *	
 */

function calc_play_pos(xPixel) {
    return ((xPixel) / TRACK_MAP_WIDTH);
};


/* 
 *	cloobPlay
 *	------------
 *	core play functionality that handles a lot of the rendering of the play action
 *	displays the progress bars for both the track and the mix
 *	
 */

function cloobPlay() {
    var s = soundManager.getSoundById('fp90');

    s.play({
        multiShotEvents: true,

        whileplaying: function() {
            var position = s.position;
            var duration = 0;
            var marker_scale = 0;

            if (s.loaded) {
                duration = s.duration;
                //alert(s.duration);
            } else {
                //duration = s.durationEstimate;
                duration = MIX_DATA.Duration;
                //alert('End Position ' + s.duration);	
            }

            marker_scale = position / duration;

            $('#time_elapsed').text('+ ' + convertTime(position));
            $('#time_remaining').text('- ' + convertTime(duration - position));

            if (LOOP_ON) {
                var loopDiv = $('#track_map_play_overlay');
                var startTime = MIX_DATA.Tracks[CURRENT_TRACK].StartTime,
                endTime = LOOP_POSITION;
                var setWidth = Math.round(TRACK_MAP_WIDTH * (position - startTime) / s.duration) - parseInt(loopDiv.css("borderLeftWidth"), 10) - parseInt(loopDiv.css("borderRightWidth"), 10);
                if (setWidth < 0) {
                    setWidth = 0;
                }
                loopDiv.css({
                    display: 'block',
                    width: setWidth,
                    left: Math.round(TRACK_MAP_WIDTH * startTime / s.duration)
                });
            } else {
                var playDiv = $('#track_map_play_overlay');
                var setWidth = Math.round(TRACK_MAP_WIDTH * marker_scale) - parseInt(playDiv.css("borderLeftWidth"), 10) - parseInt(playDiv.css("borderRightWidth"), 10);
                if (setWidth < 0) {
                    setWidth = 0;
                }
                playDiv.css({
                    width: setWidth,
                    left: 0
                });
            }

            var playSingleDiv = $('#track_single_play_overlay');
            var startTime = TRACK_ENDPOINTS.start, endTime = TRACK_ENDPOINTS.end;
            var singleSetWidth = Math.round(TRACK_MAP_WIDTH * (position - startTime) / (endTime - startTime)) - parseInt(playSingleDiv.css("borderLeftWidth"), 10) - parseInt(playSingleDiv.css("borderRightWidth"), 10);
            singleSetWidth = singleSetWidth < 0 ? 0: singleSetWidth;
            playSingleDiv.css({
                width: singleSetWidth,
                left: 0,
                display: 'block'
            });

            $('#track_map_play_overlay').css('opacity',
            function(opacity_scale) {
                return (Math.abs(0.67 * Math.cos(1.067 * 0.5 * Math.PI * position / TRACK_MAP_WIDTH)) + 0.33);
            });

            $('#track_single_play_overlay').css('opacity',
            function(opacity_scale) {
                return (Math.abs(0.67 * Math.cos(1.067 * 0.5 * Math.PI * position / TRACK_MAP_WIDTH)) + 0.33);
            });

			if(FPUMP_STATUS) {
            	$('#fpump').css('opacity',
            	function(opacity_scale) {
                	return (Math.abs(0.33 * Math.cos(1.067 * 0.5 * Math.PI * position / TRACK_MAP_WIDTH)) + 0.67);
            	});
			}
        },
        onfinish: function() {
            $("div.pausebutton").removeClass("pausebutton").addClass("playbutton");
            if(FPUMP_STATUS) {
				$('#fpump').fadeOut(250);
			}
            document.title = "█ " + DOCUMENT_TITLE;
            updateNowPlaying();
        }
    });

	if(FPUMP_STATUS) {
    	$('#fpump').delay(300).fadeIn(250);
	}

    $('#track_map_play_overlay').css('display', 'block');
    $("div.playbutton").removeClass("playbutton").addClass("pausebutton");
    $('#popup_message').fadeOut(300);
    $('#fpump_container').fadeTo(300, 0.15);
    //document.title = "► " + MIX_NAME;  // to change the title to the play button
    updateNowPlaying(s.position);
};


/* 
 *	twoDigits
 *	------------
 *  Helper function to truncate a number to 2 digits
 *	
 */

function twoDigits(x) {
    return ((x > 9) ? "": "0") + x
};


/* 
 *	convertTime
 *	------------
 *  Takes a time in ms and converts it into the format: h:mm:ss:t
 *	
 */

function convertTime(ms) {
    t = '';

    var tenthsec = Math.floor(ms / 100);
    t = tenthsec % 10;

    var sec = Math.floor(ms / 1000);
    var min = Math.floor(sec / 60);
    sec = sec % 60;
    t = twoDigits(sec) + "." + t;
    // + ":" + t;
    var hr = Math.floor(min / 60);
    min = min % 60;
    t = twoDigits(min) + ":" + t;

    hr = hr % 60;
    t = hr + ":" + t;

    return t;
};


/* 
 *	cloobPause
 *	------------
 *  performs the pausing action and renders the pause changes to the page
 *	
 */

function cloobPause() {
    soundManager.pause('fp90');
    $("div.pausebutton").removeClass("pausebutton").addClass("playbutton");
	if(FPUMP_STATUS) {
	    $('#fpump').fadeOut(250);
	}
    $("#popup_message").css('display', 'inline-block');
    $("#popup_message").text('PAUSED');
    $("#fpump_container").css('opacity', '0.50');
    updateNowPlaying();
};


/* 
 *	fixedLoop
 *	------------
 *  Creates a loop of a fixed length defined by LOOP_LENGTH, a global variable
 *  Hasn't been updated in many revisions; probably doesn't update the other GUI aspects
 *	
 */

function fixedLoop() {
    var s = soundManager.getSoundById('fp90');
    var position = s.position;
    var duration = LOOP_LENGTH;
    //use this variable to do +/- duration in seconds
    LOOP_POSITION = position + duration * 1000;

    soundManager._writeDebug('Loop set from current position ' + convertTime(position));
    soundManager._writeDebug('Loop will trigger at ' + convertTime((position + duration * 1000)));
    // need some error checking if you run off the end/beginning of the mix
    //note onposition mispelled because of library V2.97a.20110801
    s.onposition(position + duration * 1000,
    function(eventPosition) {
        //soundManager._writeDebug('Loop Trigger set at ' + eventPosition);
        soundManager.setPosition('fp90', eventPosition - (duration * 2 * 1000));
    });

    s.onposition(position + duration * 1000 + 1,
    function(eventPosition) {
        //soundManager._writeDebug('Loop Trigger set at ' + eventPosition);
        soundManager.setPosition('fp90', eventPosition - (duration * 2 * 1000) - 1);
    });

    $("div.loopbuttonOff").removeClass("loopbuttonOff").addClass("loopbuttonOn");
    $('.loopbuttonOn a').live('click',
    function() {
        clearLoop();
    });
};


/* 
 *	curTrackLoop ()
 *	------------
 *  Creates a loop on the current track and updates all of the UI aspects
 *	
 */

function curTrackLoop(status) {
    // status can be 0 for no status; 1 for fast forward/rewind
    status = typeof status !== 'undefined' ? status: 0;
    var s = soundManager.getSoundById('fp90');
  
	setTrackEndpoints();
	var endTime = TRACK_ENDPOINTS.end, startTime = TRACK_ENDPOINTS.start;

    //alert(endTime);
    s.onPosition(endTime,
    function(eventPosition) {
        soundManager.setPosition('fp90', startTime);
        soundManager._writeDebug('Loop set at ' + endTime);
        LOOP_COUNTER++;
        $('#loop_counter').text('[ LOOP ' + LOOP_COUNTER + ' ]');
        //alert(LOOP_COUNTER);
    });

    $(".loopbuttonOff").removeClass("loopbuttonOff").addClass("loopbuttonOn");
    LOOP_POSITION = endTime;
    LOOP_ON = true;
    $('#loop_counter').css('display', 'block');

    var loopDiv = $('#track_map_loop_overlay');
    loopDiv.css({
        display: 'block',
        width: (Math.round(TRACK_MAP_WIDTH * (endTime - startTime) / s.duration) - parseInt(loopDiv.css("borderLeftWidth"), 10) - parseInt(loopDiv.css("borderRightWidth"), 10)),
        left: Math.round(TRACK_MAP_WIDTH * startTime / s.duration)
        //-parseInt(loopDiv.css("borderLeftWidth"),10)
    });

    if (status == 0) {
        // error checking to see if it is paused looped and advancing
        $("#popup_message").text('LOOP ON');
        clearTimeout(TIME_OUT);
        if (!s.paused) {
            $("#popup_message").fadeIn(25);
            TIME_OUT = window.setTimeout(function() {
                $("#popup_message").fadeOut(300);
            },
            300);
        } else {
            window.setTimeout(function() {
                $("#popup_message").text('PAUSED');
            },
            600);
        }
    }
};


/* 
 *	setTrackEndpoints
 *	------------
 *  assigns the next logical start and finish points of the track to the global variable
 *	
 */

function setTrackEndpoints() {
	var s = soundManager.getSoundById('fp90');
    var thisTrack = currentTrack(s.position);
    var startTime = MIX_DATA.Tracks[thisTrack].StartTime || 0;
    var endTime = s.duration - 75;
    // need the 50ms offset for the last track because the loop takes some time to process
    //alert(thisTrack);
    if (thisTrack < MIX_DATA.Tracks.length - 1) {
        // error checking for last track, do nothing if already on last track
        endTime = MIX_DATA.Tracks[thisTrack + 1].StartTime;
    }

	TRACK_ENDPOINTS.start = startTime;
	TRACK_ENDPOINTS.end = endTime;
	
};


/* 
 *	clearLoop
 *	------------
 *  resets the state of the player to no loop status
 *	
 */

function clearLoop() {
    var s = soundManager.getSoundById('fp90');
    soundManager._writeDebug('Loop clearing at ' + LOOP_POSITION);
    s.clearOnPosition(LOOP_POSITION);
    //s.clearOnPosition(LOOP_POSITION+1);  // Hacked because of the 1 ms offset created in fixedLoop	
    $("div.loopbuttonOn").removeClass("loopbuttonOn").addClass("loopbuttonOff");
    LOOP_ON = false;
    $('#loop_counter').css('display', 'none');
    $('#track_map_loop_overlay').css('display', 'none');
    $("#popup_message").text('LOOP OFF');
    clearTimeout(TIME_OUT);
    if (!s.paused) {
        $("#popup_message").fadeIn(25);
        TIME_OUT = window.setTimeout(function() {
            $("#popup_message").fadeOut(300);
        },
        300);
    } else {
        window.setTimeout(function() {
            $("#popup_message").text('PAUSED');
        },
        600);
    }
};


/* 
 *	nextTrack
 *	------------
 *  Move the playhead to the next track in the mix
 *	
 */

function nextTrack() {
    var s = soundManager.getSoundById('fp90');
    var thisTrack = currentTrack(s.position);

    if (s.playState == 0 || thisTrack == (MIX_DATA.Tracks.length - 1))
    return;

    if (LOOP_ON)
    s.clearOnPosition(LOOP_POSITION);

    if (thisTrack < MIX_DATA.Tracks.length - 1)
    // error checking for last track, do nothing if already on last track
    soundManager.setPosition('fp90', MIX_DATA.Tracks[thisTrack + 1].StartTime);

    if (LOOP_ON)
    curTrackLoop(1);

    clearTimeout(TIME_OUT);
    $("#popup_message").text('NEXT TRK');
    if (!s.paused) {
        $("#popup_message").fadeIn(25);
        TIME_OUT = window.setTimeout(function() {
            $("#popup_message").fadeOut(300);
        },
        300);
    } else {
        TIME_OUT = window.setTimeout(function() {
            $("#popup_message").text('PAUSED');
        },
        600);
    }

    updateNowPlaying(s.position);
};


/* 
 *	previousTrack
 *	------------
 *  Move the playhead to the previous track in the mix
 *	
 */

function previousTrack() {
    // behavior is to go to the beginning of the track first, before previous tracks for double click
    var s = soundManager.getSoundById('fp90');
    var thisTrack = currentTrack(s.position);
    var curTrackStart = MIX_DATA.Tracks[thisTrack].StartTime;
    var prevTrackStart = 0;
    //handle case for first track to the beginning
    if (s.playState == 0)
    return;

    //soundManager._writeDebug('Current Track Start: ' + curTrackStart);
    if (LOOP_ON)
    s.clearOnPosition(LOOP_POSITION);

    if (thisTrack != 0)
    prevTrackStart = MIX_DATA.Tracks[thisTrack - 1].StartTime;

    if ((s.position - curTrackStart) > DOUBLE_CLICK_SPEED) {
        soundManager.setPosition('fp90', curTrackStart);
    }
    else
    soundManager.setPosition('fp90', prevTrackStart);

    if (LOOP_ON)
    curTrackLoop(1);

    clearTimeout(TIME_OUT);
    $("#popup_message").text('PREV TRK');
    if (!s.paused) {
        $("#popup_message").fadeIn(25);
        TIME_OUT = window.setTimeout(function() {
            $("#popup_message").fadeOut(300);
        },
        300);
    } else {
        TIME_OUT = window.setTimeout(function() {
            $("#popup_message").text('PAUSED');
        },
        600);
    }

    updateNowPlaying(s.position);
};


/* 
 *	addCommas
 *	------------
 *  Helper function that adds commas to a number and returns a string
 *	
 */

function addCommas(nStr)
 {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
};


/* 
 *	currentTrack
 *	------------
 *  Identifies the current track in the mix based on the position in ms
 *	
 */

function currentTrack(position) {
    var s = soundManager.getSoundById('fp90');
    var x=0;

    if (MIX_DATA != "") {
        for (x in MIX_DATA.Tracks) {
            if (position < MIX_DATA.Tracks[x].StartTime)
            return parseInt(x - 1);
        }
    }

    return parseInt(x);
    // to handle the last track
};


/* 
 *	scrub
 *	------------
 *  Not a dude to get rid of, move forward or backwards relative to entered speed in the mix
 *	like a fast forward or scan feature
 */

function scrub(direction) {
    // direction sets the speed and direction of the scrub vector, defaults is forward
    direction = typeof direction !== 'undefined' ? direction: 1;
    var s = soundManager.getSoundById('fp90');
    var track_index = currentTrack(s.position);
    var newPos = s.position + (SCRUB_LENGTH * direction);
    var newTrack = false;

    if (newPos > s.duration) {
        // check for overrun off the ends
        return;
    } else if (newPos < 0) {
        newPos = 0;
    }

    newTrack = (track_index !== currentTrack(newPos));

    if (s.loaded) {
        // must be loaded
        if (LOOP_ON && newTrack) {
            s.clearOnPosition(LOOP_POSITION);
        }
        soundManager.setPosition('fp90', newPos);
        updateNowPlaying(s.position);
        if (LOOP_ON && newTrack) {
            curTrackLoop(1);
        }
    }

};

/* 
 *	updateNowPlaying
 *	------------
 *  Updates the state of the GUI based on the current playing and other information
 *	
 */

function updateNowPlaying(position) {
    var s = soundManager.getSoundById('fp90');
    var currentIndex = currentTrack(s.position);
    var playStatChar = '▶';
    var playStatStr = playStatChar;
    var remixStr = MIX_DATA.Tracks[currentIndex].Remix;

    CURRENT_TRACK = currentIndex;

    if (s.paused) {
        playStatChar = '▐▐';
        playStatStr = '<span style="font-family:Arial Narrow; font-size:65%">' + playStatChar + '</span>';
    }

    if (s.playState == 0) {
        playStatChar = '█';
        playStatStr = '<span style="font-size:75%">' + playStatChar + '</span>';
    }

    if (remixStr != "")
    remixStr = '(' + remixStr + ')';

	$('#track_title p').html(playStatStr + ' <font size="+1">' + MIX_DATA.Tracks[currentIndex].Artist + ' </font><sub> ' + MIX_DATA.Tracks[currentIndex].Title + ' ' + remixStr + '</sub>');
    $('#current_track').html('<span style="color:#fff">TRK ' + (currentIndex + 1) + '</span>/<font size="+1">' + MIX_DATA.Tracks.length + '</font>');
    $("#track_map_list li:eq(" + currentIndex + ") div").css('background', '#3a3a3a');
	$("#track_list ol>li").removeClass("playing");
	$("#track_list ol>li:eq(" + currentIndex +")").addClass("playing");
	//$("#track_list").animate({scrollTop: $("#track_list ol>li:eq(" + currentIndex + ")").offset().top-0},500);
    
 	//scrollIntoView("#track_list ol>li:eq(" + currentIndex + ")", "#track_list");
	var element = $("#track_list ol>li:eq(" + currentIndex +")");
	var container = $("#track_list");
	//scrollIntoView(element, container);
	
    if (s.playState != 0) {
        document.title = playStatChar + " [" + (CURRENT_TRACK + 1) + "/" + MIX_DATA.Tracks.length + "] " + MIX_NAME;
        // to change the title to the play button
    } else {
        document.title = playStatChar + " " + MIX_NAME;
    }

	setTrackEndpoints();
	
    /*	
	var marker_scale = s.position/s.duration;	
	var playDiv = $('#track_map_play_overlay');
	var setWidth = Math.round(TRACK_MAP_WIDTH*marker_scale)-parseInt(playDiv.css("borderLeftWidth"),10)-parseInt(playDiv.css("borderRightWidth"),10);
	if (setWidth < 0) 
		setWidth = 0;	
	playDiv.css('width', setWidth);*/
};

/* 
 *	scrollIntoView
 *	------------
 *  Helper function to scroll an element into view if hidden in an overflow
 *	
 */

function scrollIntoView(element, container) {
  var containerTop = container.scrollTop(); 
  var containerBottom = containerTop + container.height(); 
  var elemTop = element.offset().top;
  var elemBottom = elemTop + element.height(); 
//	alert(elemTop);
  if (elemTop < containerTop) {
    container.animate({scrollTop:elemTop},1000);
	//alert("firing");
  } else if (elemBottom > containerBottom) {
    container.animate({scrollTop:(elemBottom - container.height())}, 1000);
	//alert("other firing");
  }
};

/* 
 *	updateRollOverPlaying
 *	------------
 *  Updates the current track playing field mainly used for mouseover operations on the track map
 *	
 */

function updateRollOverPlaying(position) {
    var currentIndex = currentTrack(position);
    var remixStr = MIX_DATA.Tracks[currentIndex].Remix;

    if (remixStr != "")
    remixStr = '(' + remixStr + ')';

    if (CURRENT_TRACK != currentIndex)
    $('#track_title').html('<p style="color:#424242"><font size="+1">' + MIX_DATA.Tracks[currentIndex].Artist + ' </font><sub> ' + MIX_DATA.Tracks[currentIndex].Title + remixStr + '</sub></p>');
    else
    updateNowPlaying();

};


/* 
 *	stop
 *	------------
 *  wrapper function to stop all soundManager instances
 *	
 */

function stop() {
    soundManager.stopAll();
};


/* 
 *  displayTrackOverlay
 *	------------
 *  UI to ease in the track_map_list when the track list is displayed
 *	
 */

function displayTrackOverlay() {
    var s = soundManager.getSoundById('fp90');

    if ($('#track_map_list').is(':hidden')) {
        $('#track_map_list').fadeIn(300);
        $('#track_list').fadeIn(300);
    } else {
        $('#track_map_list').fadeOut(300);
        $('#track_list').fadeOut(300);
    }

};


/* 
 *	mute
 *	------------
 *  toggles the mute feature on and off
 *	
 */

function mute() {
    var s = soundManager.getSoundById('fp90');
    clearTimeout(TIME_OUT);

    if (!s.muted) {
        $("#popup_message").text('MUTE ON');
    } else {
        $("#popup_message").text('MUTE OFF');
    }

    $("#popup_message").fadeIn(25);
    TIME_OUT = window.setTimeout(function() {
        $("#popup_message").fadeOut(300);
    },
    300);

    s.toggleMute();
};


/* 
 *	setTrackBreaks
 *	------------
 *  After the read of the JSON, it places all of the time markers for each track break via onposition
 *	
 */

function setTrackBreaks() {
    var s = soundManager.getSoundById('fp90');
    var x;
    var currentIndex;

    soundManager._writeDebug('In setTrackBreaks();');

    if (MIX_DATA != "") {
        for (x in MIX_DATA.Tracks) {
            soundManager._writeDebug('Setting onPosition for track #' + x);
            s.onPosition(MIX_DATA.Tracks[x].StartTime + 50,
            	function(eventPosition) {
                	// 50 offset to be out of Loop onposition way
                	updateNowPlaying();		// update GUI elements
					
           	});
        }
    }
};


/* 
 *	setTrackList
 *	------------
 *  Creates the html for the tracklist after the read of the JSON
 *	
 */

function setTrackList() {
    var s = soundManager.getSoundById('fp90');
    var tracksHTML = '';
    var remixStr = '';
    var classColor = 'odd';

    if (MIX_DATA != "") {
        for (x = 0; x < MIX_DATA.Tracks.length; x++) {
            remixStr = MIX_DATA.Tracks[x].Remix;
            if (remixStr != "") {
                remixStr = '(' + remixStr + ')';
            }
            if ((x % 2) === 1) {
                classColor = 'even';
            } else {
                classColor = 'odd';
            }
            tracksHTML += '<li class="' + classColor + '">' + MIX_DATA.Tracks[x].Artist + ' <sub> ' + MIX_DATA.Tracks[x].Title + ' ' + remixStr + '</sub></li>';
        }
    }

    $('#track_list ol').html(tracksHTML);

    // Bind click functionality to the individual tracks to control play	
    $('#track_list ol li').click(function(e) {
        var s = soundManager.getSoundById('fp90');
        var track_index = $('#track_list ol li').index(this);
        var newTrack = (track_index !== currentTrack(s.position));

        //alert(track_index + ' ' + newTrack);
        if ((track_index < 0) || (track_index > MIX_DATA.Tracks.length)) {
            // error checking for runoff
            return;
        }

        if (s.loaded) {
            // must be loaded
            if (LOOP_ON && newTrack) {
                s.clearOnPosition(LOOP_POSITION);
            }

            soundManager.setPosition('fp90', MIX_DATA.Tracks[track_index].StartTime);
            updateNowPlaying(s.position);
            if (LOOP_ON && newTrack) {
                curTrackLoop(1);
            }
        }
    });

};


/* 
 *	setTrackDivs
 *	------------
 *  Creates the track divs for the shapes within the mix as part of the track map
 *	
 */

function setTrackDivs() {
    var s = soundManager.getSoundById('fp90');
    var tracksHTML = '';
    var nextBreak = 0;
    var pixelCount = 0;
    var totalPixels = 0;
    var padding = 8;

    if (MIX_DATA != "") {
        for (x = 0; x < MIX_DATA.Tracks.length; x++) {
            //alert(MIX_DATA.Duration);
            //alert(Math.round(TRACK_MAP_WIDTH*(MIX_DATA.Tracks[x+1].StartTime - MIX_DATA.Tracks[x].StartTime)/MIX_DATA.Duration));
            if (x == MIX_DATA.Tracks.length - 1) {
                nextBreak = MIX_DATA.Duration;
            } else {
                nextBreak = MIX_DATA.Tracks[x + 1].StartTime;
            }
            pixelCount = Math.round((TRACK_MAP_WIDTH - padding) * (nextBreak - MIX_DATA.Tracks[x].StartTime) / MIX_DATA.Duration);
            totalPixels += pixelCount;

            if (totalPixels > (TRACK_MAP_WIDTH - padding)) {
                pixelCount -= (totalPixels - (TRACK_MAP_WIDTH - padding));
            }
            tracksHTML += '<li><div id="' + '" style="width:' + pixelCount + 'px">' + (x + 1) + '</div></li>';
        }
    }

    $('#track_map_list').html(tracksHTML);
};



/* 
 *	displayFlagIcon
 *	------------
 *  Chooses the right flag icon to display relative to the JSON selection
 *	Will need to continue to add to this as we add more countries
 *
 */

function displayFlagIcon(country) {
    var pixelOffset = 0;
    var pixelStep = 24;

    switch (country) {
    case "USA":
        break;
    case "France":
        pixelOffset = ( - 2 * pixelStep);
        break;
    case "Sweden":
        pixelOffset = ( - pixelStep);
        break;
    default:
        break;
    }
    $(".country_icon").css({
        'background-position':
        '0px ' + pixelOffset + 'px',
        'right': '' + 'px'
    });
};


/* 
 *	introCountdown
 *	------------
 *  Begins the loading operations of the track to buffer a little bit (3s) and then displays the popup screens
 *	
 */

function introCountdown() {
    var s = soundManager.getSoundById('fp90');
    var countdown = 3;
    var started = false;

    $('#fpump_container').css('background-color', '#fff');
    $('#track_map_load_overlay').css('display', 'block');
    $('#popup_message').removeClass('hovered');

    // Preload sound for the 3 seconds
    s.load({
        whileloading: function() {
            var loadDiv = $('#track_map_load_overlay');
            loadDiv.css('width', (TRACK_MAP_WIDTH - parseInt(loadDiv.css("borderLeftWidth"), 10) - parseInt(loadDiv.css("borderRightWidth"), 10)) * this.bytesLoaded / this.bytesTotal);
            $('#track_map_container p').text('LOADING ' + Math.round(this.bytesLoaded / this.bytesTotal * 100) + '%');
        },
        onload: function() {
            $('#track_map_container p').fadeOut(300);
            setTrackBreaks();
        }
    });

    // Flash the Screen and Coundown from 3, 2, 1
    for (var i = countdown; i > 0; i--) {
        window.setTimeout(function() {
            $('#fpump_container').fadeTo(25, 0.80).delay(15).fadeTo(25, 0.15);
            $("#popup_message").css('display', 'inline-block');
            $("#popup_message").text(countdown);
            $("#popup_message").fadeOut(300);
            countdown--;
        },
        (1000 * (3 - i)));
    }

    // Play Track!
    window.setTimeout(function() {
        for (var i = 0; i < 15; i++) {
            $('#fpump_container').fadeTo(25, 0.8).delay(15).fadeTo(25, 0.15);
        }
        $("#popup_message").css('display', 'inline-block');
        $("#popup_message").text('NOW PLAYING');
        $("#popup_message").fadeOut(3000);
        $('#stop_watch').fadeIn(3000);
        $('#trk_loop').fadeIn(3000);
        $('.player_controls').fadeIn(3000);
		window.setTimeout(function() { 
			displayTrackOverlay();
			$('#track_title p').fadeIn(300);	
		}, 3000);
        
        cloobPlay();
    },
    1000 * (countdown));
};


/* 
 *	newMixLocation
 *	------------
 *  takes a location from master track map and starts playing on that new location
 *	
 */

function newMixLocation(e) {
	var s = soundManager.getSoundById('fp90');
	var duration = 0;
	var newTrack = false;

	if (s.loaded) {
	    // only allow fast forwarding after finished loading
	    duration = s.duration;

	    var offset = $('#track_map_container').offset();
	    //alert(offset.left);
	    var x = offset.left;
	    var newX = e.pageX - x;

	    //check for pixel runoff
	    if (newX > TRACK_MAP_WIDTH)
	    newX = TRACK_MAP_WIDTH;
	    if (newX < 0)
	    newX = 0;

	    position = Math.round(newX / TRACK_MAP_WIDTH * duration);
	    newTrack = (CURRENT_TRACK != currentTrack(position));

	    var playDiv = $('#track_map_play_overlay');
	    var setWidth = Math.round(newX) - parseInt(playDiv.css("borderLeftWidth"), 10) - parseInt(playDiv.css("borderRightWidth"), 10);
	    if (setWidth < 0)
	    setWidth = 0;
	    playDiv.css('width', setWidth);

	    if (LOOP_ON && newTrack)
	    s.clearOnPosition(LOOP_POSITION);

	    soundManager.setPosition('fp90', position);
	    updateNowPlaying(position);
	    if (LOOP_ON && newTrack)
	    curTrackLoop(1);
	}
};

/* 
 *	newTrackLocation
 *	------------
 *  takes a location from single track map and starts playing on that new location
 *	
 */

function newTrackLocation(e) {
	var s = soundManager.getSoundById('fp90');
	var duration = TRACK_ENDPOINTS.end - TRACK_ENDPOINTS.start;

	if (s.loaded) {
	    // only allow fast forwarding after finished loading

	    var offset = $('#track_map_container').offset();
	    //alert(offset.left);
	    var x = offset.left;
	    var newX = e.pageX - x;

	    //check for pixel runoff
	    if (newX > TRACK_MAP_WIDTH) {
	    	newX = TRACK_MAP_WIDTH;
		}
	    if (newX < 0) {
	    	newX = 0;
		}

	    var playDiv = $('#track_single_play_overlay');
	    var setWidth = Math.round(newX) - parseInt(playDiv.css("borderLeftWidth"), 10) - parseInt(playDiv.css("borderRightWidth"), 10);
	    if (setWidth < 0) {
	    	setWidth = 0;
		}
	    playDiv.css('width', setWidth);

	    e.pageX = Math.round(TRACK_MAP_WIDTH * (TRACK_ENDPOINTS.start + (newX / TRACK_MAP_WIDTH * duration))/s.duration)+x;	
		newMixLocation(e);
	}
};

/* 
 *	Document Ready Functions
 *	------------
 *  sets the functions for mousemove over the track maps; clicks for selecting tracks
 *	
 */

jQuery(document).ready(function() {
    $("#track_map_play_overlay, #track_mix_container").mousemove(function(e) {
        var s = soundManager.getSoundById('fp90');
        if (s.loaded) {
            var s = soundManager.getSoundById('fp90');
            var offset = $('#track_map_container').offset();
            var x = offset.left;
            var newX = e.pageX - x;
            //updateRollOverPlaying(Math.round(newX / TRACK_MAP_WIDTH * s.duration));
            // need to handle this well while it's loading
			$('#track_mix_cursor').css('left', newX);
        }
    });
    $("#track_single_play_overlay, #track_single_container").mousemove(function(e) {
        var s = soundManager.getSoundById('fp90');
        if (s.loaded) {
            var s = soundManager.getSoundById('fp90');
            var offset = $('#track_single_container').offset();
            var x = offset.left;
            var newX = e.pageX - x;
            //updateRollOverPlaying(Math.round(newX / TRACK_MAP_WIDTH * s.duration));
            // need to handle this well while it's loading
			$('#track_single_cursor').css('left', newX);
        }
    });

/*    $("#track_map_play_overlay, #track_mix_container").mouseout(function(e) {
        var s = soundManager.getSoundById('fp90');
        //if (s.loaded) {
           // updateNowPlaying();
			//$('#track_mix_cursor').css('display','none');
      //  }
    });*/
	$("#track_mix_container").mouseleave (function(e) {
        var s = soundManager.getSoundById('fp90');
        if (s.loaded) {
           $('#track_mix_cursor').css('display','none');
        }
    });
	$("#track_single_container").mouseleave (function(e) {
        var s = soundManager.getSoundById('fp90');
        if (s.loaded) {
           $('#track_single_cursor').css('display','none');
        }
    });	
    $("#track_map_play_overlay, #track_mix_container").click(function(e) {
		newMixLocation(e);
    });
    $("#track_map_play_overlay, #track_mix_container").mouseenter(function(e) {
		$('#track_mix_cursor').css('display','block');
    });
    $("#track_single_play_overlay, #track_single_container, #track_title").mouseenter(function(e) {
		$('#track_single_cursor').css('display','block');
    });
    $("#track_single_play_overlay, #track_single_container").click(function(e) {
		newTrackLocation(e);
    });
});


/* 
 *	Document Ready Functions
 *	------------
 *  sets the functions for keystroke commands 
 *  sets GUI initial conditions 
 *  binds functions to GUI elements
 *  reads in relevant data from JSON adapter
 *	
 */

$(document).ready(function() {

    $(document).keydown(function(e) {
        s = soundManager.getSoundById('fp90');

        //alert(e.which);
        switch (e.which) {

        case 80:
			if(!FPUMP_STATUS) {
				break;
			}
            // 'p' is for pump
            if ($('#fpump a').hasClass('active'))
            $('#fpump a').removeClass('active');
            else
            $('#fpump a').addClass('active');
            fistPump();
            break;
        case 32:
            // for spacebar for play/pause
            e.preventDefault();
            if (s.playState === 1 && !s.paused) {
                cloobPause();
            } else if (s.playState === 0) {
                introCountdown();
            } else {
                cloobPlay();
            }
            break;
        case 190:
            // for > same as right arrow
            scrub(1);
            break;
        case 39:
            // right arrow
            nextTrack();
            break;
        case 188:
            // for < same as left arrow
            scrub( - 1);
            break;
        case 37:
            // left arrow
            previousTrack();
            break;
        case 76:
            // 'l' is for loop
            if (LOOP_ON)
            clearLoop();
            else
            curTrackLoop();
            break;
        case 77:
            // 'm' is for mute
            mute();
            break;
        case 75:
            // 'k' is for keyboard shortcuts tooltip
            if ($('#key_shortcuts span').is(':hidden')) {
                $('#key_shortcuts span').addClass("hovered").removeClass("unhovered");
            } else {
                $('#key_shortcuts span').removeClass("hovered").addClass("unhovered");
                //$('#key_shortcuts:hover span').css('display', 'block');
            }
            break;
        case 84:
            // 't' is for track information
            displayTrackOverlay();
            break;
        default:
            //alert(e.which);
            break;
        }
    });

    $(document).keyup(function(e) {
        switch (e.which) {
        case 80:
            // 'p' is for pump
			if(!FPUMP_STATUS) {
				break;
			}
            $('#fpump a').removeClass('active');
            break;
        }
        //alert(e.which);
    });

	
    // Start State Settings
    $('#popup_message').css('display', 'inline-block');
    //$('#popup_message').hover(function() {$('#popup_message').addClass('hovered')});
    $('.popup_click').live('click',
    function(e) {
        e.preventDefault();
        $('#popup_message').removeClass('hovered').addClass('unhovered');
        introCountdown();
    });
    $('#fpump_container').css('opacity', '1');
    $('#fpump_container').css('background-color', '#232323');
    $('#stop_watch').css('display', 'none');
    $('#trk_loop').css('display', 'none');
    $('#track_map_list').css('display', 'none');
    $('#track_map_load_overlay').css('display', 'none');
    $('#track_title p').css('display', 'none');
    $('.player_controls').css('display', 'none');


    $('.playbutton a').live('click',
    function(e) {
        e.preventDefault();
        cloobPlay();
    });

    $('.pausebutton a').live('click',
    function(e) {
        e.preventDefault();
        cloobPause();
    });

    $('.loopbuttonOff a').live('click',
    function(e) {
        e.preventDefault();
        curTrackLoop();
    });

    $('.loopbuttonOn a').live('click',
    function(e) {
        e.preventDefault();
        clearLoop();
    });

    $('.previous_track a').live('click',
    function(e) {
        e.preventDefault();
        previousTrack();
    });

    $('.next_track a').live('click',
    function(e) {
        e.preventDefault();
        nextTrack();
    });

    $('#fpump a').bind("contextmenu",
    function(e) {
        return false;
    });

    $('#fpump').draggable({
        containment: "#track_map_graph",
        snap: "#fpump_container",
        snapMode: "inner",
        handle: "#fpump_drag"
    });
    $('#fpump a').mousedown(function() {
        //$(this).attr('border', '1px solid red');
        fistPump();

    });

    $('#fpump a').click(function(e) {
        e.preventDefault();
        // prevents the # to go to the top
    });

/*	$('#track_map_play_overlay').slider({
		range:"min",
		min:1,
		max:960,
		slide: function(event, ui) {
			newPlayLocation(ui.value);
		}
		
	});
	
	*/

    $.getJSON(JSON_FILE,
    function(data) {
        // EDIT THIS LINE FOR LIVE SITE
        //alert(data); //uncomment this for debug
        //alert (data.item1+" "+data.item2+" "+data.item3); //further debug
        MIX_DATA = data;
        $('#dash_title_block > h2').text(MIX_DATA.MixName);
        $('#dash_artist_block > h3').text(MIX_DATA.Artist);
        displayFlagIcon(MIX_DATA.Country);
        $('#time_remaining').text('- ' + convertTime(MIX_DATA.Duration));
        $('#current_track').html('<span style="color:#fff"><font size="+1">TRK 1</font></span>/<font size="-1">' + MIX_DATA.Tracks.length + '</font>');
        MIX_NAME = MIX_DATA.MixName;
        $('#album_art').css('background-image', 'url(' + MIX_DATA.MixArt + ')');
        setTrackDivs();
        setTrackList();
		setTrackEndpoints();
        //$('#track_title').html("<p>Mix="+data.MixName+"</p><p>Artist="+data.Artist+"</p><p>Track #1="+data.Tracks[0].Title+"</p>");
    });

    //$('#track_title').html("<p>Mix="+MIX_DATA.MixName+"</p><p>Artist="+MIX_DATA.Artist+"</p><p>Track #1="+MIX_DATA.Tracks[0].Title+"</p>");
});


/* 
 *	Random messaging functions for the title bar
 *	------------
 *  Not really working yet.
 *	
 */

/*
var rev = "fwd";
function titlebar(val)
 {
    var msg = "Your message here *** hscripts.com";
    var res = " ";
    var speed = 50;
    var pos = val;

    msg = "   |--- " + msg + " ---|";
    var le = msg.length;
    if (rev == "fwd") {
        if (pos < le) {
            pos = pos + 1;
            scroll = msg.substr(0, pos);
            document.title = scroll;
            timer = window.setTimeout("titlebar(" + pos + ")", speed);
        }
        else {
            rev = "bwd";
            timer = window.setTimeout("titlebar(" + pos + ")", speed);
        }
    }
    else {
        if (pos > 0) {
            pos = pos - 1;
            var ale = le - pos;
            scrol = msg.substr(ale, le);
            document.title = scrol;
            timer = window.setTimeout("titlebar(" + pos + ")", speed);
        }
        else {
            rev = "fwd";
            timer = window.setTimeout("titlebar(" + pos + ")", speed);
        }
    }
}

titlebar(0);
*/