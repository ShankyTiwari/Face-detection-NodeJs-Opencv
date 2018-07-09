const cv = require('opencv4nodejs');
const path = require('path');

class OpencvHelpers {

	constructor() {
		this.camFps = 10;
		this.camInterval = Math.ceil(1000 / this.camFps)
	}


	getDataFilePath(fileName) {
		return path.resolve(path.resolve(__dirname, '../data'), fileName);
	}

	drawRect(image, rect, color, opts = {
		thickness: 2
	}) {
		image.drawRectangle(
			rect,
			color,
			opts.thickness,
			cv.LINE_4
		);
	}

	drawBlueRect(image, rect, opts = {
		thickness: 2
	}) {
		this.drawRect(image, rect, new cv.Vec(250, 0, 0), opts);
	}

	 detectFace() {
		return new Promise( (resolve, reject) => {
			try {
				const image = cv.imread(this.getDataFilePath('g.r.l.jpeg'));
				const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

				// detect faces
				const {
					objects,
					numDetections
				} = classifier.detectMultiScale(image.bgrToGray());

				if (!objects.length) {
					throw new Error('No faces detected!');
				}

				// draw detection
				const numDetectionsTh = 10;
				objects.forEach((rect, i) => {
					const thickness = numDetections[i] < numDetectionsTh ? 1 : 2;
					this.drawBlueRect(image, rect, {
						thickness
					});
				});
				
				this.saveFaceDetectedImage(image);
				
				resolve(cv.imencode('.jpg', image));
				
			} catch (error) {
				console.log(error);
				reject(null);
			}
		});
	}

	saveFaceDetectedImage(data) {
		cv.imwrite(this.getDataFilePath('g.r.l2.jpeg'), data)
	}

	grabFrames(videoFile, onFrame) {
		const cap = new cv.VideoCapture(videoFile);
		setInterval(() => {
			let frame = cap.read();
			// loop back to start on end of stream reached
			if (frame.empty) {
				cap.reset();
				frame = cap.read();
			}
			onFrame(frame);
		}, this.camInterval);
	}

	runVideoFaceDetection(src, detectFaces, callback) {
		this.grabFrames(src, (frame) => {
			const frameResized = frame.resizeToMax(320);

			// detect faces
			const faceRects = detectFaces(frameResized);
			if (faceRects.length) {
				// draw detection
				faceRects.forEach(faceRect => drawBlueRect(frameResized, faceRect));
			}
			callback(cv.imencode('.jpg', frameResized));
		});
	}
}

module.exports = new OpencvHelpers();
