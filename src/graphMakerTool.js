function GraphMakerTool() {
    this.icon = "images/graphMaker.jpg";
    this.name = "graphMaker";
    this.mode = "node";
    let self = this;

    // The following values store the locations from the last frame, they start 
    // at -1 since no drawing has happened yet
    let startMouseX = -1;
    let startMouseY = -1;
    let drawing = false;

    this.draw = function() {
        // draw an arrow for a vector at a given base position
        // When the mouse is pressed
        if (mouseOnCanvas()) {
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
                    let start = createVector(startMouseX, startMouseY);
                    let curr = createVector(mouseX - startMouseX, mouseY - startMouseY);
                    let arrow_size = 15;
                    let circle_size = select("#nodeSize").value();
                    push();
                    translate(start.x, start.y);
                    if (self.mode == "node") {
                    push()
                    noStroke();
                    ellipse(0, 0, circle_size);
                    pop();
                    }
                    line(0, 0, curr.x, curr.y);
                    rotate(curr.heading());
                    translate(curr.mag() - arrow_size, 0);
                    triangle(0, arrow_size / 2, 0, -arrow_size / 2, arrow_size, 0);
                    pop();
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

    this.unselectTool = function() {
        clearOptions();
    };

    this.populateOptions = function() {
        select(".tempOptions").html(
            `Node size: 
            <input type='range'
            min='60' max='120' 
            value='60' class='slider'
            id='nodeSize'>

            <button id='node-mode'>
            ${self.mode == "node" ? "No node" : "Node"} mode
            </button>
            `);

        select("#node-mode").mouseClicked(function() {
              var button = select("#" + this.elt.id);
              if (self.mode == "node") {
                  self.mode = "No node";
                  button.html("node mode");
              } else {
                  self.mode = "node";
                  button.html("No node mode");
              }
        });
    };
}
