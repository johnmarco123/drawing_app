function GraphMakerTool() {
    this.icon = "images/graphMaker.jpg";
    this.name = "graphMaker";
    this.node_mode = "node";
    this.count_on = true;
    let self = this;

    // The following values store the locations from the last frame, they start 
    // at -1 since no drawing has happened yet
    let startMouseX = -1;
    let startMouseY = -1;
    let count = -1;
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
                    if (self.count_on && self.node_mode == "node") {
                        count++;
                    }
                    drawing = true;
                    // save the current pixel array
                    loadPixels();
                } else {
                    //update the screen with the saved pixels to hide any previous 
                    //line between mouse pressed and released
                    updatePixels();
                    let start = createVector(startMouseX, startMouseY);
                    let curr = createVector(mouseX - startMouseX, mouseY - startMouseY);
                    let arrow_size = 15;
                    const node_diameter = 60;
                    push();
                    fill(255);
                    stroke(255);
                    translate(start.x, start.y);
                    if (self.node_mode == "node") {
                        push()
                        noStroke();
                        ellipse(0, 0, node_diameter);
                        pop();
                    }
                    line(0, 0, curr.x, curr.y);
                    push()
                    rotate(curr.heading());
                    translate(curr.mag() - arrow_size, 0);
                    triangle(0, arrow_size / 2, 0, -arrow_size / 2, arrow_size, 0);
                    pop()
                    if (self.count_on && self.node_mode == "node") {
                        push()
                        textSize(30);
                        strokeWeight(1);
                        fill(0);
                        textAlign(CENTER);
                        text(count, -3, -12, 5, 50)
                        pop();
                    }
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
            `<button id='node-mode'>
            ${self.node_mode == "node" ? "No node" : "Node"} mode
            </button>
            <button id='count-mode'>
            Numbers ${self.count_on ? "off" : "on"}
            </button>
            `);

        select("#node-mode").mouseClicked(function() {
            var button = select("#" + this.elt.id);
            if (self.node_mode == "node") {
                self.node_mode = "No node";
                button.html("node mode");
            } else {
                self.node_mode = "node";
                button.html("No node mode");
            }
        });

        select("#count-mode").mouseClicked(function() {
            var button = select("#" + this.elt.id);
            if (self.count_on) {
                self.count_on = false;
                count = -1;
                button.html("Numbers on");
            } else {
                self.count_on = true;
                button.html("Numbers off");
            }
        });
    };
}
