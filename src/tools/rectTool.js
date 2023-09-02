function RectTool(){
    this.icon = "images/rect.jpg";
    this.name = "Square";
    this.mode = "fill";
    let self = this;
    this.manual = 
        `
        <ol>
            <li>Click and drag to create an rectangle</li>
            <li>Release once the rectangle is of the desired size</li>
        </ol>
        `;

    // The following values store the locations from the last frame, they start at -1 since no drawing has happened yet.
    var startMouseX = -1;
    var startMouseY = -1;
    var drawing = false;

    this.draw = function(){
        // When the mouse is pressed
        if (MOUSE_ON_CANVAS) {
            if (mouseIsPressed) {
                // If this is the first initial click from the user
                if (startMouseX == -1) {
                    // We start the mouse location at the users current mouse location and we set drawing to true
                    startMouseX = mouseX;
                    startMouseY = mouseY;
                    drawing = true;
                    // save the current pixel array
                    loadPixels();
                } else {
                    //update the screen with the saved pixels to hide any previous line between mouse pressed and released
                    updatePixels();
                    push();
                    if (self.mode != "fill") noFill();
                    rectMode(CORNERS);
                    rect(startMouseX, startMouseY, mouseX, mouseY)	
                    pop();
                }

            }
            // if the user WAS drawing, but has now lifted their mouseclick, then they are finished that drawing 
            else if(drawing){
                // We set drawing to false, and reset the startMouse positions to -1 to prepare for the next time the user clicks to draw again.
                    drawing = false;
                startMouseX = -1;
                startMouseY = -1;
            }
        }
    };

    this.populateOptions = function() {
        select(".tempOptions").html(
            `<button id='fill'>${self.mode == "fill" ? "No fill" : "fill"}</button>`);
        select("#fill").mouseClicked(function() {
            var button = select("#" + this.elt.id);
            button.html(self.mode);
            self.mode = self.mode == "fill" ? "No fill" : "fill";
        });
    };

}
