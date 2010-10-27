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
import pickle

participants = set()

def main():
    pass

class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")


class BeaconHandler(SocketIOHandler):
    def on_open(self,*args,**kwargs):
        data = {}
        data['session'] = self.session.id
        self.send(simplejson.dumps(data))
        participants.add(self)
    
    def on_message(self,message):
        print message
            
    def on_close(self):
        participants.remove(self)
        for p in participants:
            p.send("Someone has left)")


beaconRoute = BeaconHandler.routes("socket.io/*")

application = tornado.web.Application(
    [(r"/", IndexHandler), beaconRoute], 
    enabled_protocols = ['websocket', 'flashsocket', 'xhr-multipart', 'xhr-polling'],
    flash_policy_port = 8043,
    socket_io_port = 8889
)

if __name__ == '__main__':
    socketio_server = SocketIOServer(application)

