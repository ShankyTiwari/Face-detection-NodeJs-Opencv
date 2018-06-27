const cv= require('opencv4nodejs');

class OpencvHelpers {

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
		}, 0);
	}

	drawBlueRect(image, rect, opts = {
			thickness: 2
	}) {
		drawRect(image, rect, new cv.Vec(255, 0, 0), opts);
	}

	runVideoFaceDetection(src, detectFaces, socketIO) {
		this.grabFrames(src, 1, (frame) => {
			const frameResized = frame.resizeToMax(800);

			// detect faces
			const faceRects = detectFaces(frameResized);
			if (faceRects.length) {
				// draw detection
				faceRects.forEach(faceRect => drawBlueRect(frameResized, faceRect));
			}
			socketIO.emit('face', {
				buffer: cv.imencode('.jpg', frameResized)
			});
			
		});
	}
}

module.exports = new OpencvHelpers();
