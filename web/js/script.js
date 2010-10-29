/* Author: 

*/

//Copyright (c) 2010 Nicholas C. Zakas. All rights reserved.
//MIT License


/**
// Activity Queue Object
function ActivityQueue() {
    EventTarget.call(this);
    this.activities = new Array();
    
}


ActivityQueue.prototype = new EventTarget();
ActivityQueue.prototype.constructor = ActivityQueue;


ActivityQueue.prototype.addToQueue =  function(activity) {
    this.activities.push(activity);
    this.fire({type:"activity_pushed",activity:activity});
}

ActivityQueue.prototype.getFromQueue = function() {
    return this.activities.pop();
}

**/



$(document).ready(function() {
    /**
        mapp is:
        
        key -> {event (ie, click, scroll, mouse move), activity}
    */
    //$(window).resize(function() {alert('resized')});
    
    var map = 
        {
            'testtag':{'activity':'test activity', 'event':'click'},
            'tester':{'activity':'test acrtivity2','event':'click'},
            'window':{'activity':'double clicked','event':'dblclick'}
            
        }
    
    ActivityLogger.start(map);

    // Debugging
    ActivityLogger.getActivityQueue().addListener("activity_pushed",function(event) {
        log("activity " + event['activity'].id + " / " + event['activity'].activity);
    });


});


















