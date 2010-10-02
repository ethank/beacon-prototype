/* Author: 

*/

function ActivityQueue() {
    this.activities =- new Array();
    
    this.ActivityQueue =function() {
        this.activities = new Array();
    }
    
    this.addToQueue =  function(activity) {
        this.activities.push(activity);
    }
    
    this.getFromQueue = function() {
        return this.activities.pop();
    }
    
}

function Activity() {
    this.id = '';
    this.activity = '';

    
    
    this.Activity = function() {
        this.datetime = new Date.getTime();
    }
    
    this.getActivity = function() {
        var activity = {};
        activity['id'] = this.id;
        activity['activity'] = this.activity;
        activity['timedate'] = this.datetime;
        return activity;
    }
}

$(document).ready(function() {
    var activityStore = new ActivityQueue();
    var map = 
        {
            'testtag':'test activity',
            'tester':'test acrtivity2'
            
        }
    
    log('document ready');

    $.each(map, function(key,value) {
        $('#'+key).click(function() {
            var activity = new Activity();
            activity.id = key;
            activity.activity = value;
            activityStore.addToQueue(activity.getActivity());
            
            
            });
        
    });
    
    
    


});


















