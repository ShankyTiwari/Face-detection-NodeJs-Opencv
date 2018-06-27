'use strict';

const socket = io.connect('http://localhost:3000/');

const canvas = document.getElementById('canvas-video');
const context = canvas.getContext('2d');
const img = new Image();

context.fillStyle = '#333';
context.fillText('Loading...', canvas.width / 2 - 30, canvas.height / 3);

socket.on('face', function (data) {
	const uint8Arr = new Uint8Array(data.buffer);
	const str = String.fromCharCode.apply(null, uint8Arr);
	const base64String = btoa(str);

	img.onload = function () {
		context.drawImage(this, 0, 0, canvas.width, canvas.height);
	};
	img.src = 'data:image/png;base64,' + base64String;
});