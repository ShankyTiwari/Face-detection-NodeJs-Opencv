'use strict';
const cv = require('opencv4nodejs');

const detectWebcamFace = require('./webcam-detect');
const opencvHelpers = require('./opencv-helpers');


class Routes{

	constructor(app,socket){
		this.app = app;
		this.io = socket;
	}

	appRoutes() {
		this.app.get('/', (request, response) => {
			response.render('index');
		});

		this.app.get('/image-face-detect', (request, response) => {
			response.render('image-face-detect');
		});
		
		this.app.get('/webcam-face-detect', (request, response) => {
			response.render('webcam-face-detect');
		});

		this.app.get('/detect-faces', (request, response) => {
			opencvHelpers.detectFace()
				.then((result) => {
					response.statusCode = 200;
					response.send(result);
					response.end();
				}).catch((err) => {
					response.statusCode = 500;
					response.send(null);
					response.end();
				});
		});
	}

	socketEvents(){
		this.io.on('connection', (socket) => {
			detectWebcamFace.startDetectFaces((buffers) => {
				this.io.emit('face', {
					buffer: buffers
				});
			});
		});
	}

	routesConfig(){
		this.appRoutes();
		this.socketEvents();
	}
}
module.exports = Routes;