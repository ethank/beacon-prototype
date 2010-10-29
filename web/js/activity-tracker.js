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
        // setup the queue
        ActivityLogger.activity_queue = new ActivityQueue();

        // Setup SocketIO
        
        var socket = new io.Socket('10.138.188.31',{'port':'8889'});
        socket.connect();
        socket.on('connect',function() {log('connected')});
        socket.on('message',function(message) {
            log(message);
        });
        socket.send('test');
        this.socket = socket;
        
        // setup the logger
        ActivityLogger.start_time = new Date().getTime();
        
        // Log start activity
        var startactivity = new Activity();
        startactivity.id = document.title.slice(0,50);
        startactivity.activity = "start on load";
        this.logActivity(startactivity);
        
        ActivityLogger.last_activity = ActivityLogger.start_time;
        
        var updateLastActivity = function() {
            ActivityLogger.last_activity = new Date().getTime();
        };

        // setup the mapping of activities to events
        
        
        $.each(map, function(key,value) {
            var updateFunction = function() {
                    var activity = new Activity();
                    activity.id = key + ":" + value['event'];
                    activity.activity = value['activity'];
                    ActivityLogger.logActivity(activity);
                    updateLastActivity();

                    };
            
            // key = the ID or window/document
            // value contains bind event + activity
            
            if (key == 'window') {
                $(window).bind(value['event'],updateFunction);
            }
            else if (key == 'document') {
                $(document).bind(value['event'],updateFunction);
            }
            else {
                $('#'+key).bind(value['event'],updateFunction);
            }
            
            

        });
        // ensure that before unloading, we send an exit event
        var beforeUnload = function() {
            var exit_activity = new Activity();
            exit_activity.id = 'exit';
            exit_activity.activity = 'exit page';
            ActivityLogger.ping('exit');
            socket.close();
        }
        
        window.addEventListener('beforeunload', beforeUnload, false);
       // window.setTimeout(ActivityLogger.ping,3000);
        
        
        ActivityLogger.ping();
        
    }
    
}


// sends the activities
ActivityLogger.ping = function() {
    if (ActivityLogger.activity_queue.activities.length >0) {
        ActivityLogger.socket.send(JSON.stringify(ActivityLogger.activity_queue.activities));
        ActivityLogger.activity_queue.activities = [];
    }
    setTimeout(ActivityLogger.ping,3000);
    
}


// Log an activity
ActivityLogger.logActivity = function(activity) {
    this.activity_queue.addToQueue(activity.getActivity());
}



ActivityLogger.getActivityQueue = function() {
    return ActivityLogger.activity_queue;
}

