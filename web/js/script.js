/* Author: 

*/

//Copyright (c) 2010 Nicholas C. Zakas. All rights reserved.
//MIT License



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

// Activity Object
function Activity() {
    this.id = '';
    this.activity = '';
    this.datetime = new Date().getTime();
    
}

Activity.prototype.getActivity = function() {
    var activity = {};
    activity['id'] = this.id;
    activity['activity'] = this.activity;
    activity['timedate'] = this.datetime;
    return activity;
}


$(document).ready(function() {
    var activityStore = new ActivityQueue();
    var map = 
        {
            'testtag':'test activity',
            'tester':'test acrtivity2'
            
        }
    
    log('document ready');

    
    // Event binding for the tagged ID's
    $.each(map, function(key,value) {
        $('#'+key).click(function() {
            var activity = new Activity();
            activity.id = key;
            activity.activity = value;
            activityStore.addToQueue(activity.getActivity());
            
            
            });
        
    });
    

    
    
    // activity added listener    
    activityStore.addListener("activity_pushed",function(event) {
        log("activity " + event['activity'].id);
        $('#events').prepend('<span style="display:none">'+event['activity'].timedate + ' ' +event['activity'].id+'</span><br/>');
        $('#events').children(':first').fadeIn('slow');
    })
    


});


















