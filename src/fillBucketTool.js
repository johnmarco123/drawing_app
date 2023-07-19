function FillBucketTool(){
    this.name = "fillBucketTool"
    this.icon = "images/fillBucket.jpg"
    this.changeColor = this.bucketColor = null;
    this.bucketMode = "speed";
    this.mouseLocked = false;
    const self = this;

    this.draw = function() {
        if (mouseIsPressed && mouseOnCanvas()) {
            const pixCoords = [mouseX, mouseY];
            const currPixel = getPix(pixCoords); 
            const rgba = [
                pixels[currPixel],
                pixels[currPixel + 1],
                pixels[currPixel + 2],
            ];

            self.changeColor = rgba;
            self.bucketColor = getBucketColor();
            // If the clicked pixel is different from the current bucket
            // color
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

    // P5 stores pixels as a 1D array, therefore we need this converter
    // to use x and y coordinates for other functions
    function getPix (coords) {
        return (coords[1] * width + coords[0]) * 4;
    }

    // check if the pixel under the coords is the same as the target color
    // aka the change color
    function sameColorAsTarget(coords) {
        const pix = getPix(coords);
        // We don't care about checking opacity, so we only iterate over the
        // first three values
        if (pixels[pix] === self.changeColor[0] && 
            pixels[pix + 1] === self.changeColor[1] && 
            pixels[pix + 2] === self.changeColor[2]) {
            return true;
        }

        return false;
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

    function color_1_pixel(coords) {
        let pix = getPix(coords);
        pixels[pix] = self.bucketColor[0];
        pixels[pix + 1] = self.bucketColor[1];
        pixels[pix + 2] = self.bucketColor[2];
    }

    function color_3x3_grid(coords) {

        // gathering the 3x3 grid coords
        let n1 = getPix([coords[0] - 1, coords[1] - 1]);
        let n2 = getPix([coords[0], coords[1] - 1]);
        let n3 = getPix([coords[0] + 1, coords[1] - 1]);
        let n4 = getPix([coords[0] - 1, coords[1]]);
        let n5 = getPix(coords);
        let n6 = getPix([coords[0] + 1, coords[1]]);
        let n7 = getPix([coords[0] - 1, coords[1] + 1]);
        let n8 = getPix([coords[0], coords[1] + 1]);
        let n9 = getPix([coords[0] + 1, coords[1] + 1]);

        let c1 = self.bucketColor[0]
        let c2 = self.bucketColor[1]
        let c3 = self.bucketColor[2]
        // the grid we will be coloring
        let grid = 
            [
                n1, n2, n3,
                n4, n5, n6,
                n7, n8, n9,
            ]

        for (let i = 0; i < grid.length; i++) {
            let pix = grid[i];
            pixels[pix] = c1;
            pixels[pix + 1] = c2;
            pixels[pix + 2] = c3;
        }
    }

    // There are two modes, speedy mode and accuracy mode.
        // Speedy mode fills 3x3 grids at a time whilst accuracy mode fills
    // 1 pixel at a time

    // Remake fillcolor and optimize its speed

    function fillColor(currCoords) {
        let stack = [currCoords]; 
        let top, bot, left, right;
        while (stack.length > 0) {
            let curr = stack.pop();
            if (self.bucketMode === "speed") {
                color_3x3_grid(curr); // Speedy mode colors 3x3 grids
                [x, y] = curr;
                [top, bot, left, right] = [[x+3,y],[x-3,y],[x,y+3],[x,y-3]];
            } else { 
                color_1_pixel(curr); // Accuracy mode colors 1 pixel at a time
                [x, y] = curr;
                [top, bot, left, right] = [[x+1,y],[x-1,y],[x,y+1],[x,y-1]];
            };

            [top, bot, right, left].forEach(x => {
                if (sameColorAsTarget(x)) stack.push(x);
            });
        }
        self.mouseLocked = false;
    }

    this.unselectTool = function() {
        clearOptions();
        self.bucketMode = "speed";
        updatePixels();
    };

    this.populateOptions = function() {
        select(".tempOptions").html(
            `<button 
            id='bucketMode'>
            Accuracy fill</button>`);
        // click handler
        select("#bucketMode").mouseClicked(function() {
            var button = select("#" + this.elt.id);
            if (self.bucketMode == "accuracy") {
                self.bucketMode = "speed";
                self.draw();
                button.html('Accuracy fill');
            } else {
                self.bucketMode = "accuracy";
                self.draw();
                button.html('Speedy fill');
            }
        });
    };
}
