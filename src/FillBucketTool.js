// *******************************************************************************
// ALL CODE IN THE FILL BUCKET TOOL HERE WAS WRITTEN BY MYSELF WITH NO HELP
// *******************************************************************************
function FillBucketTool(){
    this.name = "fillBucketTool"
    this.icon = "assets/fillBucket.jpg"
    this.changeColor = this.bucketColor = null;
    this.mouseLocked = false;

    const self = this;

    function getPix (coords) {
        return (coords[1] * width + coords[0]) * 4;
    }

    function changePixColor(coords, color) {
        let pix = getPix(coords);
        pixels[pix] = color[0];
        pixels[pix + 1] = color[1];
        pixels[pix + 2] = color[2];
    }

    function sameColorAsTarget(coords) {
        const pix = getPix(coords);
        // We don't care about checking opacity, so we only iterate over the
        // first three values
        if (pixels[pix] !== self.changeColor[0] || 
            pixels[pix + 1] !== self.changeColor[1] || 
            pixels[pix + 2] !== self.changeColor[2]) {
            return false;
        }

        return true;
    }

    function getBucketColor() {
        let [x, y] = [5, 5];
        push();
        noStroke();
        ellipse(x, y, 3);
        loadPixels();
        const pixUnderCursor = getPix([x, y]);
        const currentColor = [pixels[pixUnderCursor],
                              pixels[pixUnderCursor + 1],
                              pixels[pixUnderCursor + 2]]
        fill(self.changeColor);
        ellipse(x, y, 6); 
        loadPixels();
        pop();
        return currentColor;
    }

    function fillColor(currCoords) {
        let stack = [currCoords];
        while (stack.length > 0) {
            let curr = stack.pop();
            changePixColor(curr, self.bucketColor);
            const [x, y] = curr;
            const top = [x, y - 1];
            const bot = [x, y + 1];
            const left = [x - 1, y];
            const right = [x + 1, y];
            if (sameColorAsTarget(top)) stack.push(top) 
            if (sameColorAsTarget(bot)) stack.push(bot); 
            if (sameColorAsTarget(right)) stack.push(right);
            if (sameColorAsTarget(left)) stack.push(left);
        }
        self.mouseLocked = false;
    }

    this.draw = function() {
        if (mouseIsPressed && mousePressOnCanvas()) {
            const pixCoords = [mouseX, mouseY];
            const currPixel = getPix(pixCoords); 
            const rgba = [
                pixels[currPixel],
                pixels[currPixel + 1],
                pixels[currPixel + 2],
            ];

            self.changeColor = rgba;
            self.bucketColor = getBucketColor();
            if (self.bucketColor[0] !== self.changeColor[0] ||
                self.bucketColor[1] !== self.changeColor[1] ||
                self.bucketColor[2] !== self.changeColor[2] ||
                self.mouseLocked) {
                loadPixels();
                fillColor(pixCoords);
                updatePixels();
            }
        }
    }

}
