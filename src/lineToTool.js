function LineToTool() {
    this.icon = "assets/lineTo.jpg";
    this.name = "LineTo";
    this.graph = false;

    // The following values store the locations from the last frame, they start 
    // at -1 since no drawing has happened yet.
    var startMouseX = -1;
    var startMouseY = -1;
    var drawing = false;


    this.draw = function() {
        // When the mouse is pressed
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

                // if (self.graph) {
                    // for(let i = 0; i < width; i+= width/20) {
                        // fill(255, 0, 0);
                        // ellipse(mouseX, mouseY, 50, 50)
                        // console.log(2)
                        // line(i, 0, i, height);
                        // line(0, i, width, i);
                    // }
                // }

                updatePixels();
                line(startMouseX, startMouseY, mouseX, mouseY);
            }

        }
        // if the user WAS drawing, but has now lifted their mouseclick, then 
        // they are finished that drawing 
        else if (drawing) {
            // We set drawing to false, and reset the startMouse positions to 
            // -1 to prepare for the next time the user clicks to draw again.
                drawing = false;
            startMouseX = -1;
            startMouseY = -1;
        }
    };

    this.unselectTool = function() {
        updatePixels();
        //clear options
        select(".options").html("");
        self.graph = false;
    };

    this.populateOptions = function() {
        select(".options").html(
            "<button id='graph'>Graph off</button>");
        //click handler
        select("#graph").mouseClicked(function() {
            var button = select("#" + this.elt.id);
            if (self.graph) {
                self.graph = false; button.html('Graph on');
            } else {
                self.graph = true; button.html('Graph off');
            }
        })
    }

};
