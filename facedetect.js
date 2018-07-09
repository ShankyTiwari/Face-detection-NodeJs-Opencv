const cv = require('opencv4nodejs');
const path = require('path');

class Test {
    getDataFilePath(fileName) {
        return path.resolve(path.resolve(__dirname, 'data'), fileName);
    }

    drawRect(image, rect, color, opts = {
        thickness: 2
    }) {
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

    detectFace() {
        const image = cv.imread(this.getDataFilePath('test.jpg'));
        const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

        // detect faces
        const {
            objects,
            numDetections
        } = classifier.detectMultiScale(image.bgrToGray());
        console.log('faceRects:', objects);
        console.log('confidences:', numDetections);

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

        cv.imshowWait('face detection', image);
    }

}



const test = new Test();
test.detectFace();