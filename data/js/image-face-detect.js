'use strict';

class FaceDetect {
	detectFace() {
		fetch('/detect-faces')
			.then((resp) => resp.arrayBuffer())
			.then((data) => {
				this.drawFace(data);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	drawFace(data) {
		const canvas = document.getElementById('canvas-video');
		const context = canvas.getContext('2d');
		const img = new Image();

		context.fillStyle = '#333';
		context.fillText('Loading...', canvas.width / 2 - 30, canvas.height / 3);


		const base64String = btoa(new Uint8Array(data).reduce(function (data, byte) {
			return data + String.fromCharCode(byte);
		}, ''));

		img.onload = function () {
			context.drawImage(this, 0, 0, canvas.width, canvas.height);
		};
		img.src = 'data:image/jpg;base64,' + base64String;
	}
}

const faceDetect = new FaceDetect();
faceDetect.detectFace();

