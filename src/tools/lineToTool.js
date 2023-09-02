function LineToTool() {
    this.icon = "images/lineTo.jpg";
    this.name = "Line-to";
    this.manual = 
        `
        <ol>
            <li>Click on the canvas to choose the starting position of the line</li>
            <li>Drag and release to finish creating the line</li>
        </ol>
        `;
    let self = this;

    // The following values store the locations from the last frame, they start 
    // at -1 since no drawing has happened yet
    let startMouseX = -1;
    let startMouseY = -1;
    let drawing = false;

    this.draw = function() {
        // draw an arrow for a vector at a given base position
        // When the mouse is pressed
        if (MOUSE_ON_CANVAS) {
            if (mouseIsPressed) {
                // If this is the first initial click from the user
                if (startMouseX == -1) {
                    // We start the mouse location at the users current mouse 
                    // location and we set drawing to true
                    startMouseX = mouseX;
                    startMouseY = mouseY;
                    drawing = true;
                    // save the current pixel array
                    loadPixels();
                }

                else {
                    //update the screen with the saved pixels to hide any previous 
                    //line between mouse pressed and released
                    updatePixels();
                    line(startMouseX, startMouseY, mouseX, mouseY);
                }

                // if the user WAS drawing, but has now lifted their mouseclick, then 
                // they are finished that drawing 
            } else if (drawing) {
                // We set drawing to false, and reset the startMouse positions to 
                // -1 to prepare for the next time the user clicks to draw again
                drawing = false;
                startMouseX = -1;
                startMouseY = -1;
            }
        }
    };
}

