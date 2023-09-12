/*
    This tool allows the user to select an area and move it around. It also
    allows them to paste copies of this selected area
*/
function SelectTool(){
    // set the REQUIRED icon, name and manual for the tool.
    this.name = "Select";
    this.icon = "images/select.jpg";
    // this manual gets injected into the tool help for each tool, it must
    // be written in valid html
    this.manual = 
        `
        <ol>
            <li>Click and drag to highlight an area to move</li>
            <li>Release the mouse to select the highlighted area</li>
            <li>Click within the highlighted area and drag to move it</li>
            <li>Click outside of the selected area to place it</li>
            <li>You can paste another selected of the highlighted area with the paste button below</li>
        </ol>
        `;

    this.mode = "select";
    this.startPos = null;    // the initial click position when first selecting
    this.endPos = null;      // the position when the user releases the mouse
    this.moveSection = null; // the pixels within the select area

    // when we use the button for this tool, we lose access to this, therefore
    // we save it now so we will have access to it later
    const self = this;

    // Given two p5.js vectors, this function will create a box from those
    // vectors and provide you the top left vectors x and y as well as the
    // width and height of the box
    function getCoordsForCut (start, end) {
        const [x, y] = [Math.min(start.x, end.x), Math.min(start.y, end.y)];
        const [x2, y2] = [Math.max(start.x, end.x), Math.max(start.y, end.y)];
        const [w, h] = [x2 - x, y2 - y];
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
    this.selectArea = () => {
        // we update pixels to remove old copies of the move area
        updatePixels(); 
        if(this.mode == "select" && mouseIsPressed && MOUSE_ON_CANVAS){
            this.startPos = this.endPos = createVector(mouseX, mouseY);
            // initialize the box for the box animation
            box = new BoxOfLines(x, y, w, h, [0, 120, 255]); 
            this.mode = "drag"; 

        } else if (this.mode == "drag" && mouseIsPressed) {
            this.endPos = createVector(mouseX, mouseY);
            noFill();
            [x, y, w, h] = getCoordsForCut(this.startPos, this.endPos);
            box.animate(x, y, w, h);
                
        } else if (this.mode == "drag" && !mouseIsPressed){
            const imageSizeIsValid = w != 0 && h != 0;
            // we check if the image size is big enough to be valid. If the
            // selected area is too small the p5.js "get" function will throw
            // an error
            if (imageSizeIsValid) { 
                this.moveSection = get(x, y, w, h); // get the section we will move
                noStroke();
                fill(0);
                rect(x, y, w, h); // fill the moved area, removing it from canvas
                loadPixels();
                box.animate(x, y, w, h); 
                this.mode = "moving";
            } else { 
                // if the image size isn't valid we allow user to select again
                this.mode = "select"; 
            }
        } else if (this.mode == "moving") {
            // update what the cursor looks like in each state
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
                    // if we are currently select area
                    if (inMoveArea(x, y, w, h) || dragging) {
                        dragging = true; // we ensure draggins is set to true
                        // if we haven't yet got our offset for the select area
                        // we initialize it here
                        if (dy == -1) {
                            [dx, dy] = [x - mouseX, y - mouseY];
                        }
                        // we then reset the x and y coordinates using the 
                        // offset so we can grab and move ths shape from any
                        // position
                        [x, y] = [dx + mouseX, dy + mouseY];
                    } else { // if we clicked outside of the move area
                        // we put the user back into select mode
                        this.mode = "select"; 
                        // we save the image on the canvas
                        image(this.moveSection, x, y); 
                        loadPixels(); 
                        // reset all the variables for the next iteration
                        this.startPos = this.moveSection = this.endPos = null;
                        // we return to avoid redrawing a null image as we just
                        // set the move section to null
                        return; 
                    }
                } else { // if the mouse is not pressed
                    dragging = false; // then we are not dragging the move area
                    dy = dx = -1;     // and we can reset the offset
                }
            }
            image(this.moveSection, x, y); // temporarliy drawing the move area
            box.animate(x, y, w, h);       // and animating the move area border
        }
    }

    // the main draw loop for this tool
    this.draw = () => {
        push();
        this.selectArea();
        pop();
    }


    // when we select a different tool
    this.unselectTool = () => {
        box?.tempDisable();    // we disable the box animation if we initialized a box
        this.draw();          // draw to remove the one from the last frame
        loadPixels();         // save the image onto the canvas
        this.mode = "select"; // put the user back into select mode
        // and reset all of the variables needed for this tool
        this.startPos = this.endPos = this.moveSection = null;
    };

    // this is used to disable elements that should not be saved to the canvas
    this.tempDisable = () => {
        box?.tempDisable();
    }

    // used to paste copies of the select area when the user clicks the paste
    // button
    function paste() {
        // we only want this function to work if there is a selected area to
        // paste
        if (self.moveSection !== null) {
            box.tempDisable();     // we disble the box animation
            self.draw();           // draw to the last frames box animation
            self.mode = "moving";  // put the user into moving mode
            loadPixels();          // draw the image to the screen
            x = y = 0;             // and then move the box to the top left
        }
    }

    // when this tool is selected this gets called
    this.populateOptions = () => {
        // the paste button
        select(".tempOptions").html(`<button id='paste'>paste</button>`);

        // when the paste button is clicked
        select("#paste").mouseClicked(() => paste());
    };
}
