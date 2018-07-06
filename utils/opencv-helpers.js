const cv= require('opencv4nodejs');

class OpencvHelpers {

	constructor() {
		this.camFps = 10;
		this.camInterval = Math.ceil(1000 / this.camFps)
	}

	grabFrames(videoFile, delay, onFrame) {
		const cap = new cv.VideoCapture(videoFile);
		let done = false;
		const intvl = setInterval(() => {
			let frame = cap.read();
			// loop back to start on end of stream reached
			if (frame.empty) {
				cap.reset();
				frame = cap.read();
			}
			onFrame(frame);

			const key = cv.waitKey(delay);
			done = key !== -1 && key !== 255;
			if (done) {
				clearInterval(intvl);
				console.log('Key pressed, exiting.');
			}
		}, this.camInterval);
	}

	drawRect(image, rect, color, opts = { thickness: 2 }){
		image.drawRectangle(
			rect,
			color,
			opts.thickness,
			cv.LINE_8
		);
	}

	drawBlueRect(image, rect, opts = {
			thickness: 2
	}) {
		this.drawRect(image, rect, new cv.Vec(255, 0, 0), opts);
	}

	runVideoFaceDetection(src, detectFaces, socketIO) {
		this.grabFrames(src, 1, (frame) => {
			const frameResized = frame.resizeToMax(320);

			// detect faces
			const faceRects = detectFaces(frameResized);
			if (faceRects.length) {
				// draw detection
				faceRects.forEach(faceRect => this.drawBlueRect(frameResized, faceRect));
			}
			socketIO.emit('face', {
				buffer: cv.imencode('.jpg', frameResized)
			});
			
		});
	}
}

module.exports = new OpencvHelpers();
