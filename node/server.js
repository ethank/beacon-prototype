var sys = require('sys'),
    http = require('http'),
    crypto = require('crypto'),
    json = JSON.stringify,
    log = sys.puts,
    io = require('socket.io');
    
    // for npm, otherwise use require('./path/to/socket.io') 


var requestHandler = function(request,response) {
    response.writeHeader(200, {'Content-Type': 'text/html'}); 
    response.write('<h1>Hello world</h1>'); 
    response.end();
    
    
}

server = http.createServer().addListener('request',requestHandler);


server.listen(8000);
  
// socket.io 
var socket = io.listen(server);
socket.on('connection', function(client){ 
   client.send(json([client.sessionId,'connected']));
   client.broadcast(json([client.sessionId,'connected']));

  // new client is here! 
  client.on('message', function(message){
      try {
          request = JSON.parse(message);
      }
      catch (SyntaxError) {
          log('Invalid JSON');
          log(message);
          return false;
      }
      log(JSON.stringify(request));
      request.clientId = client.sessionId;
      client.broadcast(json(request));
      
      
      
  }) 
  client.on('disconnect', function(){
  
    client.broadcast(json({'id':client.sessionId,'action':'close'}));
      
  }) 
});