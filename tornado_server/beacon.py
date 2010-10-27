#!/usr/bin/env python
# encoding: utf-8
"""
beacon.py

Created by Ethan Kaplan on 2010-10-27.
Copyright (c) 2010 __MyCompanyName__. All rights reserved.
"""

import sys
import os
import tornado.web
import simplejson
from tornad_io import SocketIOHandler
from tornad_io import SocketIOServer
from multiprocessing import Pool, Queue
import time


participants = set()

def main():
    pass

class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")


def somefunc():
    time.sleep(5)
    return os.getpid()

class BeaconHandler(SocketIOHandler):
    @tornado.web.asynchronous
    def on_open(self,*args,**kwargs):
       
        participants.add(self)
        p = self.application.settings.get('pool')
        p.apply_async(somefunc,callback = self.async_callback(self.on_getpid))
    
    def on_getpid(self,pid):
        self.send(str(pid))
        data = {}
        data['session'] = self.session.id
        self.send(simplejson.dumps(data))
    
    def on_message(self,message):
        print message
        if (message == "test"):
            self.send("got your test")
            
    def on_close(self):
        participants.remove(self)
        for p in participants:
            p.send("Someone has left)")


beaconRoute = BeaconHandler.routes("socket.io/*")

application = tornado.web.Application(
    [(r"/", IndexHandler), beaconRoute], 
    enabled_protocols = ['websocket', 'flashsocket', 'xhr-multipart', 'xhr-polling'],
    flash_policy_port = 8043,
    socket_io_port = 8889, pool = Pool(4), queue=Queue()
)

if __name__ == '__main__':
    socketio_server = SocketIOServer(application)

