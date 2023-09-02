function FillBucketTool(){
    this.name = "Fill Bucket"
    this.icon = "images/fillBucket.jpg"
    this.changeColor = null;
    this.bucketMode = "speed";
    this.mouseLocked = false;
    this.manual = 
        `
        <ol>
            <li>Click in an area you would like to fill with the currently selected color</li>
            <li>If you need more accuracy select the accuracy button</li>
        </ol>
        `;
    const self = this;

    this.draw = function() {
        if (mouseIsPressed && MOUSE_ON_CANVAS) {
            const pixCoords = [mouseX, mouseY];
            const currPixel = getPix(pixCoords); 
            const rgba = [
                pixels[currPixel],
                pixels[currPixel + 1],
                pixels[currPixel + 2],
            ];

            self.changeColor = rgba;
            if (String(CURRENT_COLOR) != String(color(self.changeColor)) && !self.mouseLocked) {
                loadPixels();
                fillColor(pixCoords);
                updatePixels();
            }
        }
    }

    // P5 stores pixels as a 1D array, therefore we need this converter
    // to use x and y coordinates for other functions
    function getPix(coords) {
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


    function color_1_pixel(coords) {
        let pix = getPix(coords);
        let [c1, c2, c3] = CURRENT_COLOR.levels;
        pixels[pix] = c1;
        pixels[pix + 1] = c2;
        pixels[pix + 2] = c3;
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

        let c1 = CURRENT_COLOR.levels[0];
        let c2 = CURRENT_COLOR.levels[1];
        let c3 = CURRENT_COLOR.levels[2];

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
    function fillColor(currCoords) {
        let stack = [currCoords]; 
        let top, bot, left, right, x, y;
        let start = performance.now(); // keeping this just incase...
            while (stack.length > 0) {
                if (performance.now() - start > 3000) {
                    alert("INFINITE LOOP TERMINATED!!");
                    return;
                }
                let curr = stack.pop();
                let n = 1; // 1 pixel at a time
                if (self.bucketMode === "speed") {
                    color_3x3_grid(curr); // Speedy mode colors 3x3 grids
                    n = 3; // 3 pixels at a time
                } else { 
                    color_1_pixel(curr); // Accuracy mode colors 1 pixel at a time
                };
                [x, y] = curr;
                let dir = [top, bot, left, right] = [[x+n,y],[x-n,y],[x,y+n],[x,y-n]];
                dir.forEach(x => {
                    if (sameColorAsTarget(x)) {
                        stack.push(x);
                    }
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
