/*
    The user can cut out areas they want to remove, and also paste these
    areas and move them around if they want to
*/
function ScissorsTool(){
    // set the REQUIRED icon, name and manual for the tool.
    this.name = "Scissors";
    this.icon = "images/scissors.jpg";
    // this manual gets injected into the tool help for each tool, it must
    // be written in valid html
    this.manual = 
        `
        <ol>
            <li>Click and drag to select an area to cut</li>
            <li>Release the mouse to cut the selected area</li>
            <li>Click the paste button to paste the contents you copied</li>
            <li>You can then click within the pasted contents to move it around</li>
            <li>Click outside of the copied area to unselect it</li>
            <li>You can continue to paste as many copies as you'd like and repeat steps 3 to 5</li>
        </ol>
        `;

    this.mode = 'cut';     // the current mode that we are in
    this.cutSection = null // the pixels that have been cut from the canvas
    this.endPos = null     // the position that the user relases the mouse
    this.startPos = null;  // the position the user initially clicks
    this.firstCut = true;  // required to allow pasting of the first cut area
    // this isn't accessible in the button handler for this tool, so we will
    // save it here for future reference
    const self = this;     

    // Given two p5.js vectors, this function will create a box from those
    // vectors and provide you the top left vectors x and y as well as the
    // width and height of the box
    const getCoordsForCut = (start, end) => {
        let [x, y] = [Math.min(start.x, end.x), Math.min(start.y, end.y)];
        let [x2, y2] = [Math.max(start.x, end.x), Math.max(start.y, end.y)];
        let w = x2 - x;
        let h = y2 - y;
        return [x, y, w, h]; 
    }


    // returns true or false whether or not the current mouse position is in the
    // move area
    function inMoveArea(x, y, w, h) {
        return mouseX >= x && mouseX <= (x + w) && mouseY >= y && mouseY <= (y + h);
    }

    let x, y, w, h;
    let [dx, dy] = [-1, -1];
    let dragging = false;
    let box = null;
    this.handleBoxCut = () => {
        updatePixels(); // removes the last frame before drawing a new one
        if(self.mode == "cut" && mouseIsPressed && MOUSE_ON_CANVAS){
            self.startPos = self.endPos = createVector(mouseX, mouseY);
            // initialize the box for the box animation
            box = new BoxOfLines(x, y, w, h, [255, 0, 0]);
            self.mode = "drag";

        } else if (self.mode == "drag" && mouseIsPressed && MOUSE_ON_CANVAS) {
            self.endPos = createVector(mouseX, mouseY); // we get the end position of the box
            [x, y, w, h] = getCoordsForCut(self.startPos, self.endPos); 
            box.animate(x, y, w, h);
        } else if (self.mode == "drag" && !mouseIsPressed){
            let imageSizeIsValid = w != 0 && h != 0;
            // we check if the image size is big enough to be valid. If the
            // selected area is too small the p5.js "get" function will throw
            // an error
            if (imageSizeIsValid) { 
                self.first_cut = true;             // we got our first cut so we set it to true
                self.cutSection = get(x, y, w, h); // we get the area within the cut
                // we put a black rectangle over the cut area to "remove it"
                fill(0);                           
                noStroke();
                rect(x, y, w, h);
                // we then loadPixels so the black rectangle can be seen
                loadPixels();
                self.mode = "cut";
            }
        } else if (self.mode == "move") {

            if (inMoveArea(x, y, w, h)) {
                if (mouseIsPressed) {
                    cursor("grabbing"); // grabbing, if we are moving the move area
                } else {
                    cursor("grab"); // grab if we are near the move area but not moving it
                }
            } else {
                cursor("auto"); // or the regular pointer if neither of the above
            }

            if (MOUSE_ON_CANVAS) {
                if (mouseIsPressed) {
                    // if we are moving the cut area
                    if (inMoveArea(x, y, w, h) || dragging) {
                        dragging = true; // we can set dragging to true
                        if (dy == -1) {
                            // if we have not yet calculated an offset we do so here
                            [dx, dy] = [x - mouseX, y - mouseY];
                        }
                        // and then we set the x, y of the box relative to the offset
                        [x, y] = [dx + mouseX, dy + mouseY];
                    } else { // if the user clicks outside of the cut area
                        self.mode = "cut"; // we put the tool back into cu tmode
                        // save the image where it was last placed
                        image(self.cutSection, x, y);
                        loadPixels(); 
                        // and reset all the parameters
                        this.startPos = this.cutSection = this.endPos = null;
                        // we then return to ensure we go back to the start
                        // of our function and do not draw a null image below
                        return;
                    }
                } else {
                    // if the mouse is not pressed then we can reset our offset
                    // and this also means we are not dragging
                    dragging = false;
                    dy = dx = -1;
                }
            }
            image(self.cutSection, x, y); // draw the image onto the canvas
            box.animate(x, y, w, h);      // and the box animation
        }
    }

    // the main draw loop for this tool
    this.draw = () => {
        push();
        this.handleBoxCut();
        pop();
    }

    // when the user picks another tool this gets called
    this.unselectTool = () => {
        if (box != null) { // if there is a box animation
            box.tempDisable(); // we disable it
        }
        this.draw();   // and then remove the last frame of the box animation
        loadPixels();  // we then save the image to the canvas (if one has been drawn)
        this.startPos = this.endPos = this.cutSection = null; // set our parameters to null
        this.mode = 'cut'; // and return to cut mode
    };

    // this is used to disable elements that should not be saved to the canvas
    this.tempDisable = () => {
        box?.tempDisable();
    }

    // used to paste copies of the select area when the user clicks the paste
    // button
    function paste() {
        if (self.cutSection !== null) {
            if (!self.firstCut) {  // if it is not the first cut
                box.tempDisable(); // we disble the box animation
                self.draw();       // remove the last frames box animation
            }
            self.firstCut = false; // this is no longer the first cut so we set this to false
            self.mode = "move";    // put the user into move mode
            loadPixels();          // save the canvas
            x = y = 0;             // and then move the box to the top left
        }
    }

    // this gets called when the user selects this tool
    this.populateOptions = function() {
        // initialize the paste button at the bottom of the screen
        select(".tempOptions").html(`<button id="paste">paste</button>`);
        // when clicked it should call the paste function
        select("#paste").mouseClicked(() => paste());
    };
}
