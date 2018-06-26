'use strict';
const cv = require('opencv4nodejs');

const detectWebcamFace = require('./webcam-detect');


class Routes{

	constructor(app,socket){
		this.app = app;
		this.io = socket;

		/* 
			Array to store the list of users along with there respective socket id.
		*/
		this.users = []; 

		this.rooms = [];
	}


	appRoutes(){

		this.app.get('/', (request,response) => {
			response.render('index');
		});

	}

	socketEvents(){	

		this.io.on('connection', (socket) => {
			detectWebcamFace.startDetectFaces(this.io);
		});

		

	}

	routesConfig(){
		this.appRoutes();
		this.socketEvents();
	}
}
module.exports = Routes;