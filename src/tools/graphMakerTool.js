/*
    Places nodes and arrows to create graphs for representing algorithms such
    as dijkstras, etc
*/
function GraphMakerTool() {
    // set the REQUIRED icon, name and manual for the tool.
    this.icon = "images/graphMaker.jpg";
    this.name = "Graph Maker";
    // this manual gets injected into the tool help for each tool, it must
    // be written in valid html
    this.manual = 
        `
        <ol>
            <li>Click to place a node</li>
            <li>If you drag after clicking, it will also draw an arrow towards your cursor</li>
            <li>You can turn the numbers off with the toggle button in the bottom menu</li>
            <li>You can also turn off the nodes entirely if you would like to place only arrows</li>
            <li>You can change the number on each node in the input field below</li>
        </ol>
        `;

    this.nodeMode = "node";
    this.countOn = true;

    // the click handler we  use for the buttons cannot access this so we will
    // save it here so it can later
    const self = this;
    // The following values store the locations from the last frame, they start 
    // at -1 since no drawing has happened yet
    let [startMouseX, startMouseY] = [-1, -1];
    this.draw = () => {
        if (MOUSE_ON_CANVAS) {
            if (mouseIsPressed) {
                // If this is the first initial click from the user
                if (startMouseX == -1) {
                    loadPixels(); // save nodes that were placed before
                    // the start pos is where the user currently clicked
                    [startMouseX, startMouseY] = [mouseX, mouseY];
                } else {
                    //update the screen with the saved pixels to hide any previous 
                    //line between mouse pressed and released
                    updatePixels();
                    // we turn start and curr into vectors
                    const start = createVector(startMouseX, startMouseY);
                    const curr = createVector(mouseX - startMouseX, mouseY - startMouseY);
                    // and declare our arrow and node size
                    const arrowSize = 15;
                    const nodeDiameter = 60;
                    push();
                    fill(255);
                    translate(start.x, start.y);
                    if (self.nodeMode == "node") {
                        ellipse(0, 0, nodeDiameter, nodeDiameter);
                    }
                    stroke(255);
                    line(0, 0, curr.x, curr.y);
                    push()
                    // we have to get the heading of the current position
                    // and use it to rotate the triangle in the correc
                    // direction
                    rotate(curr.heading());
                    translate(curr.mag() - arrowSize, 0);
                    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
                    pop()
                    if (self.countOn && self.nodeMode == "node") {
                        push()
                        textSize(30);
                        strokeWeight(1);
                        fill(0);
                        textAlign(CENTER);
                        text(Number(select("#graphNum").value()), -3, -12, 5, 50)
                        pop();
                    }
                    pop();
                }

                // if the mouse has been set we can now reset it and add to 
                // our node count
            } else if (startMouseX != -1) {
                // We set drawing to false, and reset the startMouse positions
                // to -1 to prepare for the next time the user clicks to draw
                // again
                startMouseX = startMouseY = -1;

                // we increase the number on each node by 1;
                if (this.countOn && this.nodeMode == "node") {
                    const currNum = Number(select("#graphNum").value());
                    select("#graphNum").value(currNum + 1);
                }
            }
        }
    };

    // any options that this function needs we declare here, for example: 
    // buttons, input fields, etc
    this.populateOptions = () => {
        select(".tempOptions").html(
            `<button id='node-mode'>
            ${this.nodeMode == "node" ? "No node" : "Node"} mode
            </button>

            <button id='count-mode'>
            Numbers ${this.countOn ? "off" : "on"}
            </button>

            <input id="graphNum" type="number"></input
            `);

        select("#node-mode").mouseClicked(function() {
            const button = select("#" + this.elt.id);
            if (self.nodeMode == "node") {
                self.nodeMode = "No node";
                button.html("node mode");
            } else {
                self.nodeMode = "node";
                button.html("No node mode");
            }
        });

        select("#count-mode").mouseClicked(function() {
           const button = select("#" + this.elt.id);
            if (self.countOn) {
                self.countOn = false;
                button.html("Numbers on");
            } else {
                self.countOn = true;
                button.html("Numbers off");
            }
        });
    };
}
