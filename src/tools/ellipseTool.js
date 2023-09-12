/*
    Draws a circle at the users given mouse position that they can rescale
    by dragging
*/
function EllipseTool() {
    // set the REQUIRED icon, name and manual for the tool.
    this.icon = "images/ellipse.jpg";
    this.name = "Circle";
    // this manual gets injected into the tool help for each tool, it must
    // be written in valid html
    this.manual = 
        `
        <ol>
            <li>Click and drag to create an circle</li>
            <li>Release once the circle is of the desired size</li>
        </ol>
        `;

    this.mode = "fill";

    // the click handler we  use for the buttons cannot access this so we will
    // save it here so it can later
    const self = this;

    // the following values store the locations from the last frame, they start
    // at -1 since no drawing has happened yet
    let [startMouseX, startMouseY]  = [-1, -1];
    let drawing = false;

    this.draw = function(){
        // only start creating the circle if the mouse is on the canvas and is
        // pressed
        if (MOUSE_ON_CANVAS) {
            if (mouseIsPressed){
                // if this is the first initial click from the user
                if(startMouseX == -1){
                    // we start the mouse location at the users current mouse
                    // location and we set drawing to true
                    [startMouseX, startMouseY] = [mouseX, mouseY];
                    drawing = true;
                    loadPixels(); // save the current pixel array
                } else {
                    // update the screen with the saved pixels to hide any
                    // previous line between mouse pressed and released
                    updatePixels();
                    push();
                    if (self.mode != "fill") {
                        noFill(); 
                    }
                    ellipseMode(CORNERS);	
                    ellipse(startMouseX, startMouseY, mouseX, mouseY);
                    pop();
                }

            }
            // if the user WAS drawing, but has now lifted their mouseclick
            // then they are finished that drawing 
            else if(drawing){
                // we set drawing to false, and reset the start_mouse positions
                // to -1 to prepare for the next time the user clicks to draw
                // again
                drawing = false;
                startMouseX = startMouseY = -1;
            }
        };
    }
    // populates the options when this tool is selected
    this.populateOptions = function() {
        select(".tempOptions").html(
            `<button id="fill">${self.mode == "fill" ? "No fill" : "fill"}</button>`);

        select("#fill").mouseClicked(function() {
            const button = select("#" + this.elt.id);
            // set the buttons html to the current mode
            button.html(self.mode);
            // when this button is clicked, we alternate between fill and no
            // fill text inside the button
            self.mode = (self.mode == "fill") ? "No fill" : "fill";
        });
    };

}
