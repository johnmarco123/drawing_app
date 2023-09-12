/*
    Fills an area of pixels that the user clicks.
    If the user clicks on a yellow pixel, that pixel and all adjacent yellow
    pixels will be painted the chosen color
*/
function FillBucketTool(){
    this.name = "Fill Bucket"
    this.icon = "images/fillBucket.jpg"
    // this manual gets injected into the tool help for each tool, it must
    // be written in valid html
    this.manual = 
        `
        <ol>
        <li>Click in an area you would like to fill with the currently selected color</li>
        <li>If you need more accuracy select the accuracy button</li>
        </ol>
        `;

    this.changeColor = null;
    this.bucketMode = "speed";
    this.mouseLocked = false;

    // the click handler we  use for the buttons cannot access this so we will
    // save it here so it can later
    const self = this;
    this.draw = () => {
        // if the user clicks on the canvas
        if (mouseIsPressed && MOUSE_ON_CANVAS) {
            const pixCoords = [mouseX, mouseY];  // get the original click position
            const currPixel = getPix(pixCoords); // get the pixel value under the cursor 
            const rgba = [
                pixels[currPixel],
                pixels[currPixel + 1],
                pixels[currPixel + 2],
            ];

            // save the color we want to change (change color) to the pixel
            // value we just got that was under the cursor
            self.changeColor = rgba;  

            // if our current bucket color does not equal the color we want to change
            // and the mouse isn't locked we allow start the flood fill algorithm
            if (String(CURRENT_COLOR) != String(color(self.changeColor)) && !self.mouseLocked) {
                loadPixels();
                fillColor(pixCoords);
                updatePixels();
            }
        }
    }

    // P5 stores pixels as a 1D array, therefore we need this converter
    // to use x and y coordinates for other functions
    const getPix = coords => (coords[1] * width + coords[0]) * 4;

    // check if the pixel under the given coords is the same as the color we want
    // to change to
    function sameColorAsTarget(coords) {
        const pixIdx = getPix(coords);
        const [pixR, pixG, pixB] = [pixels[pixIdx], pixels[pixIdx + 1], pixels[pixIdx + 2]];
        const [changeR, changeG, changeB] = self.changeColor;
        return (pixR == changeR && pixG == changeG && pixB == changeB);
    }


    // color the pixel at the given coords with the current color;
    function color1Pixel(coords) {
        const pixIdx = getPix(coords);
        [pixels[pixIdx], pixels[pixIdx + 1], pixels[pixIdx + 2]] = CURRENT_COLOR.levels;
    }

    /*
     given an array [x, y] we fill a 3x3 cell around it. 
     In other words, lets say we have the coordinates below that are all red
     marked with R, if our x, y coordinate array starts in the middle of the
     square we go from the left picture to the right picture (assuming we are
     changing colors from red to green

      Before:                       After:
                          |\
     R R R R R            | \      R R R R R
     R R R R R      ______|  \     R G G G R
     R R R R R     |          \    R G G G R
     R R R R R     |______    /    R G G G R
     R R R R R            |  /     R R R R R
                          | /
                          |/

     we paint the X as well as all the "O" around it
    */
    function color3x3Grid([x, y]) {
        // gathering the 3x3 grid coords
        const n1 = getPix([x - 1, y - 1]);
        const n2 = getPix([x, y - 1]);
        const n3 = getPix([x + 1, y - 1]);
        const n4 = getPix([x - 1, y]);
        const n5 = getPix([x, y]);
        const n6 = getPix([x + 1, y]);
        const n7 = getPix([x - 1, y + 1]);
        const n8 = getPix([x, y + 1]);
        const n9 = getPix([x + 1, y + 1]);

        // the grid we will be coloring
        const grid = 
            [
                n1, n2, n3,
                n4, n5, n6,
                n7, n8, n9,
            ];

        for (let i = 0; i < grid.length; i++) {
            let pixIdx = grid[i];
            [pixels[pixIdx], pixels[pixIdx + 1], pixels[pixIdx + 2]] = CURRENT_COLOR.levels
        }
    }


    // there are two modes, speedy mode and accuracy mode
    // Speedy mode fills 3x3 grids at a time whilst accuracy mode fills
    // 1 pixel at a time
    function fillColor(currCoords) {
        let n;
        let stack = [currCoords]; // breadth first fill cells

        // sometimes infinite loops happen for the fill tool but very rarely,
        // this will grab the current time and use it to break infinite loops
        // incase one occurs
        const start = performance.now(); 
        while (stack.length > 0) {
            // if its been 3 seconds and the fill isn't done, we will assume
            // it is an infinite loop and break
            if (performance.now() - start > 3000) {
                alert("INFINITE LOOP TERMINATED!!");
                return;
            }
            const curr = stack.pop();
            if (self.bucketMode === "speed") {
                color3x3Grid(curr); // speedy mode colors 3x3 grids
                n = 3;              // 3 pixels at a time
            } else { 
                color1Pixel(curr);  // accuracy mode colors 1 pixel at a time
                n = 1;              // 1 pixel at a time
            };

            [x, y] = curr;
            let [top, bot, left, right] = [[x+n,y],[x-n,y],[x,y+n],[x,y-n]];
            // check each direction, if it is the same color as the target
            // color we add that coordinate to our stack to color
            if (sameColorAsTarget(top)) stack.push(top); 
            if (sameColorAsTarget(bot)) stack.push(bot); 
            if (sameColorAsTarget(left)) stack.push(left); 
            if (sameColorAsTarget(right)) stack.push(right); 
        }
        self.mouseLocked = false;
    }

    // reset the tools current mode to speed (3x3 fill mode) 
    // when we unselect the tool and clear the tools options
    this.unselectTool = function() {
        self.bucketMode = "speed";
    };

    this.populateOptions = function() {
        select(".tempOptions").html(
            `<button 
            id='bucketMode'>
            Accuracy fill</button>`);
        select("#bucketMode").mouseClicked(function() {
            // we display the next mode, to the user so that they can choose
            // that mode if they decide to click the button, thats why
            // button.html is different from self.bucketMode
            var button = select("#" + this.elt.id);
            if (self.bucketMode == "accuracy") {
                self.bucketMode = "speed";
                button.html('Accuracy fill');
            } else {
                self.bucketMode = "accuracy";
                button.html('Speedy fill');
            }
        });
    };
}
