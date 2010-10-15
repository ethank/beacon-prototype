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


var ActivityLogger = {
    start_time: 0,
    last_activity: 0,
    ping_url: "",
    activity_queue: ActivityQueue(),
    
    start: function(map) {
        // setup the logger
        ActivityLogger.start_time = new Date().getTime();
        ActivityLogger.last_activity = ActivityLogger.start_time;
        
        var updateLastActivity = function() {
            ActivityLogger.last_activity = new Date().getTime();
        };
        // setup the queue
        ActivityLogger.activity_queue = new ActivityQueue();
        
        // setup the mapping of activities to events
        $.each(map, function(key,value) {
            $('#'+key).click(function() {
                var activity = new Activity();
                activity.id = key;
                activity.activity = value;
                ActivityLogger.activity_queue.addToQueue(activity.getActivity());
                updateLastActivity();
                
                });

        });
        // ensure that before unloading, we send an exit event
        var beforeUnload = function() {
            var exit_activity = new Activity();
            exit_activity.id = 'exit';
            exit_activity.activity = 'exit page';
            ActivityLogger.ping('exit');
        }
        
        window.addEventListener('beforeunload', beforeUnload, false);
        
        ActivityLogger.ping();
        
    }
    
}

ActivityLogger.ping = function(event) {
    
}

ActivityLogger.getActivityQueue = function() {
    return ActivityLogger.activity_queue;
}
